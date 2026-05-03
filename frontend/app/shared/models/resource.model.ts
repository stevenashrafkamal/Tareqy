export type ResourceType = 'free' | 'paid';

export interface Resource {
  _id: string;
  title: string;
  description: string;
  type: ResourceType;
  instructor_id?: string | null;
  url: string;
  resource_number: number;
}
