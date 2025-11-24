import React, { useState, useEffect } from 'react';
import { ProjectHeader } from './components/ProjectHeader';
import { SummaryCard } from './components/SummaryCard';
import { BudgetTable } from './components/BudgetTable';
import { SensitivityAnalysis } from './components/SensitivityAnalysis';
import { SaltLogo } from './components/SaltLogo';
import { BudgetItem, ProjectInfo, BudgetCategory, CostType } from './types';
import { Download, Plus, FileText, Printer } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: 'Sommerfest 2024',
    owner: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: '',
  });

  const [items, setItems] = useState<BudgetItem[]>([
    { id: '1', name: 'Deltakeravgift', category: 'income', type: 'variable', amount: 50000, quantity: 50, unitPrice: 1000 },
    { id: '2', name: 'Støtte fra kommune', category: 'income', type: 'fixed', amount: 15000 },
    { id: '3', name: 'Mat og drikke', category: 'expense', type: 'variable', amount: 25000, quantity: 50, unitPrice: 500 },
    { id: '4', name: 'Leie av lokale', category: 'expense', type: 'fixed', amount: 10000 },
  ]);

  // --- Handlers ---
  const handleProjectInfoChange = (key: keyof ProjectInfo, value: string) => {
    setProjectInfo(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateItem = (id: string, field: keyof BudgetItem, value: string | number) => {
    setItems(prevItems => prevItems.map(item => {
      if (item.id !== id) return item;

      const updatedItem = { ...item, [field]: value };

      // Recalculate amount for variable items if qty or price changes
      if (item.type === 'variable') {
        if (field === 'quantity' || field === 'unitPrice') {
           const qty = field === 'quantity' ? (value as number) : (item.quantity || 0);
           const price = field === 'unitPrice' ? (value as number) : (item.unitPrice || 0);
           updatedItem.amount = qty * price;
        }
      }
      return updatedItem;
    }));
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleAddItem = (category: BudgetCategory, type: CostType) => {
    const newItem: BudgetItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      category,
      type,
      amount: 0,
      quantity: type === 'variable' ? 0 : undefined,
      unitPrice: type === 'variable' ? 0 : undefined,
    };
    setItems(prev => [...prev, newItem]);
  };

  const calculateTotal = (category: BudgetCategory) => {
    return items
      .filter(i => i.category === category)
      .reduce((sum, item) => sum + item.amount, 0);
  };
  
  const handleExportCsv = () => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Kategori,Type,Navn,Antall,Pris per enhet,Belop\n"
        + items.map(e => `${e.category},${e.type},${e.name},${e.quantity || ''},${e.unitPrice || ''},${e.amount}`).join("\n");
        
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `budsjett_${projectInfo.name.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleExportPdf = () => {
    const originalTitle = document.title;
    try {
      // Sanitize filename for better save-as defaults
      const safeName = (projectInfo.name || '').replace(/[^a-z0-9æøå\s-]/gi, '').trim();
      document.title = `Budsjett - ${safeName || 'Uten navn'}`;
      
      // Execute print immediately to avoid popup blockers
      window.print();

    } catch (error) {
      console.error("Print error:", error);
      alert("Kunne ikke starte utskrift. Vennligst bruk nettleserens utskriftsfunksjon (Ctrl+P / Cmd+P).");
    } finally {
      // Revert title after a short delay (many browsers pause JS execution during print dialog, so this runs after close)
      setTimeout(() => {
        document.title = originalTitle;
      }, 1000);
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 selection:bg-indigo-100 selection:text-indigo-900 print:bg-white print:pb-0">
      {/* Top Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-3">
                    {/* Logo */}
                    <div className="text-slate-900">
                      <SaltLogo className="h-8 w-auto" />
                    </div>
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight ml-1">Salt Prosjektbudsjett</h1>
                </div>
                <div className="flex space-x-3">
                    <button 
                        onClick={handleExportCsv}
                        className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                        title="Last ned CSV"
                    >
                        <FileText className="w-4 h-4" />
                        <span className="hidden sm:inline">CSV</span>
                    </button>
                    <button 
                        onClick={handleExportPdf}
                        className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors shadow-sm hover:shadow-md"
                    >
                        <Printer className="w-4 h-4" />
                        <span className="hidden sm:inline">Lagre som PDF</span>
                    </button>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 print:py-0 print:px-2">
        
        {/* Project Header Inputs */}
        <ProjectHeader info={projectInfo} onChange={handleProjectInfoChange} />

        {/* Big Summary Card */}
        <SummaryCard 
          totalIncome={calculateTotal('income')} 
          totalExpense={calculateTotal('expense')} 
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start mb-12 print:block print:space-y-8 print:mb-8">
          {/* Income Section */}
          <div className="space-y-6 print-mb-8">
             <div className="flex items-center gap-3 pb-2 border-b border-slate-200 print-break-inside-avoid">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm print:border print:border-emerald-200">1</span>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Inntekter</h2>
             </div>
             
             <div className="print-break-inside-avoid">
              <BudgetTable 
                  title="Faste inntekter" 
                  category="income" 
                  type="fixed" 
                  items={items} 
                  onUpdate={handleUpdateItem} 
                  onDelete={handleDeleteItem}
                  onAdd={handleAddItem}
              />
             </div>
             
             <div className="print-break-inside-avoid">
              <BudgetTable 
                  title="Variable inntekter" 
                  category="income" 
                  type="variable" 
                  items={items} 
                  onUpdate={handleUpdateItem} 
                  onDelete={handleDeleteItem}
                  onAdd={handleAddItem}
              />
             </div>
          </div>

          {/* Expenses Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-slate-200 print-break-inside-avoid">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-600 font-bold text-sm print:border print:border-rose-200">2</span>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Kostnader</h2>
             </div>

             <div className="print-break-inside-avoid">
              <BudgetTable 
                  title="Faste kostnader" 
                  category="expense" 
                  type="fixed" 
                  items={items} 
                  onUpdate={handleUpdateItem} 
                  onDelete={handleDeleteItem}
                  onAdd={handleAddItem}
              />
             </div>
             
             <div className="print-break-inside-avoid">
              <BudgetTable 
                  title="Variable kostnader" 
                  category="expense" 
                  type="variable" 
                  items={items} 
                  onUpdate={handleUpdateItem} 
                  onDelete={handleDeleteItem}
                  onAdd={handleAddItem}
              />
             </div>
          </div>
        </div>

        {/* Sensitivity Analysis - Full Width */}
        <div className="print-break-inside-avoid">
           <SensitivityAnalysis items={items} />
        </div>

      </div>
    </div>
  );
};

export default App;
