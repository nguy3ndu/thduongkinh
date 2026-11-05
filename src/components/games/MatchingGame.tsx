import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Game, AspectRatio, MatchPair } from '../../types/game';
import { sound } from '../../utils/audio';
import { Volume2, VolumeX, RotateCcw, CheckCircle2, Trophy, Clock, Sparkles, Award, ArrowLeft, Maximize2, HelpCircle } from 'lucide-react';
import { SVG_ASSETS } from '../../data/defaultGames';

interface MatchingGameProps {
  game: Game;
  onBack: () => void;
  onEditGame?: () => void;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({ game, onBack, onEditGame }) => {
  const pairs = game.matchPairs || [];

  // Configurable aspect ratio with active switcher so user can test 16:9 vs 4:3 vs Portrait
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(game.aspectRatio || '16:9');
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [draggedLeftId, setDraggedLeftId] = useState<string | null>(null);
  const [hoveredRightId, setHoveredRightId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(game.timeLimitSeconds || 120);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(sound.isSoundEnabled());
  const [feedbackMessage, setFeedbackMessage] = useState<string>('Chọn hoặc kéo một đối tượng bên trái để bắt đầu ghép cặp nhé!');
  const [wrongShakeId, setWrongShakeId] = useState<string | null>(null);
  const [landingPairId, setLandingPairId] = useState<string | null>(null);
  const [wrongPairId, setWrongPairId] = useState<string | null>(null);

  // Shuffled right items so order isn't trivial
  const [shuffledRightItems, setShuffledRightItems] = useState<MatchPair[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Shuffle right items on load or reset
  const initGame = () => {
    setMatchedIds(new Set());
    setSelectedLeftId(null);
    setDraggedLeftId(null);
    setScore(0);
    setLandingPairId(null);
    setWrongPairId(null);
    setTimeRemaining(game.timeLimitSeconds || 120);
    setIsGameOver(false);
    setFeedbackMessage('Chọn hoặc kéo một đối tượng bên trái sang bức tranh 16:9 tương ứng!');

    // Randomize right items
    const shuffled = [...pairs].sort(() => Math.random() - 0.5);
    setShuffledRightItems(shuffled);
  };

  useEffect(() => {
    initGame();
  }, [game]);

  // Timer countdown
  useEffect(() => {
    if (isGameOver) return;
    if (timeRemaining <= 0) {
      handleGameOver();
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameOver, timeRemaining]);

  const handleGameOver = () => {
    setIsGameOver(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Attempt matching logic
  const handleMatchAttempt = (leftId: string, rightId: string) => {
    if (matchedIds.has(leftId)) return;

    if (leftId === rightId) {
      // Correct match!
      sound.playCorrect();
      const newMatched = new Set(matchedIds);
      newMatched.add(leftId);
      setMatchedIds(newMatched);

      const matchedPair = pairs.find((p) => p.id === leftId);
      setScore((prev) => prev + 25);
      setLandingPairId(leftId);
      window.setTimeout(() => setLandingPairId((current) => current === leftId ? null : current), 900);
      setFeedbackMessage(matchedPair?.hint || 'Rất tuyệt vời! Em đã ghép đúng một cặp hoàn hảo.');

      setSelectedLeftId(null);
      setDraggedLeftId(null);

      // Check win condition
      if (newMatched.size === pairs.length) {
        sound.playVictory();
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#fbbf24', '#f43f5e', '#10b981', '#a855f7'],
        });
        window.setTimeout(() => setIsGameOver(true), 4000);
      }
    } else {
      // Wrong match
      sound.playWrong();
      setWrongShakeId(rightId);
      setWrongPairId(rightId);
      window.setTimeout(() => {
        setWrongShakeId(null);
        setWrongPairId(null);
      }, 1800);
      setFeedbackMessage('Sai vị trí! Hãy xem lại hai hình rồi chọn đối tượng phù hợp nhất.');
      setSelectedLeftId(null);
      setDraggedLeftId(null);
    }
  };

  // Click / Tap flow
  const handleLeftClick = (id: string) => {
    if (matchedIds.has(id)) return;
    sound.playClick();
    if (selectedLeftId === id) {
      setSelectedLeftId(null);
    } else {
      setSelectedLeftId(id);
      const item = pairs.find((p) => p.id === id);
      setFeedbackMessage(`Đang chọn: ${item?.leftText || 'đối tượng'}. Giờ hãy bấm vào bức tranh bên phải!`);
    }
  };

  const handleRightClick = (id: string) => {
    if (matchedIds.has(id)) return;
    if (selectedLeftId) {
      handleMatchAttempt(selectedLeftId, id);
    } else {
      setFeedbackMessage('Hãy chọn một đối tượng ở cột bên trái trước nhé!');
    }
  };

  // HTML5 Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    if (matchedIds.has(id)) {
      e.preventDefault();
      return;
    }
    sound.playClick();
    setDraggedLeftId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';

    const preview = document.createElement('div');
    preview.className = 'matching-drag-preview';
    const pair = pairs.find((item) => item.id === id);
    if (pair?.leftImage) {
      const image = document.createElement('img');
      image.src = pair.leftImage;
      image.alt = '';
      preview.appendChild(image);
    }
    document.body.appendChild(preview);
    e.dataTransfer.setDragImage(preview, preview.offsetWidth / 2, preview.offsetHeight / 2);
    window.setTimeout(() => preview.remove(), 0);
  };

  const handleDragEnd = () => {
    setDraggedLeftId(null);
    setHoveredRightId(null);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (!matchedIds.has(id)) {
      setHoveredRightId(id);
    }
  };

  const handleDragLeave = () => {
    setHoveredRightId(null);
  };

  const handleDrop = (e: React.DragEvent, targetRightId: string) => {
    e.preventDefault();
    setHoveredRightId(null);
    const sourceLeftId = e.dataTransfer.getData('text/plain') || draggedLeftId;
    if (sourceLeftId) {
      handleMatchAttempt(sourceLeftId, targetRightId);
    }
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sound.setSoundEnabled(next);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Dynamic CSS classes for aspect ratio requested by user
  const getImageRatioClass = () => {
    switch (aspectRatio) {
      case '16:9':
        return 'h-full w-full object-contain rounded-xl'; // 16:9 widescreen
      case '4:3':
        return 'h-full w-full object-contain rounded-xl';
      case '1:1':
        return 'h-full w-full object-contain rounded-xl';
      case 'portrait':
        return 'h-full w-full object-contain rounded-xl';
      default:
        return 'h-full w-full object-contain rounded-xl';
    }
  };

  const progressPercentage = pairs.length > 0 ? Math.round((matchedIds.size / pairs.length) * 100) : 0;

  return (
    <div className="w-full mx-auto">
      {/* Top Game Navigation & Control Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700"
              title="Quay lại danh sách trò chơi"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-800 line-clamp-1">
                  {game.title}
                </h1>
                <p className="text-xs text-slate-500">
                  {game.subject} · {game.gradeLevel} · Tỉ lệ ảnh hiện tại: <span className="font-semibold text-emerald-600">{aspectRatio}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Aspect Ratio Switcher - Highlights the user's customizability! */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs">
            <span className="text-slate-600 font-medium px-2 hidden sm:inline">Tỉ lệ ảnh tranh:</span>
            {(['16:9', '4:3', '1:1', 'portrait'] as AspectRatio[]).map((ratio) => (
              <button
                key={ratio}
                onClick={() => {
                  setAspectRatio(ratio);
                  sound.playClick();
                }}
                className={`px-3 py-1.5 font-semibold rounded-lg transition-all ${
                  aspectRatio === ratio
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {ratio === 'portrait' ? 'Dọc (cũ)' : ratio === '16:9' ? '16:9 Rộng (Ưa chuộng)' : ratio}
              </button>
            ))}
          </div>

          {/* Status Indicators & Control actions */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-lg border border-amber-200">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="font-mono text-sm">{formatTime(timeRemaining)}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Điểm: {score}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleSound}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
              >
                {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  initGame();
                }}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title="Chơi lại từ đầu"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              {onEditGame && (
                <button
                  onClick={onEditGame}
                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors font-medium text-xs"
                >
                  Sửa Game
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Game Stage - three-column layout inspired by the reference */}
      <div className="grid grid-cols-1 h-[calc(100vh-170px)] xl:grid-cols-[320px_minmax(420px,1fr)_250px] lg:grid-cols-[260px_minmax(360px,1fr)_220px] gap-4 items-stretch">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 h-full">
          <h2 className="text-sm font-bold uppercase tracking-wide text-purple-700 text-center py-2 mb-3 bg-purple-50 rounded-lg">
            KÉO TỪ ĐÂY
          </h2>
          <p className="text-[11px] text-center text-slate-500 mb-3">
            Các đối tượng · {matchedIds.size}/{pairs.length}
          </p>
          <div className="grid h-[calc(100%-58px)] grid-cols-1 gap-3">
            {pairs.map((pair) => {
              const isMatched = matchedIds.has(pair.id);
              const isSelected = selectedLeftId === pair.id;
              if (isMatched) return null;
              return (
                <div
                  key={pair.id}
                  draggable={!isMatched}
                  onDragStart={(e) => handleDragStart(e, pair.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleLeftClick(pair.id)}
                  className={`h-full min-h-0 rounded-xl border-2 transition-all cursor-pointer select-none touch-none flex items-center justify-center relative ${
                    isMatched ? 'border-emerald-300 bg-emerald-50 opacity-70'
                    : draggedLeftId === pair.id ? 'border-blue-500 bg-blue-50 opacity-45 scale-[0.96]'
                    : isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-md'
                  }`}
                >
                  {pair.leftImage ? (
                    <img src={pair.leftImage} alt={pair.leftText || 'Đối tượng'} className="max-h-[75%] max-w-[65%] object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-xl font-black text-indigo-600">{pair.leftText?.charAt(0) || '?'}</span>
                  )}
                  {pair.leftText && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); sound.speakVietnamese(pair.leftText || ''); }}
                      className="absolute right-2 top-2 p-1.5 text-slate-300 hover:text-blue-600"
                      title="Nghe đọc"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                  {isMatched && <CheckCircle2 className="absolute right-3 bottom-3 w-5 h-5 text-emerald-600" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 h-full">
          <h2 className="text-sm font-bold uppercase tracking-wide text-blue-700 text-center py-2 mb-3 bg-blue-50 rounded-lg">
            THẢ VÀO ĐÚNG VỊ TRÍ
          </h2>
          <div className="grid h-[calc(100%-58px)] grid-cols-1 sm:grid-cols-2 gap-4 content-stretch">
            {shuffledRightItems.map((pair) => {
              const isMatched = matchedIds.has(pair.id);
              const isHovered = hoveredRightId === pair.id;
              const isWrong = wrongShakeId === pair.id;
              return (
                <div
                  key={pair.id}
                  onDragOver={(e) => handleDragOver(e, pair.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, pair.id)}
                  onClick={() => handleRightClick(pair.id)}
                  className={`relative h-full rounded-xl border-2 p-2 cursor-pointer transition-all ${
                    isMatched ? 'border-emerald-400 bg-emerald-50'
                    : isHovered ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                    : isWrong ? 'border-rose-500 bg-rose-50 animate-shake'
                    : 'border-slate-200 bg-white hover:border-blue-400'
                  }`}
                >
                  {isMatched ? (
                    <div className={`relative grid h-full min-h-[220px] grid-cols-[38%_62%] gap-2 rounded-lg bg-slate-100 p-2 ${landingPairId === pair.id ? 'matching-landed' : ''}`}>
                      <div className="matching-left-piece flex items-center justify-center rounded-xl border-2 border-white bg-white shadow-lg">
                        {pair.leftImage && <img src={pair.leftImage} alt="" className="h-full w-full object-contain p-2" />}
                      </div>
                      <div className="relative min-w-0 overflow-hidden rounded-lg">
                        {pair.rightImage ? (
                          <img src={pair.rightImage} alt={pair.rightText || 'Hình ảnh'} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">Chưa có hình ảnh</div>
                        )}
                      </div>
                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-emerald-700 shadow-lg">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-xs font-bold">Đúng</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-full min-h-[220px] overflow-hidden rounded-lg bg-slate-100">
                      {pair.rightImage ? (
                        <img src={pair.rightImage} alt={pair.rightText || 'Hình ảnh'} className={getImageRatioClass()} referrerPolicy="no-referrer" />
                      ) : (
                        <div className={`${getImageRatioClass()} flex items-center justify-center text-xs text-slate-400`}>Chưa có hình ảnh</div>
                      )}
                    </div>
                  )}
                  {wrongPairId === pair.id && (
                    <div className="absolute inset-x-4 bottom-4 z-20 rounded-xl border border-rose-300 bg-white px-3 py-2 text-center text-sm font-black text-rose-600 shadow-xl animate-in fade-in zoom-in-95">
                      Chưa đúng! Chọn/ kéo sang vị trí khác
                    </div>
                  )}
                  {pair.rightText && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); sound.speakVietnamese(pair.rightText || ''); }}
                      className="absolute bottom-3 right-3 rounded-lg bg-white/95 p-1.5 text-slate-400 shadow hover:text-blue-600"
                      title="Nghe đọc"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 h-full">
          <img src={SVG_ASSETS.sunMascot} alt="Thành tích" className="w-24 h-24 mx-auto mb-3" />
          <div className="mb-3 py-2 text-center rounded-lg bg-purple-50 text-sm font-bold text-purple-700">Thành tích</div>
          <div className="space-y-3">
            {[
              ['Cặp đúng', String(matchedIds.size)],
              ['Cặp còn lại', String(pairs.length - matchedIds.size)],
              ['Thời gian', formatTime(timeRemaining)],
              ['Điểm số', String(score)],
            ].map(([label, value]) => (
              <div key={label} className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-3 flex items-center justify-between">
                <span className="text-xs text-slate-600">{label}</span>
                <span className="text-base font-bold text-blue-700">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-3 py-3">
            <p className="text-xs font-bold text-amber-700 mb-1">Mẹo nhỏ</p>
            <p className="text-[11px] leading-relaxed text-slate-600">{feedbackMessage}</p>
          </div>
          <div className="mt-3 rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-3">
            <p className="text-xs font-bold text-indigo-700 mb-1">Nhiệm vụ</p>
            <p className="text-[11px] leading-relaxed text-slate-600">Kéo đối tượng từ bên trái vào vị trí phù hợp bên phải.</p>
          </div>
        </div>
      </div>

      {/* Victory Celebration Modal */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-amber-300">
              <Trophy className="w-10 h-10 text-amber-600" />
            </div>

            <h3 className="text-2xl font-black text-slate-800 font-heading">
              HOÀN HẢO! EM RẤT XUẤT SẮC!
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Em đã hoàn thành xuất sắc trò chơi <strong>{game.title}</strong> với kết quả vượt trội!
            </p>

            {/* Score & Stars */}
            <div className="my-5 p-4 bg-amber-50/80 rounded-2xl border border-amber-200 flex justify-around items-center">
              <div>
                <p className="text-xs text-amber-700 font-semibold uppercase">Điểm đạt được</p>
                <p className="text-2xl font-black text-amber-900 mt-0.5">{score} đ</p>
              </div>
              <div className="w-px h-10 bg-amber-200" />
              <div>
                <p className="text-xs text-amber-700 font-semibold uppercase">Thời gian còn lại</p>
                <p className="text-2xl font-black text-amber-900 mt-0.5">{formatTime(timeRemaining)}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={initGame}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 text-sm transition-colors"
              >
                Chơi Lại Lần Nữa
              </button>
              <button
                onClick={onBack}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-white text-sm shadow-md transition-colors"
              >
                Về Kho Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
