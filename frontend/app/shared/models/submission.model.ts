export type SubmissionType = 'task' | 'challenge';
export type FileType = 'file' | 'compressed';

export interface Submission {
  _id: string;
  user_id?: string;
  userId?: string;
  type: SubmissionType;
  file_type: FileType;
  submission_url: string;
  challengeId?: any;
  challenge_id?: string;
}
