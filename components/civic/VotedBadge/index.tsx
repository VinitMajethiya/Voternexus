"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Share2, 
  Palette, 
  User, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { fabric } from 'fabric';

const TEMPLATES = [
  { id: 'classic', name: 'Civic Classic', bg: '#1A56DB', text: '#FFFFFF' },
  { id: 'retro', name: 'Retro Press', bg: '#FF6B2C', text: '#FFFFFF' },
  { id: 'glass', name: 'Modern Glass', bg: '#F8FAFC', text: '#0F172A' },
  { id: 'watercolor', name: 'Watercolor Art', bg: '#18A96F', text: '#FFFFFF' },
];

export default function VotedBadge() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [name, setName] = useState('');
  const [style, setStyle] = useState(TEMPLATES[0]);

  useEffect(() => {
    if (canvasRef.current && !fabricRef.current) {
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        width: 1080,
        height: 1080,
        backgroundColor: style.bg,
      });
      renderBadge();
    }
  }, []);

  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.setBackgroundColor(style.bg, fabricRef.current.renderAll.bind(fabricRef.current));
      renderBadge();
    }
  }, [style, name]);

  const renderBadge = () => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    canvas.clear();
    canvas.setBackgroundColor(style.bg, canvas.renderAll.bind(canvas));

    // Indelible Ink Finger Icon (Simplified for Demo)
    const finger = new fabric.Circle({
      radius: 100,
      fill: style.text,
      left: 540,
      top: 400,
      originX: 'center',
      originY: 'center',
      opacity: 0.2,
    });
    canvas.add(finger);

    // "I VOTED" Text
    const mainText = new fabric.Text('I VOTED', {
      left: 540,
      top: 540,
      originX: 'center',
      originY: 'center',
      fontFamily: 'Plus Jakarta Sans',
      fontWeight: '900',
      fontSize: 180,
      fill: style.text,
      charSpacing: 100,
    });
    canvas.add(mainText);

    // User Name
    if (name) {
      const nameText = new fabric.Text(name.toUpperCase(), {
        left: 540,
        top: 720,
        originX: 'center',
        originY: 'center',
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: 'bold',
        fontSize: 60,
        fill: style.text,
        opacity: 0.8,
      });
      canvas.add(nameText);
    }

    // App Attribution
    const attribution = new fabric.Text('VoterNexus Project', {
      left: 540,
      top: 980,
      originX: 'center',
      originY: 'center',
      fontFamily: 'Inter',
      fontSize: 30,
      fill: style.text,
      opacity: 0.5,
    });
    canvas.add(attribution);

    canvas.renderAll();
  };

  const handleDownload = () => {
    if (!fabricRef.current) return;
    const dataURL = fabricRef.current.toDataURL({
      format: 'png',
      quality: 1,
    });
    const link = document.createElement('a');
    link.download = `voter-nexus-badge-${style.id}.png`;
    link.href = dataURL;
    link.click();
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Controls */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold font-display">Wear your <span className="text-phase">Pride.</span></h2>
            <p className="text-slate-500">Celebrate your contribution to democracy. Create a custom badge and share it with your community.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User className="w-4 h-4" />
                Your First Name (Optional)
              </label>
              <input 
                type="text" 
                maxLength={15}
                placeholder="Enter name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-phase/20 outline-none"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Select Style
              </label>
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setStyle(t)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-2 ${
                      style.id === t.id ? 'border-phase bg-phase/5' : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="w-full h-8 rounded-lg" style={{ backgroundColor: t.bg }} />
                    <span className="text-xs font-bold text-slate-700">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
             <button 
               onClick={handleDownload}
               className="btn-primary flex-1 flex items-center justify-center gap-2"
             >
               <Download className="w-5 h-5" />
               Download PNG
             </button>
             <button className="px-8 py-3 bg-slate-100 text-slate-600 rounded-pill font-bold hover:bg-slate-200 transition-all flex items-center gap-2">
               <Share2 className="w-5 h-5" />
               Share
             </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="relative group">
           <div className="absolute -inset-4 bg-gradient-to-br from-phase/20 to-accent/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-70 transition-opacity" />
           <div className="relative aspect-square w-full max-w-[400px] mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-white">
              <canvas ref={canvasRef} className="w-full h-full" style={{ width: '100%', height: '100%' }} />
           </div>
           
           <div className="absolute top-4 right-4 md:-right-4 p-3 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-[10px] font-black uppercase tracking-tighter">HD Ready</span>
           </div>
        </div>
      </div>

      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4 text-slate-500 text-sm italic">
         <RefreshCw className="w-4 h-4" />
         Your image is generated locally. No data leaves your browser.
      </div>
    </div>
  );
}
