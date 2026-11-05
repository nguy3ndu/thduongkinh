import React, { useState } from 'react';
import { BookOpen, Layers, Image as ImageIcon, Database, Code2, CheckCircle2, Copy, FileText, ArrowLeft, ExternalLink } from 'lucide-react';

interface SystemDocsProps {
  onBack: () => void;
}

export const SystemDocs: React.FC<SystemDocsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'images' | 'database'>('architecture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Tài Liệu Kỹ Thuật & Hướng Dẫn Quản Trị Hệ Thống
            </h1>
            <p className="text-xs text-slate-500">
              Dành riêng cho giáo viên và các em học sinh Tiểu học Dương Kinh làm chủ mã nguồn
            </p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'architecture' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kiến Trúc Hệ Thống
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'images' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tùy Chỉnh Ảnh 16:9
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'database' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quản Trị Cơ Sở Dữ Liệu
          </button>
        </div>
      </div>

      {/* TAB 1: ARCHITECTURE & "MUỐN SỬA GÌ THÌ LÀM Ở ĐÂU" */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              1. Khái Quát: "Muốn Sửa Gì Thì Làm Ở Đâu?"
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Hệ thống được thiết kế theo mô hình <strong>Component Modular Micro-Architecture</strong>. Mỗi trò chơi là một module độc lập, giúp học sinh và giáo viên dễ dàng thay đổi luật chơi hoặc tạo thêm trò chơi thứ 5, thứ 6 mà không làm ảnh hưởng đến các trò chơi khác.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-2.5 px-3">Bạn muốn sửa / làm gì?</th>
                    <th className="py-2.5 px-3">Mở tệp mã nguồn nào?</th>
                    <th className="py-2.5 px-3">Mô tả tác vụ cụ thể</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      Sửa logic trò Nối Ý, tỉ lệ ảnh 16:9, âm thanh ghép đúng/sai
                    </td>
                    <td className="py-2.5 px-3 font-mono text-blue-600 font-medium">
                      /src/components/games/MatchingGame.tsx
                    </td>
                    <td className="py-2.5 px-3">
                      Hàm <code className="bg-slate-100 px-1 py-0.5 rounded">handleMatchAttempt</code> kiểm tra ghép cặp, hàm <code className="bg-slate-100 px-1 py-0.5 rounded">getImageRatioClass</code> điều chỉnh tỉ lệ khung hình 16:9 / 4:3.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      Thêm trò chơi mới (VD: Bắn bóng tri thức, Kéo co)
                    </td>
                    <td className="py-2.5 px-3 font-mono text-blue-600 font-medium">
                      /src/components/games/NewGameName.tsx
                    </td>
                    <td className="py-2.5 px-3">
                      Tạo component mới theo mẫu của MatchingGame hoặc MemoryGame, sau đó khai báo kiểu trong <code className="bg-slate-100 px-1 py-0.5 rounded">types/game.ts</code>.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      Sửa danh sách câu hỏi / bài học mẫu mặc định
                    </td>
                    <td className="py-2.5 px-3 font-mono text-blue-600 font-medium">
                      /src/data/defaultGames.ts
                    </td>
                    <td className="py-2.5 px-3">
                      Chứa mảng <code className="bg-slate-100 px-1 py-0.5 rounded">DEFAULT_GAMES</code> gồm các bài học quê hương Dương Kinh, bài học hai anh em chuột, câu đố Hải Phòng.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      Chỉnh sửa trình tạo trò chơi (Game Studio / Editor)
                    </td>
                    <td className="py-2.5 px-3 font-mono text-blue-600 font-medium">
                      /src/components/editor/GameEditor.tsx
                    </td>
                    <td className="py-2.5 px-3">
                      Giao diện kéo thả, chọn tỉ lệ ảnh 16:9, thêm cặp câu hỏi, nén ảnh Base64 tự động.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      Sửa hiệu ứng âm thanh, tiếng chuông hoặc giọng đọc tiếng Việt
                    </td>
                    <td className="py-2.5 px-3 font-mono text-blue-600 font-medium">
                      /src/utils/audio.ts
                    </td>
                    <td className="py-2.5 px-3">
                      Sử dụng Web Audio API tổng hợp nốt nhạc (không sợ hỏng file âm thanh) và Web Speech API cho giọng đọc.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      Quản lý bộ nhớ lưu trữ, xuất/nhập tệp JSON cơ sở dữ liệu
                    </td>
                    <td className="py-2.5 px-3 font-mono text-blue-600 font-medium">
                      /src/utils/storage.ts
                    </td>
                    <td className="py-2.5 px-3">
                      Xử lý lưu trữ LocalStorage, xuất tệp sao lưu JSON để giáo viên chia sẻ giữa các máy tính trong trường.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Directory Tree */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-600" />
              2. Sơ Đồ Cấu Trúc Thư Mục
            </h2>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`├── KIEN_TRUC_HE_THONG.md      # Tài liệu kiến trúc tóm tắt toàn hệ thống
├── HUONG_DAN_SU_DUNG.md        # Hướng dẫn chi tiết tùy chỉnh ảnh 16:9 & CSDL
├── src/
│   ├── types/
│   │   └── game.ts             # Định nghĩa cấu trúc Game, MatchPair, AspectRatio
│   ├── data/
│   │   └── defaultGames.ts     # Dữ liệu game mẫu: Chuột đồng (16:9), Hải Phòng
│   ├── utils/
│   │   ├── audio.ts            # Hiệu ứng âm thanh chuẩn Web Audio + Đọc tiếng Việt
│   │   └── storage.ts          # Quản lý CSDL LocalStorage & Sao lưu JSON
│   ├── components/
│   │   ├── Header.tsx          # Thanh điều hướng chuẩn
│   │   ├── GameCard.tsx        # Thẻ hiển thị trò chơi trang chủ
│   │   ├── games/
│   │   │   ├── MatchingGame.tsx# Trò Nối Ý hỗ trợ khung ảnh 16:9 ngang chuẩn
│   │   │   ├── MemoryGame.tsx  # Trò Lật Thẻ Bí Mật
│   │   │   ├── WheelGame.tsx   # Trò Vòng Quay Lớp Học (Gọi tên học sinh)
│   │   │   └── QuizGame.tsx    # Trò Chuyến Tàu Tri Thức (Đố vui)
│   │   ├── editor/
│   │   │   └── GameEditor.tsx  # Studio thiết kế trò chơi không cần viết mã
│   │   └── docs/
│   │       └── SystemDocs.tsx  # Trung tâm tài liệu hướng dẫn trong ứng dụng
│   ├── App.tsx                 # Điều phối trang chủ, bộ lọc, xem game
│   └── index.css               # Phong cách Tailwind CSS và Font Quicksand`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: IMAGE CUSTOMIZATION (16:9 WIDESCREEN GUIDE) */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              Cách Tùy Chỉnh Hình Ảnh Chuẩn 16:9 (Không Bị Bắt Buộc Dọc)
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Trong trang web tham khảo của bạn, ảnh bị giới hạn trong khung dọc (tỉ lệ 3:4 hoặc 9:16) làm phong cảnh làng quê và thành phố bị cắt xén mất hai bên. Hệ thống mới của trường Tiểu học Dương Kinh đã được giải phóng hoàn toàn:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50">
                <span className="text-xs font-bold text-rose-700 uppercase">Trang web cũ (Nhược điểm)</span>
                <p className="text-xs text-slate-700 mt-1">
                  • Ép buộc ảnh thành khung dọc đứng (portrait).<br/>
                  • Phong cảnh làng quê, thành phố bị co ép, người chơi khó quan sát tổng thể.<br/>
                  • Không thể đổi sang tỉ lệ 16:9 phù hợp với tivi thông minh phòng học.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <span className="text-xs font-bold text-emerald-700 uppercase">Hệ thống mới Dương Kinh EdGames</span>
                <p className="text-xs text-slate-700 mt-1">
                  • <strong>Tỉ lệ 16:9 Chuẩn Màn Ảnh Rộng:</strong> Tận dụng trọn vẹn màn hình máy tính và tivi lớp học.<br/>
                  • <strong>Tự do chuyển đổi:</strong> Chọn 16:9, 4:3, 1:1, hoặc dọc ngay trong Game Editor và lúc chơi.<br/>
                  • <strong>Tự động tối ưu:</strong> Tích hợp nén ảnh thông minh tự động khi giáo viên tải ảnh lên.
                </p>
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-800 mt-6 mb-2">Thông Số Ảnh Khuyên Dùng Cho Giáo Viên</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900">1. Kích thước chuẩn (16:9)</p>
                <p className="text-slate-600 mt-1">
                  • Độ phân giải tối ưu: <strong>1280 x 720 px</strong> hoặc <strong>1920 x 1080 px</strong>.<br/>
                  • Định dạng: JPEG hoặc PNG, WebP.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900">2. Dung lượng tệp</p>
                <p className="text-slate-600 mt-1">
                  • Dưới <strong>500 KB</strong> mỗi ảnh để game tải ngay lập tức.<br/>
                  • Bộ nén tự động trong Game Editor sẽ tự cân chỉnh.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900">3. Bố cục đối tượng</p>
                <p className="text-slate-600 mt-1">
                  • Đối tượng chính đặt ở giữa hoặc 2/3 khung hình.<br/>
                  • Tránh đặt chi tiết quan trọng sát mép biên ngoài.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATABASE MANAGEMENT */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              Quản Trị Cơ Sở Dữ Liệu & Sao Lưu Dữ Liệu
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Hệ thống hiện tại sử dụng kiến trúc <strong>Offline-First & LocalStorage Cache</strong> kết hợp khả năng <strong>Xuất/Nhập tệp JSON</strong>. Điều này giúp giáo viên có thể sao lưu toàn bộ kho game ra tệp tin để chuyển sang máy tính khác, hoặc tải lên hệ thống máy chủ đám mây.
            </p>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Cấu Trúc Bảng Dữ Liệu (Schema JSON)</h3>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`{
  "id": "game-matching-noi-y",
  "title": "Nơi Ở Của Hai Anh Em",
  "type": "matching",              // 'matching' | 'memory' | 'wheel' | 'quiz'
  "aspectRatio": "16:9",           // '16:9' | '4:3' | '1:1' | 'portrait'
  "gradeLevel": "Lớp 3",
  "subject": "Tiếng Việt",
  "matchPairs": [
    {
      "id": "p1",
      "leftText": "Chuột Đồng",
      "leftImage": "data:image/svg+xml;...",
      "rightText": "Đồng Quê Thanh Bình",
      "rightImage": "/src/assets/images/edu_countryside_habitat_....jpg",
      "hint": "Chính xác! Chuột đồng sống ở nông thôn."
    }
  ]
}`}
            </pre>

            <h3 className="text-sm font-bold text-slate-800 mt-6 mb-2">Hướng Dẫn Kết Nối Cơ Sở Dữ Liệu Đám Mây (Cloud Database)</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Khi trường học muốn học sinh làm bài tập ở nhà và đồng bộ điểm số lên máy chủ của trường, có thể nâng cấp từ LocalStorage sang <strong>Firebase Firestore</strong> hoặc <strong>PostgreSQL (Cloud SQL)</strong> theo 3 bước cực kỳ đơn giản:
            </p>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong>Bước 1:</strong> Mở tệp <code className="text-blue-600 font-mono">src/utils/storage.ts</code>.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong>Bước 2:</strong> Thay thế hàm <code className="text-blue-600 font-mono">getGames()</code> và <code className="text-blue-600 font-mono">saveGame()</code> bằng lệnh gọi API đám mây (e.g. <code className="font-mono">fetch('/api/games')</code> hoặc Firestore SDK).
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong>Bước 3:</strong> Toàn bộ giao diện người dùng và các trò chơi (MatchingGame, MemoryGame, WheelGame, QuizGame) sẽ tự động đồng bộ ngay lập tức mà không cần sửa bất kỳ dòng mã hiển thị nào!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
