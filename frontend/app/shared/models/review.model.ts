export type ReviewTargetType = 'video' | 'instructor' | 'reviewer' | 'step' | 'level' | 'track';

export interface Review {
  _id: string;
  total_stars: number;
  title: string;
  description: string;
  user_id: string;
  target_type: ReviewTargetType;
  target_id: string;
}
