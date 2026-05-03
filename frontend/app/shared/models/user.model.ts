export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string;
  activation_status: boolean;
  account_status: string;
  role: 'user' | 'admin';
  preferred_choices?: string[];
}
