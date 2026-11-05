import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Game } from '../../types/game';
import { sound } from '../../utils/audio';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Trophy, Clock, Sparkles } from 'lucide-react';

interface MemoryCard {
  uid: string; // unique card id for render
  pairId: string;
  text?: string;
  image?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  game: Game;
  onBack: () => void;
  onEditGame?: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ game, onBack, onEditGame }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(sound.isSoundEnabled());
  const [time, setTime] = useState<number>(0);

  const initGame = () => {
    const rawPairs = game.memoryPairs || game.matchPairs || [];
    const deck: MemoryCard[] = [];

    rawPairs.slice(0, 6).forEach((p, idx) => {
      // First card of pair
      deck.push({
        uid: `${p.id}-left-${idx}`,
        pairId: p.id,
        text: p.leftText,
        image: p.leftImage || p.rightImage,
        isFlipped: false,
        isMatched: false,
      });
      // Second card of pair
      deck.push({
        uid: `${p.id}-right-${idx}`,
        pairId: p.id,
        text: p.rightText || p.leftText,
        image: p.rightImage || p.leftImage,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndexes([]);
    setMoves(0);
    setIsWon(false);
    setTime(0);
  };

  useEffect(() => {
    initGame();
  }, [game]);

  // Timer
  useEffect(() => {
    if (isWon) return;
    const interval = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isWon]);

  const handleCardClick = (index: number) => {
    if (cards[index].isMatched || cards[index].isFlipped || flippedIndexes.length >= 2) return;

    sound.playClick();
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndexes, index];
    setFlippedIndexes(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const card1 = newCards[firstIdx];
      const card2 = newCards[secondIdx];

      if (card1.pairId === card2.pairId) {
        // Matched!
        setTimeout(() => {
          sound.playCorrect();
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setCards([...newCards]);
          setFlippedIndexes([]);

          if (newCards.every((c) => c.isMatched)) {
            setIsWon(true);
            sound.playVictory();
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          }
        }, 400);
      } else {
        // Not matched
        setTimeout(() => {
          sound.playWrong();
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards([...newCards]);
          setFlippedIndexes([]);
        }, 900);
      }
    }
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      {/* Control bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{game.title}</h1>
            <p className="text-xs text-slate-500">Lật thẻ để tìm các cặp hình ảnh và nội dung tương đồng</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-mono">{formatTime(time)}</span>
          </div>

          <div className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg">
            Số lượt lật: {moves}
          </div>

          <button
            onClick={() => {
              const next = !soundOn;
              setSoundOn(next);
              sound.setSoundEnabled(next);
            }}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={initGame}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Trộn bài và chơi lại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const showContent = card.isFlipped || card.isMatched;

          return (
            <div
              key={card.uid}
              onClick={() => handleCardClick(idx)}
              className={`relative h-44 rounded-2xl border-2 transition-all duration-300 cursor-pointer select-none flex flex-col items-center justify-center p-3 overflow-hidden ${
                card.isMatched
                  ? 'border-emerald-400 bg-emerald-50/80 shadow-sm opacity-80'
                  : card.isFlipped
                  ? 'border-blue-500 bg-white shadow-md scale-102'
                  : 'border-indigo-300 bg-gradient-to-br from-indigo-500 to-purple-600 hover:shadow-lg hover:scale-101 text-white'
              }`}
            >
              {showContent ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 animate-in fade-in zoom-in duration-200">
                  {card.image && (
                    <div className="w-full h-24 overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center">
                      <img
                        src={card.image}
                        alt="Card"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  {card.text && (
                    <p className="text-xs font-bold text-slate-800 text-center line-clamp-2 px-1">
                      {card.text}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs">
                    <Sparkles className="w-6 h-6 text-amber-300" />
                  </div>
                  <span className="text-xs font-bold text-white/90 uppercase tracking-widest mt-1">
                    BÍ MẬT
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Victory modal */}
      {isWon && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-xl border border-slate-100">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-black text-slate-800 font-heading">TRÍ NHỚ TUYỆT VỜI!</h3>
            <p className="text-xs text-slate-600 mt-2">
              Em đã mở khóa toàn bộ các thẻ bí mật trong {moves} lượt lật và {formatTime(time)}!
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={initGame}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 text-xs"
              >
                Chơi Lại
              </button>
              <button
                onClick={onBack}
                className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-white text-xs"
              >
                Về Trang Chủ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
