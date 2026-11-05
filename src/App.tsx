import React, { useState, useEffect, useRef } from 'react';
import { Game, GameType } from './types/game';
import { storage } from './utils/storage';
import { Header } from './components/Header';
import { GameCard } from './components/GameCard';
import { MatchingGame } from './components/games/MatchingGame';
import { MemoryGame } from './components/games/MemoryGame';
import { WheelGame } from './components/games/WheelGame';
import { QuizGame } from './components/games/QuizGame';
import { GameEditor } from './components/editor/GameEditor';
import { SystemDocs } from './components/docs/SystemDocs';
import { PRESET_IMAGES } from './data/defaultGames';
import { installCacheCleanup } from './utils/cache';
import {
  Gamepad2,
  Sparkles,
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  HelpCircle,
  FolderSync,
} from 'lucide-react';

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [activeView, setActiveView] = useState<'library' | 'playing' | 'editor' | 'docs'>('library');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // File import ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loaded = storage.getGames();
    setGames(loaded);
    const cleanup = installCacheCleanup();
    return cleanup;
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePlayGame = (game: Game) => {
    setSelectedGame(game);
    setActiveView('playing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditGame = (game: Game) => {
    setSelectedGame(game);
    setActiveView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateNewGame = () => {
    setSelectedGame(null);
    setActiveView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveGame = (savedGame: Game) => {
    const updated = storage.saveGame(savedGame);
    setGames(updated);
    setActiveView('library');
    showToast(`Đã lưu thành công trò chơi "${savedGame.title}"!`);
  };

  const handleDeleteGame = (id: string) => {
    if (confirm('Thầy cô hoặc em có chắc chắn muốn xóa trò chơi này không?')) {
      const updated = storage.deleteGame(id);
      setGames(updated);
      showToast('Đã xóa trò chơi.');
    }
  };

  const handleExport = () => {
    storage.exportDatabase();
    showToast('Đã xuất tệp dữ liệu trò chơi thành công!');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = storage.importDatabase(content);
        if (result.success) {
          const fresh = storage.getGames();
          setGames(fresh);
          showToast(`Đã nạp thành công ${result.count} trò chơi từ tệp sao lưu!`);
        } else {
          alert(result.error || 'Lỗi nạp tệp');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleResetDefaults = () => {
    if (confirm('Bạn có muốn đặt lại toàn bộ kho game về dữ liệu gốc chuẩn của Tiểu học Dương Kinh không?')) {
      const fresh = storage.resetToDefaults();
      setGames(fresh);
      showToast('Đã đặt lại kho trò chơi mẫu.');
    }
  };

  // Filtered games
  const filteredGames = games.filter((g) => {
    const matchSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchType = typeFilter === 'all' || g.type === typeFilter;
    const matchSubject = subjectFilter === 'all' || g.subject === subjectFilter;

    return matchSearch && matchType && matchSubject;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      {/* Hidden file input for JSON database restore */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Header */}
      <Header
        activeView={activeView === 'playing' ? 'library' : activeView}
        onNavigate={(view) => {
          setSelectedGame(null);
          setActiveView(view);
        }}
        onExport={handleExport}
        onImport={handleImportClick}
        onReset={handleResetDefaults}
      />

      {/* Main Content Area */}
      <main
        className={
          activeView === 'playing'
            ? 'flex-1 w-full px-2 py-2 sm:px-3 sm:py-3'
            : 'flex-1 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full'
        }
      >
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* VIEW 1: PLAYING GAME */}
        {activeView === 'playing' && selectedGame && (
          <div>
            {selectedGame.type === 'matching' && (
              <MatchingGame
                game={selectedGame}
                onBack={() => setActiveView('library')}
                onEditGame={() => handleEditGame(selectedGame)}
              />
            )}
            {selectedGame.type === 'memory' && (
              <MemoryGame
                game={selectedGame}
                onBack={() => setActiveView('library')}
                onEditGame={() => handleEditGame(selectedGame)}
              />
            )}
            {selectedGame.type === 'wheel' && (
              <WheelGame
                game={selectedGame}
                onBack={() => setActiveView('library')}
                onEditGame={() => handleEditGame(selectedGame)}
              />
            )}
            {selectedGame.type === 'quiz' && (
              <QuizGame
                game={selectedGame}
                onBack={() => setActiveView('library')}
                onEditGame={() => handleEditGame(selectedGame)}
              />
            )}
          </div>
        )}

        {/* VIEW 2: GAME EDITOR */}
        {activeView === 'editor' && (
          <GameEditor
            initialGame={selectedGame}
            onSave={handleSaveGame}
            onCancel={() => setActiveView('library')}
          />
        )}

        {/* VIEW 3: ARCHITECTURE & DATABASE DOCUMENTATION */}
        {activeView === 'docs' && (
          <SystemDocs onBack={() => setActiveView('library')} />
        )}

        {/* VIEW 4: HOME / GAME LIBRARY */}
        {activeView === 'library' && (
          <div className="space-y-8">
            {/* Elementary School Hero Showcase Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-700 text-white p-6 sm:p-10 shadow-lg border border-blue-500/30">
              <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-200 uppercase tracking-widest mb-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Trường Tiểu Học Dương Kinh · Phòng Tin Học & Hoạt Động Trải Nghiệm</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading leading-tight">
                  Sáng Tạo & Chơi Game Học Tập Tương Tác
                </h1>
                <p className="mt-3 text-sm text-sky-100 leading-relaxed">
                  Nền tảng giúp các em nhỏ tự tạo trò chơi học tập, giải phóng hình ảnh với{' '}
                  <strong className="text-amber-300 font-bold">tỉ lệ ngang 16:9 chuẩn màn chiếu</strong> (không bị bó buộc dọc), kiểm soát toàn bộ luật chơi và quản lý dữ liệu linh hoạt.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleCreateNewGame}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tạo Trò Chơi Mới</span>
                  </button>
                  <button
                    onClick={() => setActiveView('docs')}
                    className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl font-semibold text-xs backdrop-blur-xs transition-colors flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Xem Hướng Dẫn Kỹ Thuật</span>
                  </button>
                </div>
              </div>

              {/* Decorative Widescreen Backdrop Graphic */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-25 hidden lg:block overflow-hidden pointer-events-none">
                <img
                  src={PRESET_IMAGES.countryside16x9}
                  alt="Backdrop"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm trò chơi theo tên, môn học..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Filter Tabs by Game Type */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 text-xs">
                {[
                  { id: 'all', label: 'Tất Cả' },
                  { id: 'matching', label: 'Nối Ý (16:9)' },
                  { id: 'memory', label: 'Lật Thẻ' },
                  { id: 'wheel', label: 'Vòng Quay' },
                  { id: 'quiz', label: 'Chuyến Tàu Tri Thức' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTypeFilter(item.id)}
                    className={`px-3 py-1.5 font-semibold rounded-lg whitespace-nowrap transition-colors ${
                      typeFilter === item.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Subject Dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Mọi môn học</option>
                  <option value="Tiếng Việt & Tự nhiên">Tiếng Việt & Tự nhiên</option>
                  <option value="Toán & Trí nhớ">Toán & Trí nhớ</option>
                  <option value="Lịch sử & Địa phương">Lịch sử & Địa phương</option>
                  <option value="Hoạt động lớp học">Hoạt động lớp học</option>
                </select>
              </div>
            </div>

            {/* Games Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-blue-600" />
                  KHO TRÒ CHƠI HỌC TẬP ({filteredGames.length} trò)
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <button
                    onClick={handleResetDefaults}
                    className="hover:text-blue-600 flex items-center gap-1 transition-colors"
                    title="Khôi phục trò chơi mẫu"
                  >
                    <FolderSync className="w-3.5 h-3.5" />
                    <span>Khôi phục mẫu</span>
                  </button>
                </div>
              </div>

              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onPlay={handlePlayGame}
                      onEdit={handleEditGame}
                      onDelete={handleDeleteGame}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                  <p className="text-slate-500 text-sm">
                    Không tìm thấy trò chơi nào phù hợp với bộ lọc tìm kiếm.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setTypeFilter('all');
                      setSubjectFilter('all');
                    }}
                    className="mt-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
                  >
                    Xóa Bộ Lọc
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Trường Tiểu Học Dương Kinh · Nền tảng EdGames Sáng Tạo</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveView('docs')} className="hover:text-slate-800 transition-colors">
              Kiến trúc hệ thống
            </button>
            <span>·</span>
            <button onClick={handleExport} className="hover:text-slate-800 transition-colors">
              Sao lưu CSDL
            </button>
            <span>·</span>
            <button onClick={handleImportClick} className="hover:text-slate-800 transition-colors">
              Nạp dữ liệu
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
