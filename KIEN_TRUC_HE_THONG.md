# KIẾN TRÚC HỆ THỐNG - Dương Kinh EDGAMES
*Nền tảng Sáng tạo & Chơi Trò chơi Giáo dục Tương tác Trường Tiểu học Dương Kinh*

---

## 1. TỔNG QUAN HỆ THỐNG

Dự án được xây dựng với mục tiêu:
1. **Kiểm soát 100% logic mã nguồn:** Khắc phục nhược điểm của các trang bên ngoài (như Giáo Viên Sáng Tạo ép ảnh thành khung dọc 3:4/9:16) bằng cách **cho phép tùy biến linh hoạt tỉ lệ 16:9 chuẩn màn chiếu, tivi thông minh, vi tính phòng học**.
2. **Dễ dàng mở rộng:** Thiết kế dạng mô-đun (Modular Component Architecture) để thầy cô và học sinh có thể lập trình thêm các trò chơi mới (như Trắc nghiệm, Kéo co, Bắn bóng, Lật thẻ...) mà không lo ảnh hưởng đến mã nguồn cũ.
3. **Quản lý dữ liệu linh hoạt (Offline-First):** Tự động lưu trên trình duyệt (LocalStorage), hỗ trợ tải về tệp sao lưu JSON để chia sẻ giữa các phòng máy tính, sẵn sàng kết nối Cloud Database (Firebase / PostgreSQL).

---

## 2. "MUỐN SỬA GÌ THÌ LÀM Ở ĐÂU?" (TRA CỨU NHANH)

| Nhu cầu chỉnh sửa | Vị trí tệp (File path) | Hướng dẫn thao tác |
| :--- | :--- | :--- |
| **Sửa logic trò Nối Ý (Matching Game)** | `src/components/games/MatchingGame.tsx` | Chỉnh sửa logic kéo thả HTML5 / chạm cảm ứng trong `handleMatchAttempt()`, hàm `getImageRatioClass()` quy định khung hình 16:9 / 4:3. |
| **Thêm trò chơi mới hoàn toàn** | Tạo `src/components/games/TenGameMoi.tsx` | Sao chép cấu trúc từ `MatchingGame.tsx` hoặc `MemoryGame.tsx`, khai báo thêm loại game trong `src/types/game.ts` và import vào `src/App.tsx`. |
| **Tùy chỉnh danh sách câu hỏi / game mẫu mặc định** | `src/data/defaultGames.ts` | Sửa mảng `DEFAULT_GAMES` (thêm câu đố về Hải Phòng, quê hương Dương Kinh, bài học hai anh em chuột đồng). |
| **Sửa giao diện Studio tạo game (Game Editor)** | `src/components/editor/GameEditor.tsx` | Nơi chứa form nhập liệu, công cụ tải ảnh, chọn tỉ lệ khung hình 16:9, thêm bớt câu hỏi. |
| **Sửa hiệu ứng âm thanh & giọng đọc tiếng Việt** | `src/utils/audio.ts` | Sử dụng Web Audio API tổng hợp âm thanh (ting ting, vỗ tay, chuông báo, nốt nhạc) và Web Speech API cho giọng đọc. |
| **Quản trị cơ sở dữ liệu, sao lưu / nạp JSON** | `src/utils/storage.ts` | Quản lý việc đọc/ghi dữ liệu, nén ảnh Base64 tự động, xuất tệp `.json` tải về máy. |
| **Đổi màu sắc, giao diện chung, phông chữ** | `src/index.css` & `src/App.tsx` | Thiết lập màu nền, phông chữ thiếu nhi (Quicksand & Plus Jakarta Sans), hiệu ứng chuyển động. |

---

## 3. CẤU TRÚC THƯ MỤC CHI TIẾT

```text
├── index.html                       # Trang HTML chính, nạp Google Fonts & meta tags
├── metadata.json                    # Khai báo thông tin ứng dụng AI Studio
├── package.json                     # Quản lý thư viện phụ thuộc (React, Tailwind, Motion, Canvas-Confetti)
├── KIEN_TRUC_HE_THONG.md            # Tài liệu kiến trúc tóm tắt (tệp này)
├── HUONG_DAN_SU_DUNG.md             # Hướng dẫn chi tiết tùy chỉnh ảnh 16:9 & CSDL
├── src/
│   ├── types/
│   │   └── game.ts                  # Khai báo kiểu TypeScript (Game, AspectRatio, MatchPair, QuizQuestion)
│   ├── data/
│   │   └── defaultGames.ts          # Bộ dữ liệu mẫu có sẵn (4 game học tập)
│   ├── utils/
│   │   ├── audio.ts                 # Bộ phát âm thanh Web Audio & Đọc tiếng Việt Web Speech
│   │   └── storage.ts               # Quản lý LocalStorage & Nhập/Xuất tệp JSON
│   ├── components/
│   │   ├── Header.tsx               # Thanh điều hướng trên cùng (Top Bar Contract)
│   │   ├── GameCard.tsx             # Thẻ hiển thị từng trò chơi trong thư viện
│   │   ├── games/
│   │   │   ├── MatchingGame.tsx     # Trò chơi Nối Ý (Tùy biến tỉ lệ ảnh 16:9 ngang chuẩn)
│   │   │   ├── MemoryGame.tsx       # Trò chơi Lật Thẻ Bí Mật
│   │   │   ├── WheelGame.tsx        # Trò chơi Vòng Quay Lớp Học (Gọi tên học sinh)
│   │   │   └── QuizGame.tsx         # Trò chơi Chuyến Tàu Tri Thức (Đố vui trắc nghiệm)
│   │   ├── editor/
│   │   │   └── GameEditor.tsx       # Bộ công cụ cho thầy cô & học sinh tự thiết kế trò chơi
│   │   └── docs/
│   │       └── SystemDocs.tsx       # Trình đọc tài liệu tương tác tích hợp ngay trên web
│   ├── App.tsx                      # Component điều phối chính toàn bộ ứng dụng
│   ├── main.tsx                     # Điểm khởi chạy React DOM
│   └── index.css                    # Tailwind CSS và cấu hình kiểu dáng
```

---

## 4. QUY TRÌNH THÊM MỘT TRÒ CHƠI MỚI (VÍ DỤ: TRÒ KÉO CO / QUIZ MỚI)

Để thêm một dạng trò chơi mới trong tương lai, bạn chỉ cần thực hiện 3 bước đơn giản:

### Bước 1: Khai báo GameType trong `src/types/game.ts`
```typescript
export type GameType = 'matching' | 'memory' | 'wheel' | 'quiz' | 'tugofwar';
```

### Bước 2: Tạo Component trò chơi mới trong `src/components/games/TugOfWarGame.tsx`
Nhận các thuộc tính:
```typescript
interface TugOfWarGameProps {
  game: Game;
  onBack: () => void;
  onEditGame?: () => void;
}
export const TugOfWarGame: React.FC<TugOfWarGameProps> = ({ game, onBack }) => {
  // Logic trò chơi kéo co
  return <div>...</div>;
};
```

### Bước 3: Đăng ký hiển thị trong `src/App.tsx`
Thêm nhánh rẽ khi chơi:
```tsx
{selectedGame.type === 'tugofwar' && (
  <TugOfWarGame game={selectedGame} onBack={() => setActiveView('library')} />
)}
```

---

## 5. TƯƠNG TÁC ÂM THANH & TRỢ LÝ HỌC TẬP

- **Web Audio API:** Tạo trực tiếp các tần số nốt nhạc (sine, triangle, square) không dùng tệp MP3 ngoài. Ưu điểm: Không bao giờ bị lỗi 404, không tốn băng thông, phản hồi tức thì dưới 10ms khi học sinh bấm chạm.
- **Web Speech API:** Hàm `sound.speakVietnamese(text)` đọc chính xác phát âm tiếng Việt câu hỏi và đáp án cho học sinh lớp 1, lớp 2 chưa đọc thông thạo.
