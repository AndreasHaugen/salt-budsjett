import React from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowRight, PieChart } from 'lucide-react';

interface Props {
  totalIncome: number;
  totalExpense: number;
}

export const SummaryCard: React.FC<Props> = ({ totalIncome, totalExpense }) => {
  const result = totalIncome - totalExpense;
  const isPositive = result >= 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('no-NO', { 
        style: 'currency', 
        currency: 'NOK',
        maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-xl shadow-slate-200 p-8 mb-10 transform transition-all relative overflow-hidden print-break-inside-avoid">
      {/* Decorative background elements - kept for print if browser supports it */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl -ml-24 -mb-24 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-medium text-slate-300 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-400" />
                Budsjettoversikt
            </h2>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isPositive ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/20 border-rose-500/30 text-rose-300'}`}>
                {isPositive ? 'Overskudd' : 'Underskudd'}
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 print:block print:space-y-6">
          {/* Income */}
          <div className="space-y-1">
            <p className="text-sm text-slate-400 font-medium">Totale Inntekter</p>
            <p className="text-3xl font-bold text-emerald-400 tracking-tight">{formatCurrency(totalIncome)}</p>
            <div className="w-12 h-1 bg-emerald-500/30 rounded-full mt-2"></div>
          </div>
          
          {/* Expenses */}
          <div className="space-y-1">
            <p className="text-sm text-slate-400 font-medium">Totale Kostnader</p>
            <p className="text-3xl font-bold text-rose-400 tracking-tight">{formatCurrency(totalExpense)}</p>
            <div className="w-12 h-1 bg-rose-500/30 rounded-full mt-2"></div>
          </div>

          {/* Result */}
          <div className="md:border-l md:border-slate-700/50 md:pl-8 flex flex-col justify-center print:border-none print:pl-0 print:mt-4">
            <p className="text-sm text-slate-400 font-medium mb-1">Estimert Resultat</p>
            <div className="flex items-baseline gap-3">
                 <p className={`text-4xl md:text-5xl font-bold tracking-tight ${isPositive ? 'text-blue-400' : 'text-rose-500'}`}>
                    {formatCurrency(result)}
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};