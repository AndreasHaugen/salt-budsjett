export type BudgetCategory = 'income' | 'expense';
export type CostType = 'fixed' | 'variable';

export interface BudgetItem {
  id: string;
  name: string;
  category: BudgetCategory; // Inntekter vs Kostnader
  type: CostType; // Fast vs Variabel
  amount: number; // For fixed: user input. For variable: calculated (quantity * unitPrice)
  quantity?: number; // Only for variable
  unitPrice?: number; // Only for variable
}

export interface ProjectInfo {
  name: string;
  owner: string;
  startDate: string;
  endDate: string;
  location: string;
}
