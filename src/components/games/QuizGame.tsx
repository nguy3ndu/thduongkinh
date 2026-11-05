import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Game } from '../../types/game';
import { sound } from '../../utils/audio';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, CheckCircle, XCircle, Trophy, HelpCircle, ArrowRight } from 'lucide-react';

interface QuizGameProps {
  game: Game;
  onBack: () => void;
  onEditGame?: () => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ game, onBack }) => {
  const questions = game.quizQuestions || [];
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(sound.isSoundEnabled());

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctAnswerIndex) {
      sound.playCorrect();
      setScore((s) => s + 25);
    } else {
      sound.playWrong();
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      sound.playVictory();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-auto">
        <p className="text-slate-600">Trò chơi chưa có câu hỏi nào. Vui lòng bấm Sửa game để thêm câu hỏi!</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-12">
      {/* Top bar */}
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
            <p className="text-xs text-slate-500">
              Câu hỏi {currentIndex + 1} / {questions.length} · Điểm hiện tại: {score}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
            onClick={handleRestart}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Bắt đầu lại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full bg-slate-200 h-2 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {!isCompleted ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
          {/* Question Text & Sound */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug font-heading">
              {currentQ.question}
            </h2>
            <button
              onClick={() => sound.speakVietnamese(currentQ.question)}
              className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors shrink-0"
              title="Đọc câu hỏi"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* 16:9 Illustration if present */}
          {currentQ.image && (
            <div className="mb-6 w-full max-h-72 aspect-video overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
              <img
                src={currentQ.image}
                alt="Minh họa"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQ.options.map((option, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              const isCorrect = idx === currentQ.correctAnswerIndex;
              const isChosen = idx === selectedOption;

              let btnClass = 'border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/50 text-slate-800';
              if (isAnswered) {
                if (isCorrect) {
                  btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                } else if (isChosen) {
                  btnClass = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                } else {
                  btnClass = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3.5 ${btnClass}`}
                >
                  <span className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">
                    {letter}
                  </span>
                  <span className="text-sm font-semibold flex-1">{option}</span>

                  {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {isAnswered && isChosen && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {isAnswered && (
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-200">
              <div className="text-xs text-slate-600 max-w-lg">
                <span className="font-bold text-slate-800">Giải thích: </span>
                {currentQ.explanation || (selectedOption === currentQ.correctAnswerIndex ? 'Đáp án rất chính xác!' : 'Chúc em may mắn hơn ở câu tiếp theo nhé!')}
              </div>

              <button
                onClick={handleNext}
                className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 ml-auto"
              >
                <span>{currentIndex + 1 === questions.length ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Final Score Card */
        <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-auto shadow-md border border-slate-200">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 font-heading">CHÚC MỪNG EM!</h2>
          <p className="text-sm text-slate-600 mt-2">Em đã hoàn thành chuyến tàu tri thức</p>

          <div className="my-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <p className="text-xs text-blue-700 font-semibold uppercase">Tổng Điểm</p>
            <p className="text-3xl font-black text-blue-900 mt-1">{score} / {questions.length * 25} điểm</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRestart}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 text-sm"
            >
              Chơi Lại
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-white text-sm"
            >
              Về Danh Sách
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
