export type TrackType = 'design' | 'develop' | 'testing' | 'hacking' | 'debugging';

export interface Track {
  _id: string;
  title?: string;
  name?: string;
  languages?: string[];
  type?: TrackType;
  compatible_tracks?: string[];
  usages?: string;
  number_of_levels?: number;
  is_published?: boolean;
}
