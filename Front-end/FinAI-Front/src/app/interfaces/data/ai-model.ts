export interface RoadmapStep {
    step_number: number
    title: string
    description: string
}

export interface SavingsPlan{
    weekly: number
    monthly: number
}

export interface BudgetCut{
    category: string
    description: string
    total_cut: number
}

export interface AIAdvice {
    roadmap: RoadmapStep[];
    savings_plan: SavingsPlan;
    budget_cuts: BudgetCut[];
    motivation: string;
}

export interface IndividualReportResponse {
    feasibility_score: 'High' | 'Medium' | 'Low';
    predicted_completion_date: string;
    status_message: string;
    ai_advice: AIAdvice; 
}
