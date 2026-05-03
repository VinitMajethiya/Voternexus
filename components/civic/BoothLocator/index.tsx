"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { 
  MapPin, Navigation, Search, Accessibility, 
  Clock, ArrowRight, Info, Eye
} from 'lucide-react';
import { BoothLocation } from '@/types';

export default function BoothLocator() {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number}>({lat: 18.5204, lng: 73.8567});
  const [booths, setBooths] = useState<BoothLocation[]>([]);
  const [voterId, setVoterId] = useState('');
  const [loading, setLoading] = useState(false);
  const [wheelchairAccess, setWheelchairAccess] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    // Fetch fallback booths
    fetch('/data/booths.geojson')
      .then(res => res.json())
      .then(data => {
        const mapped = data.features.map((f: any) => ({
          booth_number: f.properties.booth_number,
          booth_name: f.properties.booth_name,
          address: f.properties.address,
          district: f.properties.district,
          state: f.properties.state,
          latitude: f.geometry.coordinates[1],
          longitude: f.geometry.coordinates[0],
          is_accessible: f.properties.is_accessible,
          queue_status: 'unknown',
          queue_reported_at: null
        }));
        setBooths(mapped);
      }).catch(err => console.warn('Failed to fetch geojson', err));

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places', 'streetView']
    });

    loader.importLibrary('maps').then(({ Map }) => {
      if (mapRef.current) {
        const m = new Map(mapRef.current, {
          center: userLocation,
          zoom: 15,
          mapId: 'DEMO_MAP_ID',
        });
        setMap(m);

        loader.importLibrary('routes').then(({ DirectionsService, DirectionsRenderer }) => {
          setDirectionsService(new DirectionsService());
          const renderer = new DirectionsRenderer();
          renderer.setMap(m);
          setDirectionsRenderer(renderer);
        });
      }
    }).catch(e => console.error('Failed to load Google Maps', e));
  }, []);

  useEffect(() => {
    if (!map) return;
    map.setCenter(userLocation);

    // Render booth markers
    booths.forEach(booth => {
      new google.maps.Marker({
        position: { lat: booth.latitude, lng: booth.longitude },
        map,
        title: booth.booth_name,
      });
    });
  }, [userLocation, booths, map]);

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({lat: pos.coords.latitude, lng: pos.coords.longitude});
      });
    }
  };

  const handleVoterSearch = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const handleGetDirections = (booth: BoothLocation) => {
    if (!directionsService || !directionsRenderer) return;

    const request: google.maps.DirectionsRequest = {
      origin: userLocation,
      destination: { lat: booth.latitude, lng: booth.longitude },
      travelMode: google.maps.TravelMode.TRANSIT, // Use transit for wheelchair examples
      provideRouteAlternatives: true,
    };

    if (wheelchairAccess) {
      request.transitOptions = {
        modes: [google.maps.TransitMode.BUS, google.maps.TransitMode.RAIL],
        routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS,
      };
    }

    directionsService.route(request, (result, status) => {
      if (status === 'OK' && result) {
        directionsRenderer.setDirections(result);
      } else {
        alert('Directions request failed due to ' + status);
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Controls */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bento-card space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Search className="w-4 h-4 text-phase" />
              Find your booth
            </h3>
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="Enter Voter ID (EPIC)"
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-phase/20 outline-none"
              />
              <button 
                onClick={handleVoterSearch}
                className="btn-primary w-full py-2 text-sm"
              >
                Search by ID
              </button>
            </div>
            <div className="relative">
               <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
               <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-300"><span className="bg-white px-2">OR</span></div>
            </div>
            <button 
              onClick={handleLocateUser}
              className="w-full py-2 border border-slate-200 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
            >
              <Navigation className="w-3 h-3" />
              Use Current Location
            </button>
          </div>

          <div className="bento-card space-y-4 bg-slate-50 border-none">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Info className="w-4 h-4" />
                  <span>BOOTH DETAILS</span>
                </div>
                <label className="flex items-center text-xs text-slate-600 gap-1 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={wheelchairAccess} 
                    onChange={e => setWheelchairAccess(e.target.checked)} 
                    className="rounded text-blue-600 focus:ring-blue-500" 
                  />
                  ♿ Wheelchair Accessible
                </label>
             </div>
             
             {booths.length > 0 ? (
               <div className="space-y-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm space-y-1 relative">
                    <p className="font-bold text-slate-900 text-sm">{booths[0].booth_name}</p>
                    <p className="text-xs text-slate-500 leading-tight">{booths[0].address}</p>
                    
                    {/* Mock Street View thumbnail */}
                    <div className="mt-3 relative h-20 bg-gray-200 rounded overflow-hidden group cursor-pointer flex items-center justify-center">
                       <img 
                          src={`/api/maps/streetview?lat=${booths[0].latitude}&lng=${booths[0].longitude}`}
                          alt="Street view preview"
                          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                       />
                       <div className="z-10 flex items-center gap-1 text-xs font-bold bg-black/60 text-white px-2 py-1 rounded">
                         <Eye className="w-3 h-3" />
                         Street View
                       </div>
                    </div>

                    <button 
                      onClick={() => handleGetDirections(booths[0])}
                      className="w-full mt-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                    >
                      Get Directions
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 p-2 bg-green-50 rounded-lg flex flex-col items-center gap-1">
                      <Accessibility className="w-4 h-4 text-green-600" />
                      <span className="text-[10px] font-bold text-green-700">Accessible</span>
                    </div>
                    <div className="flex-1 p-2 bg-amber-50 rounded-lg flex flex-col items-center gap-1">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="text-[10px] font-bold text-amber-700">Mod. Queue</span>
                    </div>
                  </div>
               </div>
             ) : (
               <p className="text-sm text-slate-400 italic">No booth selected</p>
             )}
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 h-[500px] rounded-[2rem] overflow-hidden border-4 border-slate-100 shadow-xl relative z-10 bg-slate-200">
           <div ref={mapRef} className="w-full h-full flex items-center justify-center text-slate-400">
             {map ? null : "Loading Google Maps..."}
           </div>
        </div>
      </div>
    </div>
  );
}
