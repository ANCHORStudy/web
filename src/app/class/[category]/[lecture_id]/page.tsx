'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState, useRef } from 'react';
import { Lecture } from '@/lib/supabase';
import { IoMdClose } from 'react-icons/io';
import { IoDocumentText } from 'react-icons/io5';
import { IoMusicalNotes } from 'react-icons/io5';

export default function LecturePage({
  params,
}: {
  params: { category: string; lecture_id: string };
}) {
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [openSidebar, setOpenSidebar] = useState<'text' | 'audio' | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(320); // px
  const [isResizing, setIsResizing] = useState(false);
  const supabase = createClientComponentClient();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLecture = async () => {
      const { data } = await supabase
        .from('lectures')
        .select('*')
        .eq('category', params.category)
        .eq('lecture_id', params.lecture_id)
        .single();

      if (data) {
        setLecture(data);
      }
    };

    fetchLecture();
  }, [params.category, params.lecture_id, supabase]);

  // Handle drag for resizing
  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newSidebarWidth = Math.max(240, Math.min(600, rect.right - e.clientX));
      setSidebarWidth(newSidebarWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  if (!lecture) {
    return null;
  }

  // Main content and sidebar layout
  const showSidebar = openSidebar && (openSidebar === 'text' ? lecture.embed_ids.text : lecture.embed_ids.audio);

  return (
    <div className="min-h-screen bg-gray-50 relative" ref={containerRef}>
      {/* 右上のフォルダ風タブ群（上寄せ） */}
      <div className="fixed right-0 top-8 z-50 flex flex-col space-y-2 items-end">
        {lecture.embed_ids.text && (
          <button
            onClick={() => setOpenSidebar(openSidebar === 'text' ? null : 'text')}
            className={`flex items-center px-4 py-2 rounded-t-md rounded-b-none border-b-4 border-yellow-400 bg-yellow-200 shadow text-gray-800 font-semibold hover:bg-yellow-300 transition-colors w-32 justify-center transform -rotate-90 origin-bottom-right ${openSidebar === 'text' ? 'ring-2 ring-yellow-500' : ''}`}
            aria-label="Show Text"
          >
            <IoDocumentText size={20} className="mr-2" />Text
          </button>
        )}
        {lecture.embed_ids.audio && (
          <button
            onClick={() => setOpenSidebar(openSidebar === 'audio' ? null : 'audio')}
            className={`flex items-center px-4 py-2 rounded-t-md rounded-b-none border-b-4 border-yellow-400 bg-yellow-200 shadow text-gray-800 font-semibold hover:bg-yellow-300 transition-colors w-32 justify-center transform -rotate-90 origin-bottom-right ${openSidebar === 'audio' ? 'ring-2 ring-yellow-500' : ''}`}
            aria-label="Show Audio"
          >
            <IoMusicalNotes size={20} className="mr-2" />Audio
          </button>
        )}
      </div>

      {/* メイン＋サイドバーのレイアウト */}
      <div className="flex w-full h-screen min-h-screen transition-all duration-300">
        {/* メインコンテンツ */}
        <div
          className={`flex flex-col justify-start items-center h-full transition-all duration-300 ${showSidebar ? 'p-1' : 'p-2 lg:p-4'}`}
          style={{ width: '100%', minWidth: 320 }}
        >
          {/* タイトルと戻るリンクを左右に配置 */}
          <div className="flex items-center justify-between w-full max-w-5xl mt-6 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              {lecture.category} - Lecture {lecture.lecture_id}
            </h1>
            <a
              href={`/class/${lecture.category}`}
              className="text-indigo-600 hover:text-indigo-900 text-base ml-4 whitespace-nowrap"
            >
              ← Back to {lecture.category}
            </a>
          </div>

          {/* Video Section: カード感と余白調整 */}
          {lecture.embed_ids.movie && (
            <div className="mb-6 w-full flex justify-center">
              <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg aspect-video flex items-center justify-center">
                <iframe
                  src={`https://drive.google.com/file/d/${lecture.embed_ids.movie}/preview`}
                  allow="autoplay"
                  className="w-full h-full rounded-xl"
                  style={{ minHeight: 240 }}
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* サイドバー（Text/Audio）を画面右端にfixedで表示 */}
        {showSidebar && (
          <div
            className="fixed top-0 right-0 h-screen flex flex-col bg-white shadow-lg transition-all duration-300 z-50"
            style={{ width: sidebarWidth, minWidth: 240, maxWidth: 600 }}
          >
            <div className="flex items-center justify-between mb-4 p-4 pb-2">
              <h2 className="text-lg font-semibold text-gray-900">
                {openSidebar === 'text' ? 'Text' : 'Audio'}
              </h2>
              <button
                onClick={() => setOpenSidebar(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close Sidebar"
              >
                <IoMdClose size={22} />
              </button>
            </div>
            {/* サイドバー中身 */}
            <div className="flex-1 flex items-center justify-center px-4 pb-4 h-full">
              {openSidebar === 'text' && lecture.embed_ids.text && (
                <iframe
                  src={`https://drive.google.com/file/d/${lecture.embed_ids.text}/preview`}
                  className="w-full h-full rounded-lg"
                ></iframe>
              )}
              {openSidebar === 'audio' && lecture.embed_ids.audio && (
                <iframe
                  src={`https://drive.google.com/file/d/${lecture.embed_ids.audio}/preview`}
                  className="w-full h-[80px] rounded-lg shadow-lg"
                ></iframe>
              )}
            </div>
            {/* ドラッグバー */}
            <div
              className="absolute left-0 top-0 h-full w-2 cursor-ew-resize z-20 bg-transparent hover:bg-yellow-200 transition-colors"
              onMouseDown={() => setIsResizing(true)}
              style={{ cursor: 'ew-resize' }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
} 