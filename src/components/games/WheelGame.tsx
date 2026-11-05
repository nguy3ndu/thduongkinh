import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Game, WheelItem } from '../../types/game';
import { sound } from '../../utils/audio';
import { ArrowLeft, RotateCw, Volume2, VolumeX, Users, Plus, Trash2, Award, Sparkles } from 'lucide-react';

interface WheelGameProps {
  game: Game;
  onBack: () => void;
  onEditGame?: () => void;
}

const DEFAULT_COLORS = [
  '#38bdf8', '#fb7185', '#34d399', '#fbbf24',
  '#a78bfa', '#f472b6', '#22d3ee', '#a3e635',
  '#fb923c', '#818cf8'
];

export const WheelGame: React.FC<WheelGameProps> = ({ game, onBack }) => {
  const [items, setItems] = useState<WheelItem[]>(game.wheelItems || []);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [newName, setNewName] = useState<string>('');
  const [soundOn, setSoundOn] = useState<boolean>(sound.isSoundEnabled());

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Draw the wheel on canvas
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas || items.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 15;
    const sliceAngle = (2 * Math.PI) / items.length;

    ctx.clearRect(0, 0, width, height);

    // Save and rotate context
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotationAngle * Math.PI) / 180);

    // Draw slices
    items.forEach((item, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px Quicksand, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 4;

      // Truncate name if too long
      const textToDraw = item.text.length > 20 ? item.text.substring(0, 18) + '...' : item.text;
      ctx.fillText(textToDraw, radius - 20, 5);
      ctx.restore();
    });

    // Draw center hub
    ctx.restore();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    // Center star
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', centerX, centerY);
  };

  useEffect(() => {
    drawWheel();
  }, [items, rotationAngle]);

  const spinWheel = () => {
    if (isSpinning || items.length < 2) return;

    setIsSpinning(true);
    setWinner(null);
    sound.playClick();

    const minRotations = 5;
    const randomExtra = Math.floor(Math.random() * 360);
    const targetRotation = rotationAngle + minRotations * 360 + randomExtra;
    const duration = 4000;
    const startTime = performance.now();
    const initialAngle = rotationAngle;

    let lastTickAngle = initialAngle;

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentAngle = initialAngle + (targetRotation - initialAngle) * easeProgress;

      setRotationAngle(currentAngle % 360);

      // Tick sound at interval
      if (Math.abs(currentAngle - lastTickAngle) >= 360 / items.length) {
        sound.playTick();
        lastTickAngle = currentAngle;
      }

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        setIsSpinning(false);

        // Calculate winner
        // Needle points directly at top (270 degrees in canvas coordinates)
        const finalNormalized = (currentAngle % 360 + 360) % 360;
        const sliceDeg = 360 / items.length;
        // Pointer is at 270 deg (top)
        const pointerDeg = (270 - finalNormalized + 360) % 360;
        const winningIndex = Math.floor(pointerDeg / sliceDeg) % items.length;
        const winningItem = items[winningIndex];

        setWinner(winningItem.text);
        sound.playVictory();
        sound.speakVietnamese(`Xin chúc mừng bạn ${winningItem.text}!`);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    };

    requestAnimationFrame(animateSpin);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newItem: WheelItem = {
      id: `w-${Date.now()}`,
      text: newName.trim(),
      color: DEFAULT_COLORS[items.length % DEFAULT_COLORS.length],
    };
    setItems([...items, newItem]);
    setNewName('');
    sound.playClick();
  };

  const handleDeleteItem = (id: string) => {
    if (items.length <= 2) {
      alert('Vòng quay cần có tối thiểu 2 mục để hoạt động.');
      return;
    }
    setItems(items.filter((it) => it.id !== id));
    sound.playClick();
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-12">
      {/* Header bar */}
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
            <p className="text-xs text-slate-500">Gọi tên ngẫu nhiên học sinh trong lớp học Tiểu học Dương Kinh</p>
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* WHEEL CANVAS STAGE */}
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            {/* Top Pointer Needle */}
            <div className="absolute -top-3 z-20 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-rose-600 drop-shadow-md" />
            </div>

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={460}
              height={460}
              className="max-w-full drop-shadow-lg"
            />
          </div>

          {/* SPIN ACTION BUTTON */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              onClick={spinWheel}
              disabled={isSpinning || items.length < 2}
              className="py-4 px-10 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-xl shadow-xl hover:shadow-2xl active:scale-98 transition-all disabled:opacity-50 flex items-center gap-3"
            >
              <RotateCw className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'ĐANG QUAY...' : 'QUAY NGAY!'}</span>
            </button>
            <p className="text-xs text-slate-400">
              Nhấn phím hoặc bấm nút để chọn một bạn bất ngờ
            </p>
          </div>

          {/* Winner announcement box */}
          {winner && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 w-full max-w-md text-center animate-in zoom-in-95 duration-200">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                CHÚC MỪNG BẠN MAY MẮN
              </p>
              <p className="text-2xl font-black text-emerald-900 mt-1 font-heading">{winner}</p>
            </div>
          )}
        </div>

        {/* ROSTER MANAGEMENT SIDEBAR */}
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              DANH SÁCH LỚP ({items.length} bạn)
            </h2>
          </div>

          {/* Quick add student form */}
          <form onSubmit={handleAddItem} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nhập tên học sinh mới..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shrink-0"
              title="Thêm vào vòng quay"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          {/* List */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length] }}
                  />
                  <span className="font-semibold text-slate-800 truncate">{item.text}</span>
                </div>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                  title="Xóa khỏi vòng quay"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
