import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Lecture } from '@/lib/supabase';

export default async function LecturePage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: lecture } = await supabase
    .from('lectures')
    .select('*')
    .eq('lecture_id', params.id)
    .single();

  if (!lecture) {
    notFound();
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Lecture {lecture.lecture_id}
            </h1>
            
            {lecture.embed_ids.movie && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Video</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={`https://drive.google.com/file/d/${lecture.embed_ids.movie}/preview`}
                    allow="autoplay"
                    className="w-full h-full rounded-lg"
                  ></iframe>
                </div>
              </div>
            )}

            {lecture.embed_ids.text && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Text</h2>
                <div className="prose max-w-none">
                  <iframe
                    src={`https://drive.google.com/file/d/${lecture.embed_ids.text}/preview`}
                    className="w-full h-[600px] rounded-lg"
                  ></iframe>
                </div>
              </div>
            )}

            {lecture.embed_ids.audio && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Audio</h2>
                <div className="w-full">
                  <iframe
                    src={`https://drive.google.com/file/d/${lecture.embed_ids.audio}/preview`}
                    className="w-full h-[100px] rounded-lg"
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 