'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

export function CalendarExportButton() {
  const handleExport = () => {
    window.location.href = '/api/calendar';
  };

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors focus:ring-4 focus:ring-slate-300"
      aria-label="Export election dates to calendar"
    >
      <Calendar className="w-4 h-4" />
      Add to Calendar
    </button>
  );
}
