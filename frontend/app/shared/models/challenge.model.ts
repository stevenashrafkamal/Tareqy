export interface Challenge {
  _id: string;
  track_id: string;
  level_id: string;
  step_id?: string;
  content?: string;
  reviewer_id?: string;
  title?: string;
  description?: string;
  task_file?: string;
  points?: number;
  difficulty?: string;
}
