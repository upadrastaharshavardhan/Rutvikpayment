export interface CustomRequest {
  id: string;
  userId: string;
  poojaName: string;
  category: 'life_events' | 'homam' | 'special_occasions';
  requirements: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
  additionalNotes?: string;
  createdAt: string;
}