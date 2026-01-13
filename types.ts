
export interface BookOverview {
  title: string;
  author: string;
  publisher: string;
  startDate: string;
  endDate: string;
}

export interface WorldSetting {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  children: WorldSetting[];
}

export interface ProfileField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date';
}

export interface Character {
  id: string;
  name: string;
  profileData: Record<string, string>;
  order: number;
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  description: string;
}

export interface TimelineEvent {
  id: string;
  period: string;
  event: string;
  details: string;
  color: string;
  order: number;
}

export interface BookProject {
  id: string;
  overview: BookOverview;
  settings: WorldSetting[];
  profileFields: ProfileField[];
  characters: Character[];
  relationships: Relationship[];
  timeline: TimelineEvent[];
  lastModified: number;
}

export type ActiveTab = 'projects' | 'overview' | 'settings' | 'characters' | 'timeline' | 'relationships';
