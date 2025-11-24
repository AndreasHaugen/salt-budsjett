import React, { useMemo, useState, useEffect } from 'react';
import { BudgetItem } from '../types';
import { TrendingUp, AlertCircle, Users, Banknote, Link as LinkIcon } from 'lucide-react';

interface Props {
  items: BudgetItem[];
}

export const SensitivityAnalysis: React.FC<Props> = ({ items }) => {
  // 1. Identify key metrics from the budget
  const fixedIncome = items
    .filter(i => i.category === 'income' && i.type === 'fixed')
    .reduce((sum, i) => sum + i.amount, 0);

  const fixedExpenses = items
    .filter(i => i.category === 'expense' && i.type === 'fixed')
    .reduce((sum, i) => sum + i.amount, 0);

  // 2. Identify the "Ticket" item (primary variable income)
  const variableIncomeItems = items.filter(i => i.category === 'income' && i.type === 'variable');
  
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');

  // Auto-select first variable income if none selected or selection is invalid
  useEffect(() => {
    const isValid = selectedTicketId && items.some(i => i.id === selectedTicketId);
    if (!isValid && variableIncomeItems.length > 0) {
      setSelectedTicketId(variableIncomeItems[0].id);
    } else if (variableIncomeItems.length === 0) {
      setSelectedTicketId('');
    }
  }, [items, selectedTicketId, variableIncomeItems]);

  const selectedTicketItem = variableIncomeItems.find(i => i.id === selectedTicketId);
  const baseAttendees = selectedTicketItem?.quantity || 0;
  const basePrice = selectedTicketItem?.unitPrice || 0;
  
  // 3. Smart Linking Logic
  
  // Other Variable Income (excluding the ticket itself)
  const otherVariableIncome = items.filter(i => 
    i.category === 'income' && 
    i.type === 'variable' && 
    i.id !== selectedTicketId
  );

  // Variable Expenses
  const variableExpenses = items.filter(i => i.category === 'expense' && i.type === 'variable');

  // Identify Linked vs Unlinked items based on Quantity match
  // This logic assumes that if the Quantity matches the Base Attendees, it is a "Per Participant" cost
  const linkedIncomeItems = otherVariableIncome.filter(i => i.quantity === baseAttendees);
  const unlinkedIncomeItems = otherVariableIncome.filter(i => i.quantity !== baseAttendees);

  const linkedExpenseItems = variableExpenses.filter(i => i.quantity === baseAttendees);
  const unlinkedExpenseItems = variableExpenses.filter(i => i.quantity !== baseAttendees);

  // Calculate totals for simulation
  const linkedIncomePerPerson = linkedIncomeItems.reduce((sum, i) => sum + (i.unitPrice || 0), 0);
  const unlinkedIncomeTotal = unlinkedIncomeItems.reduce((sum, i) => sum + i.amount, 0);

  const linkedExpensePerPerson = linkedExpenseItems.reduce((sum, i) => sum + (i.unitPrice || 0), 0);
  const unlinkedExpenseTotal = unlinkedExpenseItems.reduce((sum, i) => sum + i.amount, 0);

  // For display purposes
  const linkedExpenseNames = linkedExpenseItems.map(i => i.name).join(', ');

  // 4. Generate Matrix Data
  const steps = [-0.2, -0.1, 0, 0.1, 0.2];
  
  const matrixData = useMemo(() => {
    if (!selectedTicketItem) return null;

    return steps.map(attendeeStep => {
      const attendees = Math.round(baseAttendees * (1 + attendeeStep));
      
      const rowResults = steps.map(priceStep => {
        const price = Math.round(basePrice * (1 + priceStep));
        
        // Formula:
        // Income = Fixed + UnlinkedVar + (Attendees * (TicketPrice + OtherLinkedVarPerPerson))
        const totalIncome = fixedIncome + unlinkedIncomeTotal + (attendees * (price + linkedIncomePerPerson));

        // Expense = Fixed + UnlinkedVar + (Attendees * LinkedVarPerPerson)
        const totalExpense = fixedExpenses + unlinkedExpenseTotal + (attendees * linkedExpensePerPerson);
        
        const result = totalIncome - totalExpense;
        return { price, result };
      });

      return { attendees, rowResults };
    });
  }, [baseAttendees, basePrice, fixedIncome, fixedExpenses, linkedIncomePerPerson, unlinkedIncomeTotal, linkedExpensePerPerson, unlinkedExpenseTotal, selectedTicketItem]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('no-NO', { notation: "compact", compactDisplay: "short", maximumFractionDigits: 1 }).format(val);

  const formatFullCurrency = (val: number) => 
    new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(val);

  const getCellColor = (value: number) => {
    if (Math.abs(value) < 1) return 'bg-slate-100 text-slate-500';
    if (value > 0) return 'bg-emerald-100 text-emerald-700 font-medium print:bg-emerald-50 print:text-emerald-900'; 
    return 'bg-rose-100 text-rose-700 font-medium print:bg-rose-50 print:text-rose-900';
  };

  if (variableIncomeItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 text-center print-break-inside-avoid print:border-slate-300">
        <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-700">Sensitivitetsanalyse mangler data</h3>
        <p className="text-slate-500">Legg til en variabel inntekt (f.eks. Deltakeravgift) for å aktivere analysen.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 print-break-inside-avoid print-shadow-none print:border-slate-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500 print:text-indigo-700" />
            Sensitivitetsanalyse
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Simulering av resultat basert på endringer i deltakere og pris.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <label className="text-xs font-semibold uppercase text-slate-500">Variabel:</label>
          <select 
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={selectedTicketId}
            onChange={(e) => setSelectedTicketId(e.target.value)}
          >
            {variableIncomeItems.map(item => (
              <option key={item.id} value={item.id}>{item.name} ({item.unitPrice} kr)</option>
            ))}
          </select>
        </div>
      </div>

      {matrixData && selectedTicketItem && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="p-2 text-left text-xs text-slate-400 font-semibold uppercase w-32 print:text-slate-600">
                      <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Deltakere
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                          <Banknote className="w-3 h-3" />
                          Pris
                      </div>
                  </th>
                  {matrixData[0].rowResults.map((col, idx) => (
                    <th key={idx} className={`p-3 rounded-lg ${idx === 2 ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 print:ring-indigo-400 print:bg-indigo-50' : 'bg-slate-50 text-slate-600 print:bg-slate-100'}`}>
                      <div className="text-xs font-light opacity-70 mb-0.5 print:opacity-100">
                          {idx === 2 ? 'Nå' : `${steps[idx] > 0 ? '+' : ''}${steps[idx]*100}%`}
                      </div>
                      <div className="font-bold text-base">{col.price} kr</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixData.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    <td className={`p-3 rounded-lg font-semibold text-left ${rowIdx === 2 ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 print:ring-indigo-400 print:bg-indigo-50' : 'bg-slate-50 text-slate-600 print:bg-slate-100'}`}>
                      <div className="flex flex-col">
                          <span className="text-base">{row.attendees}</span>
                          <span className="text-[10px] font-light opacity-70 print:opacity-100">
                              {rowIdx === 2 ? `Nå (${baseAttendees})` : `${steps[rowIdx] > 0 ? '+' : ''}${steps[rowIdx]*100}%`}
                          </span>
                      </div>
                    </td>
                    {row.rowResults.map((cell, colIdx) => (
                      <td 
                          key={colIdx} 
                          className={`p-3 rounded-lg transition-all ${getCellColor(cell.result)} ${rowIdx === 2 && colIdx === 2 ? 'ring-2 ring-slate-800 z-10 print:ring-black' : ''}`}
                          title={`Resultat: ${formatFullCurrency(cell.result)}`}
                      >
                        {formatCurrency(cell.result)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 print:border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="text-xs text-slate-500 max-w-lg">
                    <div className="flex items-start gap-1.5 mb-1">
                        <LinkIcon className="w-3 h-3 mt-0.5 text-indigo-400" />
                        <p>
                           <span className="font-semibold text-slate-600">Linkede kostnader:</span> Analysen antar at kostnaden for 
                           <span className="font-medium text-slate-700 mx-1">{linkedExpenseNames || 'ingen poster'}</span>
                           øker proporsjonalt med antall deltakere fordi de har samme antall ({baseAttendees}) i budsjettet.
                        </p>
                    </div>
                </div>
                <div className="text-xs text-slate-400 flex gap-4 italic print:text-slate-600 whitespace-nowrap">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-200 print:bg-emerald-400"></div> Overskudd</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-200 print:bg-rose-400"></div> Underskudd</span>
                </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};