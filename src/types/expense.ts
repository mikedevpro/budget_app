export type NewExpense = {
  name: string;
  amount: number;
  category: string;
};

export type Expense = NewExpense & {
  id: string;
  createdAt: string;
};
