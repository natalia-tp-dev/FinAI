export interface TransactionData {
    user_id: string;
    category_id: number;
    amount: number;
    type: string;
    description?: string;
    transaction_date: string;
}
