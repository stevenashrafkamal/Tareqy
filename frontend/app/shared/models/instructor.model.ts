export interface Instructor {
  _id: string;
  username: string;
  email: string;
  password?: string;
  activation_status: boolean;
  account_status: string;
  selected_tracks?: string[];
  CV?: string;
}
