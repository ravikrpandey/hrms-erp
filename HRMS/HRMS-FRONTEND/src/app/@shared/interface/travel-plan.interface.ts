export interface TravelPlan {
  date: string;
  day: string;
  plan: string;
  actual: string;
  status: 'PENDING' | 'APPROVED' | 'DRAFT';
}