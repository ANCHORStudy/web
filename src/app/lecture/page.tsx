import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Lecture } from '@/lib/supabase';

export default async function LectureList() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data: { user } } = await supabase.auth.getUser();
  console.log(user);

  if (!user) {
    return null;
  }

  const { data: lectures } = await supabase
    .from('lectures')
    .select('*')
    .order('lecture_id', { ascending: true });

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Lectures</h1>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lectures?.map((lecture: Lecture) => (
            <Link
              key={lecture.id}
              href={`/lecture/${lecture.lecture_id}`}
              className="block bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Lecture {lecture.lecture_id}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Category: {lecture.category}
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {lecture.embed_ids.movie ? 'Video Available' : 'No Video'}
                  </span>
                  {lecture.embed_ids.text && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Text Available
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 