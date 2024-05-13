export interface TransactionRow {
    id: string;
    amount: number;
    description: string;
    category: string;
    type: 'income' | 'expense';
    created_at: string;
}
