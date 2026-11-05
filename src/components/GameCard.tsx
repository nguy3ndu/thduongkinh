import React from 'react';
import { Game } from '../types/game';
import { Play, Edit3, Trash2, Clock, Sparkles } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPlay, onEdit, onDelete }) => {
  const getGameTypeLabel = (type: string) => {
    switch (type) {
      case 'matching':
        return 'Nối ý (Kéo thả)';
      case 'memory':
        return 'Lật thẻ bí mật';
      case 'wheel':
        return 'Vòng quay lớp học';
      case 'quiz':
        return 'Chuyến tàu tri thức';
      default:
        return 'Trò chơi học tập';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
      {/* 16:9 Thumbnail Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />

        {/* Overlay Play Button on hover */}
        <div
          onClick={() => onPlay(game)}
          className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[1px]"
        >
          <div className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Quiet metadata indicators */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/95 font-semibold px-2 py-1 rounded-md bg-black/50 backdrop-blur-xs">
          <span>{getGameTypeLabel(game.type)}</span>
          <span>Tỉ lệ {game.aspectRatio || '16:9'}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line adhering to Zero-Pill discipline */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <span>{game.subject}</span>
            <span aria-hidden="true">·</span>
            <span>{game.gradeLevel}</span>
            {game.timeLimitSeconds && (
              <>
                <span aria-hidden="true">·</span>
                <span>{Math.round(game.timeLimitSeconds / 60)} phút</span>
              </>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {game.title}
          </h3>

          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => onPlay(game)}
            className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Chơi Ngay</span>
          </button>

          <button
            onClick={() => onEdit(game)}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-slate-200"
            title="Chỉnh sửa trò chơi"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {game.isCustom && (
            <button
              onClick={() => onDelete(game.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200"
              title="Xóa trò chơi"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
