import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Class, Lecture } from './types';
import { PostgrestError } from '@supabase/supabase-js';

// Utility function to create Supabase client
const createSupabaseClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
};

// Utility function for error handling
const handleError = (error: PostgrestError | null, message: string) => {
  if (error) {
    throw new Error(message);
  }
};

export async function fetchData() {
  const supabase = createSupabaseClient();

  const [classesResponse, lecturesResponse] = await Promise.all([
    supabase
      .from('class')
      .select('*')
      .order('category', { ascending: true }),
    supabase
      .from('lectures')
      .select('*')
  ]);

  handleError(classesResponse.error, 'Failed to fetch classes');
  handleError(lecturesResponse.error, 'Failed to fetch lectures');

  return {
    classes: classesResponse.data as Class[],
    lectures: lecturesResponse.data as Lecture[]
  };
}

export async function fetchClassByCategory(category: string) {
  const supabase = createSupabaseClient();

  const { data: classData, error } = await supabase
    .from('class')
    .select('*')
    .eq('category', category)
    .single();

  handleError(error, 'Failed to fetch class');
  return classData as Class;
}

export async function fetchLecturesByCategory(category: string) {
  const supabase = createSupabaseClient();

  const { data: lectures, error } = await supabase
    .from('lectures')
    .select('*')
    .eq('category', category)
    .order('lecture_id', { ascending: true });

  handleError(error, 'Failed to fetch lectures');
  return lectures as Lecture[];
}

export async function fetchLecture(category: string, lectureId: string) {
  const supabase = createSupabaseClient();

  const { data: lecture, error } = await supabase
    .from('lectures')
    .select('*')
    .eq('category', category)
    .eq('lecture_id', lectureId)
    .single();

  handleError(error, 'Failed to fetch lecture');
  return lecture as Lecture;
} 