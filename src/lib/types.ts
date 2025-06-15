export interface Lecture {
  id: number;
  category: string;
  created_at: string;
  lecture_id: number;
  chapter?: string;
  embed_ids: {
    movie?: string;
    text?: string;
    audio?: string;
  };
}

export interface Class {
  id: number;
  category: string;
  name: string;
  tags: string[] | null;
}

export interface ClassStats {
  lectureCount: number;
  latestLectureId: number;
  lastUpdated: string;
} 