import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import AuthButton from '@/components/AuthButton';

interface Lecture {
  id: number;
  category: string;
  created_at: string;
  lecture_id: number;
}

interface Class {
  id: number;
  category: string;
  name: string;
  tags: string[] | null;
}

interface ClassStats {
  lectureCount: number;
  latestLectureId: number;
  lastUpdated: string;
}

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all classes
  const { data: classes, error: classesError } = await supabase
    .from('class')
    .select('*')
    .order('category', { ascending: true });

  if (classesError) {
    console.error('Error fetching classes:', classesError);
    return <div>Error loading classes</div>;
  }

  // Fetch lectures for statistics
  const { data: lectures, error: lecturesError } = await supabase
    .from('lectures')
    .select('*');

  if (lecturesError) {
    console.error('Error fetching lectures:', lecturesError);
    return <div>Error loading lectures</div>;
  }

  // Calculate statistics for each class
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Classes</h1>
        {/*
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-accent transition-colors">
            New Class
          </button>
          <button className="px-4 py-2 text-sm bg-card text-foreground border border-border rounded-md hover:bg-border transition-colors">
            Filter
          </button>
        </div>
        */}
      </div>

      {/* Classes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => {
          const stats = classStats.get(classItem.category) || {
            lectureCount: 0,
            latestLectureId: 0,
            lastUpdated: new Date().toISOString()
          };

          return (
            <div
              key={classItem.id}
              className="border border-border rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
            >
              {/* Header: タイトルとカテゴリ */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-primary leading-tight">
                  <a href={`/class/${classItem.category}`} className="hover:underline">
                    {classItem.name}
                  </a>
                </h3>
                <span className="text-base text-foreground ml-4 whitespace-nowrap mt-1">{classItem.category}</span>
              </div>

              {/* Tags */}
              {classItem.tags && classItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {classItem.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 text-xs bg-border text-muted rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
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
        })}
      </div>

      {/* Pagination */}
      {/*
      <div className="flex justify-center space-x-2">
        <button className="px-4 py-2 text-sm bg-card text-foreground border border-border rounded-md hover:bg-border transition-colors">
          Previous
        </button>
        <button className="px-4 py-2 text-sm bg-card text-foreground border border-border rounded-md hover:bg-border transition-colors">
          Next
        </button>
      </div>
      */}
    </div>
  );
}

