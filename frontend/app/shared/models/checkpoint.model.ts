export interface Checkpoint {
  _id: string;
  userId?: string;
  track_id: string;
  level_id: string;
  last_step_id: string;
}
