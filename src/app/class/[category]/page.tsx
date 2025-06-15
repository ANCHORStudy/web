import Link from 'next/link';
import ErrorMessage from '@/components/ErrorMessage';
import { fetchClassByCategory, fetchLecturesByCategory } from '@/lib/data';
import { Lecture } from '@/lib/types';

export type PageProps = { params: Promise<{ category: string }> };

export default async function CategoryPage({ params }: PageProps) {
  try {
    const { category } = await params;
    const [classData, lectures] = await Promise.all([
      fetchClassByCategory(category),
      fetchLecturesByCategory(category)
    ]);

    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {classData.name}
            </h1>
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-900"
            >
              ← Back to Classes
            </Link>
          </div>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lectures.map((lecture: Lecture) => (
                <Link
                  key={lecture.id}
                  href={`/class/${lecture.category}/${lecture.lecture_id}`}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Lecture {lecture.lecture_id}
                    </h3>
                    {lecture.chapter && (
                      <p className="text-sm text-gray-600 mt-1">
                        Chapter: {lecture.chapter}
                      </p>
                    )}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        {lecture.embed_ids.movie && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            Video
                          </span>
                        )}
                        {lecture.embed_ids.text && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Text
                          </span>
                        )}
                        {lecture.embed_ids.audio && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Audio
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <ErrorMessage message={error instanceof Error ? error.message : 'An unexpected error occurred'} />;
  }
} 