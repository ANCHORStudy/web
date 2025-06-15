import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Lecture } from '@/lib/supabase';

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: lectures } = await supabase
    .from('lectures')
    .select('*')
    .eq('category', params.category)
    .order('lecture_id', { ascending: true });

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {params.category} Lectures
          </h1>
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-900"
          >
            ← Back to Categories
          </Link>
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lectures?.map((lecture: Lecture) => (
              <Link
                key={lecture.id}
                href={`/class/${lecture.category}/${lecture.lecture_id}`}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
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
    </div>
  );
} 