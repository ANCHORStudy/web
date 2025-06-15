import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Lecture } from '@/lib/supabase';

export default async function LectureList() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: lectures } = await supabase
    .from('lectures')
    .select('*')
    .order('category', { ascending: true })
    .order('lecture_id', { ascending: true });

  // Group lectures by category
  const lecturesByCategory = lectures?.reduce((acc: { [key: string]: Lecture[] }, lecture) => {
    if (!acc[lecture.category]) {
      acc[lecture.category] = [];
    }
    acc[lecture.category].push(lecture);
    return acc;
  }, {});

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Lecture Categories</h1>
        
        <div className="space-y-8">
          {Object.entries(lecturesByCategory || {}).map(([category, categoryLectures]) => (
            <div key={category} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {category}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {categoryLectures.length} lectures available
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <div className="flex space-x-4 p-4">
                  {categoryLectures.map((lecture) => (
                    <Link
                      key={lecture.id}
                      href={`/lecture/${lecture.category}/${lecture.lecture_id}`}
                      className="flex-none w-80 bg-gray-50 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900">
                          Lecture {lecture.lecture_id}
                        </h3>
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
          ))}
        </div>
      </div>
    </div>
  );
} 