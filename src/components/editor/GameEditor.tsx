import React, { useState } from 'react';
import { Game, GameType, AspectRatio, MatchPair, QuizQuestion, WheelItem } from '../../types/game';
import { storage } from '../../utils/storage';
import { PRESET_IMAGES, SVG_ASSETS } from '../../data/defaultGames';
import { ArrowLeft, Save, Plus, Trash2, Image as ImageIcon, Upload, Sparkles, Check, HelpCircle, Eye } from 'lucide-react';

interface GameEditorProps {
  initialGame?: Game | null;
  onSave: (savedGame: Game) => void;
  onCancel: () => void;
}

export const GameEditor: React.FC<GameEditorProps> = ({ initialGame, onSave, onCancel }) => {
  const isEditing = Boolean(initialGame);

  const [type, setType] = useState<GameType>(initialGame?.type || 'matching');
  const [title, setTitle] = useState<string>(initialGame?.title || 'Trò Chơi Học Tập Mới');
  const [description, setDescription] = useState<string>(initialGame?.description || 'Mô tả trò chơi học tập tương tác cho học sinh.');
  const [gradeLevel, setGradeLevel] = useState<string>(initialGame?.gradeLevel || 'Lớp 3');
  const [subject, setSubject] = useState<string>(initialGame?.subject || 'Tiếng Việt');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(initialGame?.aspectRatio || '16:9');
  const [instruction, setInstruction] = useState<string>(initialGame?.instruction || 'Hãy quan sát và nối đúng các đối tượng tương ứng nhé!');
  const [timeLimit, setTimeLimit] = useState<number>(initialGame?.timeLimitSeconds || 120);

  // Match Pairs state
  const [matchPairs, setMatchPairs] = useState<MatchPair[]>(
    initialGame?.matchPairs || [
      {
        id: 'p1',
        leftText: 'Đối tượng 1',
        leftImage: SVG_ASSETS.fieldMouse,
        rightText: 'Môi trường 1 (Ảnh 16:9)',
        rightImage: PRESET_IMAGES.countryside16x9,
        hint: 'Tuyệt vời! Em đã ghép đúng.',
      },
      {
        id: 'p2',
        leftText: 'Đối tượng 2',
        leftImage: SVG_ASSETS.cityMouse,
        rightText: 'Môi trường 2 (Ảnh 16:9)',
        rightImage: PRESET_IMAGES.city16x9,
        hint: 'Rất chính xác!',
      },
    ]
  );

  // Quiz questions state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(
    initialGame?.quizQuestions || [
      {
        id: 'q1',
        question: 'Câu hỏi mẫu số 1 dành cho học sinh?',
        image: PRESET_IMAGES.city16x9,
        options: ['Đáp án A', 'Đáp án B (Đúng)', 'Đáp án C', 'Đáp án D'],
        correctAnswerIndex: 1,
        explanation: 'Lời giải thích dễ hiểu cho học sinh tiểu học.',
      },
    ]
  );

  // Wheel items state
  const [wheelItems, setWheelItems] = useState<WheelItem[]>(
    initialGame?.wheelItems || [
      { id: 'w1', text: 'Học sinh 1', color: '#38bdf8' },
      { id: 'w2', text: 'Học sinh 2', color: '#f43f5e' },
      { id: 'w3', text: 'Học sinh 3', color: '#10b981' },
      { id: 'w4', text: 'Học sinh 4', color: '#f59e0b' },
    ]
  );

  // Image preset modal or selection helper
  const [activePickerTarget, setActivePickerTarget] = useState<{
    index: number;
    side: 'left' | 'right' | 'quiz';
  } | null>(null);

  // Handle local image file upload & compress
  const handleFileUpload = async (file: File, index: number, side: 'left' | 'right' | 'quiz') => {
    try {
      const base64 = await storage.compressAndConvertImage(file, 1280, 0.85);
      if (side === 'left') {
        const updated = [...matchPairs];
        updated[index].leftImage = base64;
        setMatchPairs(updated);
      } else if (side === 'right') {
        const updated = [...matchPairs];
        updated[index].rightImage = base64;
        setMatchPairs(updated);
      } else if (side === 'quiz') {
        const updated = [...quizQuestions];
        updated[index].image = base64;
        setQuizQuestions(updated);
      }
    } catch (err) {
      alert('Lỗi tải hình ảnh: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề cho trò chơi!');
      return;
    }

    const savedGame: Game = {
      id: initialGame?.id || `game-${Date.now()}`,
      title: title.trim(),
      type,
      description: description.trim(),
      gradeLevel,
      subject,
      thumbnail:
        type === 'matching'
          ? matchPairs[0]?.rightImage || PRESET_IMAGES.countryside16x9
          : type === 'quiz'
          ? quizQuestions[0]?.image || PRESET_IMAGES.solarSystem16x9
          : PRESET_IMAGES.forest16x9,
      aspectRatio,
      tags: ['Tự tạo', aspectRatio, subject],
      createdAt: initialGame?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      isCustom: true,
      timeLimitSeconds: Number(timeLimit) || 120,
      instruction,
      matchPairs: type === 'matching' ? matchPairs : undefined,
      memoryPairs: type === 'memory' ? matchPairs : undefined,
      quizQuestions: type === 'quiz' ? quizQuestions : undefined,
      wheelItems: type === 'wheel' ? wheelItems : undefined,
    };

    onSave(savedGame);
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-16">
      {/* Top action header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {isEditing ? `Chỉnh Sửa Trò Chơi: ${initialGame?.title || ''}` : 'Studio Sáng Tạo Trò Chơi Mới'}
            </h1>
            <p className="text-xs text-slate-500">
              Thiết kế nội dung, tùy chỉnh tỉ lệ ảnh 16:9 chuẩn và luật chơi cho học sinh Dương Kinh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
          >
            Hủy Bỏ
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Trò Chơi</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* SECTION 1: GENERAL METADATA */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            1. THÔNG TIN CHUNG & TỈ LỆ KHUNG HÌNH (16:9 / 4:3 / VUÔNG)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Game Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Loại Trò Chơi</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as GameType)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="matching">Trò chơi Nối Ý (Kéo thả ghép cặp - Hỗ trợ ảnh 16:9)</option>
                <option value="memory">Lật Thẻ Bí Mật (Trí nhớ)</option>
                <option value="wheel">Vòng Quay Gọi Tên Lớp Học</option>
                <option value="quiz">Chuyến Tàu Tri Thức (Đố vui trắc nghiệm)</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tên Trò Chơi</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Nơi Ở Của Hai Anh Em..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Môn Học</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="Tiếng Việt">Tiếng Việt</option>
                <option value="Toán">Toán</option>
                <option value="Tự nhiên & Xã hội">Tự nhiên & Xã hội</option>
                <option value="Lịch sử & Địa phương">Lịch sử & Địa phương Hải Phòng</option>
                <option value="Tiếng Anh">Tiếng Anh</option>
                <option value="Hoạt động trải nghiệm">Hoạt động trải nghiệm</option>
              </select>
            </div>

            {/* Grade level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Khối Lớp</label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="Lớp 1">Lớp 1</option>
                <option value="Lớp 2">Lớp 2</option>
                <option value="Lớp 3">Lớp 3</option>
                <option value="Lớp 4">Lớp 4</option>
                <option value="Lớp 5">Lớp 5</option>
                <option value="Toàn trường">Toàn trường</option>
              </select>
            </div>

            {/* The core aspect ratio setting highlighted to user */}
            <div className="md:col-span-2 p-4 rounded-xl bg-blue-50/70 border border-blue-200">
              <label className="block text-xs font-bold text-blue-900 mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                TÙY CHỈNH TỈ LỆ KHUNG HÌNH ẢNH (GIẢI QUYẾT BỊ BẮT BUỘC DỌC NHƯ TRANG CŨ)
              </label>
              <p className="text-xs text-blue-700 mb-3">
                Thầy cô và các em có thể chọn tỉ lệ 16:9 ngang chuẩn giúp hình ảnh đồng quê, thành phố, lớp học hiển thị rộng lớn, bao quát và sắc nét trên tivi/máy chiếu:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: '16:9', label: '16:9 Widescreen (Khuyên dùng)', desc: 'Chuẩn màn hình máy tính, tivi lớp học' },
                  { id: '4:3', label: '4:3 Truyền thống', desc: 'Tỉ lệ sách giáo khoa tiêu chuẩn' },
                  { id: '1:1', label: '1:1 Vuông', desc: 'Thẻ bài, biểu tượng vuông vức' },
                  { id: 'portrait', label: 'Dọc (3:4)', desc: 'Tỉ lệ dọc như trang web cũ' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAspectRatio(item.id as AspectRatio)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      aspectRatio === item.id
                        ? 'border-blue-600 bg-white shadow-sm ring-2 ring-blue-300'
                        : 'border-slate-200 bg-white/70 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-800">{item.label}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Mô tả hoặc Lời dặn dò</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: CONTENT BUILDER DEPENDING ON GAME TYPE */}
        {type === 'matching' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                2. DANH SÁCH CẶP ĐỐI TƯỢNG VÀ TRANH NỀN {aspectRatio}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setMatchPairs([
                    ...matchPairs,
                    {
                      id: `p-${Date.now()}`,
                      leftText: `Đối tượng ${matchPairs.length + 1}`,
                      leftImage: SVG_ASSETS.sunMascot,
                      rightText: `Môi trường ${matchPairs.length + 1}`,
                      rightImage: PRESET_IMAGES.countryside16x9,
                      hint: 'Chính xác!',
                    },
                  ]);
                }}
                className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Cặp Mới</span>
              </button>
            </div>

            <div className="space-y-4">
              {matchPairs.map((pair, idx) => (
                <div
                  key={pair.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-start"
                >
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                    {idx + 1}
                  </span>

                  {/* Left item (Source object) */}
                  <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-indigo-700 mb-2">Bên Trái (Đối tượng kéo đi)</p>
                    <input
                      type="text"
                      value={pair.leftText || ''}
                      onChange={(e) => {
                        const updated = [...matchPairs];
                        updated[idx].leftText = e.target.value;
                        setMatchPairs(updated);
                      }}
                      placeholder="Tên đối tượng (VD: Chuột đồng...)"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 mb-2"
                    />

                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center">
                        {pair.leftImage ? (
                          <img src={pair.leftImage} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <label className="cursor-pointer py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Tải ảnh lên</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(e.target.files[0], idx, 'left');
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setActivePickerTarget({ index: idx, side: 'left' })}
                        className="py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700"
                      >
                        Chọn mẫu
                      </button>
                    </div>
                  </div>

                  {/* Right item (Target landscape 16:9) */}
                  <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-emerald-700 mb-2">Bên Phải (Bức tranh {aspectRatio})</p>
                    <input
                      type="text"
                      value={pair.rightText || ''}
                      onChange={(e) => {
                        const updated = [...matchPairs];
                        updated[idx].rightText = e.target.value;
                        setMatchPairs(updated);
                      }}
                      placeholder="Mô tả bức tranh (VD: Đồng quê thanh bình...)"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 mb-2"
                    />

                    <div className="flex items-center gap-2">
                      <div className="w-16 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center">
                        {pair.rightImage ? (
                          <img src={pair.rightImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <label className="cursor-pointer py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Tải ảnh 16:9</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(e.target.files[0], idx, 'right');
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setActivePickerTarget({ index: idx, side: 'right' })}
                        className="py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700"
                      >
                        Chọn tranh mẫu
                      </button>
                    </div>
                  </div>

                  {/* Remove button */}
                  {matchPairs.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setMatchPairs(matchPairs.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600 p-2 mt-1"
                      title="Xóa cặp này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2 FOR QUIZ */}
        {type === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                2. DANH SÁCH CÂU HỎI TRẮC NGHIỆM
              </h2>
              <button
                type="button"
                onClick={() => {
                  setQuizQuestions([
                    ...quizQuestions,
                    {
                      id: `q-${Date.now()}`,
                      question: `Câu hỏi trắc nghiệm số ${quizQuestions.length + 1}?`,
                      image: PRESET_IMAGES.city16x9,
                      options: ['Lựa chọn A', 'Lựa chọn B', 'Lựa chọn C', 'Lựa chọn D'],
                      correctAnswerIndex: 0,
                      explanation: 'Giải thích chi tiết cho học sinh.',
                    },
                  ]);
                }}
                className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Câu Hỏi</span>
              </button>
            </div>

            <div className="space-y-6">
              {quizQuestions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-blue-800 uppercase">Câu hỏi {idx + 1}</span>
                    {quizQuestions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setQuizQuestions(quizQuestions.filter((_, i) => i !== idx))}
                        className="text-rose-600 hover:text-rose-700 text-xs font-semibold"
                      >
                        Xóa câu này
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...quizQuestions];
                      updated[idx].question = e.target.value;
                      setQuizQuestions(updated);
                    }}
                    placeholder="Nội dung câu hỏi..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white mb-3"
                  />

                  {/* 4 Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correctAnswerIndex === optIdx}
                          onChange={() => {
                            const updated = [...quizQuestions];
                            updated[idx].correctAnswerIndex = optIdx;
                            setQuizQuestions(updated);
                          }}
                          className="w-4 h-4 text-emerald-600"
                        />
                        <span className="text-xs font-bold text-slate-500 w-4">{['A', 'B', 'C', 'D'][optIdx]}:</span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updated = [...quizQuestions];
                            updated[idx].options[optIdx] = e.target.value;
                            setQuizQuestions(updated);
                          }}
                          className="flex-1 px-2 py-1 text-xs rounded-lg border border-slate-200"
                        />
                      </div>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={q.explanation || ''}
                    onChange={(e) => {
                      const updated = [...quizQuestions];
                      updated[idx].explanation = e.target.value;
                      setQuizQuestions(updated);
                    }}
                    placeholder="Lời giải thích sau khi học sinh trả lời..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preset Image Chooser Modal */}
      {activePickerTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Chọn Ảnh Mẫu Chuẩn 16:9 Chất Lượng Cao
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Các bức tranh mẫu 16:9 được tạo riêng cho chủ đề học tập tiểu học:
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => {
                  if (activePickerTarget.side === 'left') {
                    const updated = [...matchPairs];
                    updated[activePickerTarget.index].leftImage = PRESET_IMAGES.countryside16x9;
                    setMatchPairs(updated);
                  } else {
                    const updated = [...matchPairs];
                    updated[activePickerTarget.index].rightImage = PRESET_IMAGES.countryside16x9;
                    setMatchPairs(updated);
                  }
                  setActivePickerTarget(null);
                }}
                className="group cursor-pointer rounded-xl border border-slate-200 p-2 hover:border-blue-500 transition-all"
              >
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 mb-2">
                  <img src={PRESET_IMAGES.countryside16x9} alt="" className="w-full h-full object-cover group-hover:scale-102 transition-transform" />
                </div>
                <p className="text-xs font-bold text-slate-800">1. Làng Quê Nông Thôn (16:9)</p>
              </div>

              <div
                onClick={() => {
                  if (activePickerTarget.side === 'left') {
                    const updated = [...matchPairs];
                    updated[activePickerTarget.index].leftImage = PRESET_IMAGES.city16x9;
                    setMatchPairs(updated);
                  } else {
                    const updated = [...matchPairs];
                    updated[activePickerTarget.index].rightImage = PRESET_IMAGES.city16x9;
                    setMatchPairs(updated);
                  }
                  setActivePickerTarget(null);
                }}
                className="group cursor-pointer rounded-xl border border-slate-200 p-2 hover:border-blue-500 transition-all"
              >
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 mb-2">
                  <img src={PRESET_IMAGES.city16x9} alt="" className="w-full h-full object-cover group-hover:scale-102 transition-transform" />
                </div>
                <p className="text-xs font-bold text-slate-800">2. Thành Phố Hiện Đại (16:9)</p>
              </div>

              <div
                onClick={() => {
                  if (activePickerTarget.side === 'left') {
                    const updated = [...matchPairs];
                    updated[activePickerTarget.index].leftImage = PRESET_IMAGES.forest16x9;
                    setMatchPairs(updated);
                  } else {
                    const updated = [...matchPairs];
                    updated[activePickerTarget.index].rightImage = PRESET_IMAGES.forest16x9;
                    setMatchPairs(updated);
                  }
                  setActivePickerTarget(null);
                }}
                className="group cursor-pointer rounded-xl border border-slate-200 p-2 hover:border-blue-500 transition-all"
              >
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 mb-2">
                  <img src={PRESET_IMAGES.forest16x9} alt="" className="w-full h-full object-cover group-hover:scale-102 transition-transform" />
                </div>
                <p className="text-xs font-bold text-slate-800">3. Rừng Xanh Kỳ Thú (16:9)</p>
              </div>

              <div
                onClick={() => {
                  if (activePickerTarget.side === 'left') {
                    const updated = [...matchPairs];
                    updated[activePickerTarget.index].leftImage = PRESET_IMAGES.solarSystem16x9;
                    setMatchPairs(updated);
                  } else {
                    const updated = [...matchPairs];
                    updated[activePickerTarget.index].rightImage = PRESET_IMAGES.solarSystem16x9;
                    setMatchPairs(updated);
                  }
                  setActivePickerTarget(null);
                }}
                className="group cursor-pointer rounded-xl border border-slate-200 p-2 hover:border-blue-500 transition-all"
              >
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 mb-2">
                  <img src={PRESET_IMAGES.solarSystem16x9} alt="" className="w-full h-full object-cover group-hover:scale-102 transition-transform" />
                </div>
                <p className="text-xs font-bold text-slate-800">4. Vũ Trụ & Các Vì Sao (16:9)</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setActivePickerTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
