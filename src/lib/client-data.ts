import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Class, Lecture } from './types';

export async function fetchLecture(category: string, lectureId: string) {
  const supabase = createClientComponentClient();

  const { data: lecture, error } = await supabase
    .from('lectures')
    .select('*')
    .eq('category', category)
    .eq('lecture_id', lectureId)
    .single();

  if (error) {
    throw new Error('Failed to fetch lecture');
  }

  return lecture as Lecture;
}

export async function fetchClassByCategory(category: string) {
  const supabase = createClientComponentClient();

  const { data: classData, error } = await supabase
    .from('class')
    .select('*')
    .eq('category', category)
    .single();

  if (error) {
    throw new Error('Failed to fetch class');
  }

  return classData as Class;
} 