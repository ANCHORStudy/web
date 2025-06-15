import { Class, ClassStats } from '@/lib/types';

interface ClassCardProps {
  classItem: Class;
  stats: ClassStats;
}

export default function ClassCard({ classItem, stats }: ClassCardProps) {
  return (
    <div className="border border-border rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-primary leading-tight">
          <a href={`/class/${classItem.category}`} className="hover:underline">
            {classItem.name}
          </a>
        </h3>
        <span className="text-base text-foreground ml-4 whitespace-nowrap mt-1">{classItem.category}</span>
      </div>

      {classItem.tags && classItem.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {classItem.tags.map((tag: string) => (
            <span key={tag} className="px-2 py-1 text-xs bg-border text-muted rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto space-y-2">
        <div className="flex flex-row flex-wrap gap-x-8 gap-y-2 items-center text-base text-foreground mb-1">
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {stats.lectureCount} lectures
          </span>
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Last updated: {new Date(stats.lastUpdated).toLocaleDateString('en-US')}
          </span>
        </div>
        <div className="flex items-center text-base text-foreground">
          <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Latest: Lecture {stats.latestLectureId}
        </div>
      </div>
    </div>
  );
} 