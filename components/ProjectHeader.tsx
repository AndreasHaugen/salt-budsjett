import React from 'react';
import { ProjectInfo } from '../types';
import { MapPin, Calendar, User, FileText, LayoutDashboard } from 'lucide-react';

interface Props {
  info: ProjectInfo;
  onChange: (key: keyof ProjectInfo, value: string) => void;
}

export const ProjectHeader: React.FC<Props> = ({ info, onChange }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('no-NO');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 mb-8 print:mb-4">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <LayoutDashboard className="w-5 h-5 text-indigo-500" />
        <h2 className="text-lg font-semibold text-slate-800">Prosjektdetaljer</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Project Name - Span 3 */}
        <div className="space-y-2 lg:col-span-3">
          <label className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-500">
            <FileText className="w-3 h-3 mr-1.5" />
            Navn
          </label>
          <div className="hidden print:block text-slate-800 font-bold text-base py-1">
             {info.name || 'Uten navn'}
          </div>
          <input
            type="text"
            value={info.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm print:hidden"
            placeholder="Prosjektnavn"
          />
        </div>

        {/* Owner - Span 3 */}
        <div className="space-y-2 lg:col-span-3">
          <label className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-500">
            <User className="w-3 h-3 mr-1.5" />
            Prosjekteier
          </label>
          <div className="hidden print:block text-slate-800 font-medium text-base py-1">
             {info.owner || '–'}
          </div>
          <input
            type="text"
            value={info.owner}
            onChange={(e) => onChange('owner', e.target.value)}
            className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm print:hidden"
            placeholder="Ditt navn"
          />
        </div>

        {/* Date Range - Span 4 (Increased space) */}
        <div className="space-y-2 lg:col-span-4">
          <label className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Calendar className="w-3 h-3 mr-1.5" />
            Periode
          </label>
          <div className="hidden print:block text-slate-800 font-medium text-base py-1">
             {formatDate(info.startDate) ? `${formatDate(info.startDate)} – ${formatDate(info.endDate)}` : '–'}
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <input
              type="date"
              value={info.startDate}
              onChange={(e) => onChange('startDate', e.target.value)}
              className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
            <span className="text-slate-400">-</span>
            <input
              type="date"
              value={info.endDate}
              onChange={(e) => onChange('endDate', e.target.value)}
              className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* Location - Span 2 (Reduced space slightly to fit row) */}
        <div className="space-y-2 lg:col-span-2">
          <label className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-500">
            <MapPin className="w-3 h-3 mr-1.5" />
            Sted
          </label>
          <div className="hidden print:block text-slate-800 font-medium text-base py-1">
             {info.location || '–'}
          </div>
          <input
            type="text"
            value={info.location}
            onChange={(e) => onChange('location', e.target.value)}
            className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm print:hidden"
            placeholder="Eks: Solstrand"
          />
        </div>
      </div>
    </div>
  );
};