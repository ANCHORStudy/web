import { Lecture, ClassStats } from './types';

export function calculateClassStats(lectures: Lecture[]): Map<string, ClassStats> {
  const classStats = new Map<string, ClassStats>();
  
  lectures.forEach(lecture => {
    const current = classStats.get(lecture.category) || {
      lectureCount: 0,
      latestLectureId: 0,
      lastUpdated: lecture.created_at
    };

    classStats.set(lecture.category, {
      lectureCount: current.lectureCount + 1,
      latestLectureId: Math.max(current.latestLectureId, lecture.lecture_id),
      lastUpdated: new Date(lecture.created_at) > new Date(current.lastUpdated)
        ? lecture.created_at
        : current.lastUpdated
    });
  });

  return classStats;
} 