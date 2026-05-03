export interface Step {
  _id: string;
  name: string;
  level_id: string;
  track_id: string;
  step_number: number;
  step_task: string;
  step_challenge: string;
  videoUrl?: string;
  isPaid?: boolean;
}
