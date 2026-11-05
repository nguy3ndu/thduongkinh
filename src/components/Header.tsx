import React from 'react';
import { Gamepad2, Plus, BookOpen, Download, Upload, RotateCcw } from 'lucide-react';

interface HeaderProps {
  activeView: 'library' | 'editor' | 'docs';
  onNavigate: (view: 'library' | 'editor' | 'docs') => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  onExport,
  onImport,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => onNavigate('library')}
          className="flex items-center gap-2.5 text-left text-slate-900 font-extrabold tracking-tight text-lg whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Gamepad2 className="w-5 h-5" />
          </span>
          <span className="font-heading">Dương Kinh EdGames</span>
        </button>

        {/* Zone 2: 4 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button
            onClick={() => onNavigate('library')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'library' ? 'text-blue-600 font-bold' : 'hover:text-slate-900'
            }`}
          >
            Kho Trò Chơi
          </button>
          <button
            onClick={() => onNavigate('editor')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'editor' ? 'text-blue-600 font-bold' : 'hover:text-slate-900'
            }`}
          >
            Tạo Game Mới
          </button>
          <button
            onClick={() => onNavigate('docs')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'docs' ? 'text-blue-600 font-bold' : 'hover:text-slate-900'
            }`}
          >
            Kiến Trúc & Hướng Dẫn
          </button>
        </nav>

        {/* Zone 3: 1 primary action button + quick database tools */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onExport}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            title="Tải tệp sao lưu JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Sao Lưu</span>
          </button>

          <button
            onClick={onImport}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            title="Nạp dữ liệu từ tệp JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Nạp Tệp</span>
          </button>

          <button
            onClick={() => onNavigate('editor')}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Game Mới</span>
          </button>
        </div>
      </div>
    </header>
  );
};
