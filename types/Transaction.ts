export interface TransactionRow {
    id: string;
    amount: number;
    description: string;
    category: string;
    type: 'Income' | 'Expense' | 'Saving' | 'Investment';
    created_at: string;
}
