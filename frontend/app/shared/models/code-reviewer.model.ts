export interface CodeReviewer {
  _id: string;
  username: string;
  email: string;
  password?: string;
  selected_track?: string;
  selected_levels?: string[];
}
