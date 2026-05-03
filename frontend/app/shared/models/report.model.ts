export type ReportType = 'feedback' | 'report';
export type TargetType = 'video' | 'instructor' | 'reviewer' | 'step' | 'level' | 'track';

export interface Report {
  _id: string;
  type: ReportType;
  title: string;
  description: string;
  user_id: string;
  target_type: TargetType;
  target_id: string;
  status?: 'pending' | 'resolved';
  createdAt?: string | Date;
}
