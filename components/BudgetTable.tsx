import React from 'react';
import { BudgetItem, BudgetCategory, CostType } from '../types';
import { Trash2, Plus, GripVertical, Coins, Banknote, CreditCard, Wallet } from 'lucide-react';

interface Props {
  items: BudgetItem[];
  category: BudgetCategory;
  type: CostType;
  title: string;
  onUpdate: (id: string, field: keyof BudgetItem, value: string | number) => void;
  onDelete: (id: string) => void;
  onAdd: (category: BudgetCategory, type: CostType) => void;
}

export const BudgetTable: React.FC<Props> = ({
  items,
  category,
  type,
  title,
  onUpdate,
  onDelete,
  onAdd,
}) => {
  const isVariable = type === 'variable';
  const isIncome = category === 'income';
  
  // Premium styling constants
  const accentColor = isIncome ? 'text-emerald-600' : 'text-rose-600';
  const bgAccent = isIncome ? 'bg-emerald-50' : 'bg-rose-50';
  const ringFocus = isIncome ? 'focus:ring-emerald-500/20 focus:border-emerald-500' : 'focus:ring-rose-500/20 focus:border-rose-500';
  const buttonHover = isIncome ? 'hover:bg-emerald-50 text-emerald-600' : 'hover:bg-rose-50 text-rose-600';

  const sectionItems = items.filter(i => i.category === category && i.type === type);
  const totalSection = sectionItems.reduce((acc, item) => acc + item.amount, 0);

  const formatCurrency = (val: number) => new Intl.NumberFormat('no-NO', { maximumFractionDigits: 0 }).format(val);

  // Icon selection
  const Icon = type === 'fixed' 
    ? (isIncome ? Wallet : CreditCard)
    : (isIncome ? Coins : Banknote);

  // Validation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleNumberChange = (id: string, field: keyof BudgetItem, value: string) => {
    let newValue = parseFloat(value);
    if (isNaN(newValue)) {
      newValue = 0;
    } else if (newValue < 0) {
      newValue = 0;
    }
    onUpdate(id, field, newValue);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-8 transition-all hover:shadow-md print:shadow-none print:border-slate-300 print:mb-8 print-break-inside-avoid">
      {/* Modern Header */}
      <div className="flex justify-between items-center p-6 border-b border-slate-100 print:border-slate-200 print:py-4">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${bgAccent} print:bg-transparent print:p-0`}>
                <Icon className={`w-6 h-6 ${accentColor} print:text-slate-800`} />
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5 print:text-slate-500">
                    {type === 'fixed' ? 'Fast beløp' : 'Pris per enhet × Antall'}
                </p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-xs text-slate-400 font-semibold uppercase mb-1 print:text-slate-500">Sum</p>
            <p className={`text-xl font-bold font-mono ${accentColor} print:text-black`}>
                kr {formatCurrency(totalSection)}
            </p>
        </div>
      </div>

      <div className="p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase text-slate-400 print:bg-white print:border-slate-300 print:text-slate-600">
              <th className="px-6 py-4 font-semibold w-10 print:hidden"></th>
              <th className="px-4 py-4 font-semibold">Beskrivelse</th>
              {isVariable && (
                <>
                  <th className="px-4 py-4 font-semibold w-28 text-right">Antall</th>
                  <th className="px-4 py-4 font-semibold w-36 text-right">Pris (NOK)</th>
                </>
              )}
              <th className="px-6 py-4 font-semibold w-40 text-right">Totalt</th>
              <th className="px-4 py-4 font-semibold w-12 print:hidden"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 print:divide-slate-200">
            {sectionItems.map((item) => (
              <tr key={item.id} className="group hover:bg-slate-50/80 transition-colors print:hover:bg-transparent">
                 <td className="px-6 py-3 text-slate-300 print:hidden">
                    <GripVertical className="w-4 h-4 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                 </td>
                <td className="px-4 py-3">
                  {/* Print View for Name */}
                  <span className="hidden print:block text-slate-700 font-medium text-sm break-words">
                    {item.name || <span className="text-slate-300 italic">Uten navn</span>}
                  </span>
                  {/* Edit View for Name */}
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-700 font-medium placeholder-slate-300 print:hidden"
                    placeholder="Gi posten et navn..."
                  />
                </td>
                
                {isVariable && (
                  <>
                    <td className="px-4 py-3 text-right">
                      <div className="relative">
                         {/* Print View for Quantity */}
                        <span className="hidden print:block text-slate-700 text-sm">
                            {item.quantity}
                        </span>
                        <input
                            type="number"
                            min="0"
                            onKeyDown={handleKeyDown}
                            value={item.quantity ?? ''}
                            onChange={(e) => handleNumberChange(item.id, 'quantity', e.target.value)}
                            className={`w-full text-right bg-white rounded-md border border-slate-200 py-1.5 px-2 text-sm text-slate-700 outline-none transition-all focus:border-transparent focus:ring-2 ${ringFocus} print:hidden`}
                            placeholder="0"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                       <div className="relative">
                          {/* Print View for Unit Price */}
                          <span className="hidden print:block text-slate-700 text-sm">
                            {formatCurrency(item.unitPrice || 0)}
                          </span>
                          <input
                            type="number"
                            min="0"
                            onKeyDown={handleKeyDown}
                            value={item.unitPrice ?? ''}
                            onChange={(e) => handleNumberChange(item.id, 'unitPrice', e.target.value)}
                            className={`w-full text-right bg-white rounded-md border border-slate-200 py-1.5 px-2 text-sm text-slate-700 outline-none transition-all focus:border-transparent focus:ring-2 ${ringFocus} print:hidden`}
                            placeholder="0"
                          />
                        </div>
                    </td>
                  </>
                )}

                <td className="px-6 py-3 text-right">
                   {isVariable ? (
                      <span className="font-mono text-slate-600 font-medium text-sm block py-1.5 print:text-black">
                        {formatCurrency(item.amount)}
                      </span>
                   ) : (
                      <>
                         {/* Print View for Fixed Amount */}
                        <span className="hidden print:block text-sm font-semibold text-slate-800">
                            {formatCurrency(item.amount)}
                        </span>
                        <input
                            type="number"
                            min="0"
                            onKeyDown={handleKeyDown}
                            value={item.amount ?? ''}
                            onChange={(e) => handleNumberChange(item.id, 'amount', e.target.value)}
                            className={`w-full text-right bg-white rounded-md border border-slate-200 py-1.5 px-2 text-sm font-semibold outline-none transition-all focus:border-transparent focus:ring-2 ${ringFocus} ${accentColor} print:hidden`}
                            placeholder="0"
                        />
                      </>
                   )}
                </td>

                <td className="px-4 py-3 text-center print:hidden">
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-slate-300 hover:text-rose-500 transition-colors p-1.5 rounded-md hover:bg-rose-50 opacity-0 group-hover:opacity-100"
                    title="Slett rad"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            
            {sectionItems.length === 0 && (
              <tr className="print:hidden">
                <td colSpan={isVariable ? 6 : 4} className="px-6 py-8 text-center">
                   <div className="flex flex-col items-center justify-center text-slate-400">
                      <p className="text-sm italic mb-2">Ingen poster i denne kategorien</p>
                      <button
                        onClick={() => onAdd(category, type)}
                        className={`text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600`}
                      >
                        + Legg til første rad
                      </button>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {sectionItems.length > 0 && (
            <div className="p-2 border-t border-slate-50 print:hidden">
                <button
                    onClick={() => onAdd(category, type)}
                    className={`w-full py-2 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide rounded-lg transition-all ${buttonHover}`}
                >
                    <Plus className="w-3 h-3" />
                    Legg til ny rad
                </button>
            </div>
        )}
      </div>
    </div>
  );
};