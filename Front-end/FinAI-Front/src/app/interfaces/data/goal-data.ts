export interface GoalData {
    userId?: string;
    id?: number;
    name: string;
    target_amount: number;
    current_amount: number;
    deadline: string;
    status?: string;
    feasibility?: 'High' | 'Medium' | 'Low' | 'Pending' | 'Unknown';
}

export interface GoalResponse {
    result: GoalData[];
}