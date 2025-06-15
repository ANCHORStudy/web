import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import AuthButton from '@/components/AuthButton';
import ClassCard from '@/components/ClassCard';
import ErrorMessage from '@/components/ErrorMessage';
import { calculateClassStats } from '@/lib/stats';
import { fetchData } from '@/lib/data';
import { Class } from '@/lib/types';

export default async function Home() {
  try {
    const { classes, lectures } = await fetchData();
    const classStats = calculateClassStats(lectures);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-foreground">Classes</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem: Class) => {
            const stats = classStats.get(classItem.category) || {
              lectureCount: 0,
              latestLectureId: 0,
              lastUpdated: new Date().toISOString()
            };

            return (
              <ClassCard
                key={classItem.id}
                classItem={classItem}
                stats={stats}
              />
            );
          })}
        </div>
      </div>
    );
  } catch (error) {
    return <ErrorMessage message={error instanceof Error ? error.message : 'An unexpected error occurred'} />;
  }
}

