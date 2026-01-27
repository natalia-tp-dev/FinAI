export interface TransactionData {
    user_id?: string;
    id?: number;
    category_id: number;
    amount: number;
    type: string;
    description?: string;
    transaction_date: string;
}

export interface Transaction {
    id?: number;         
    date: string;        
    description: string;
    category: string;
    icon: string;
    color: string;
    bgColor: string;   
    amount: number;
    category_id: number;
    type: 'INCOME' | 'EXPENSE';
}

export interface SingleSeriesData {
    name: string;
    value: number;
}

export interface MultiSeriesData {
    name: string;
    series: SeriesChild[];
}

export interface SeriesChild {
    name: string;
    value: number;
}

export interface TransactionResponse {
    data: Transaction[];
    pagination: {
        total: number;
        page: number;
        totalPages: number;
    };
}