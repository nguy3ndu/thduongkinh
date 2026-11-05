# HƯỚNG DẪN CHI TIẾT: TÙY CHỈNH HÌNH ẢNH (16:9) & QUẢN TRỊ CƠ SỞ DỮ LIỆU
*Dành cho Giáo viên & Học sinh Trường Tiểu học Dương Kinh*

---

## PHẦN 1: HƯỚNG DẪN TÙY CHỈNH HÌNH ẢNH (ĐẶC BIỆT TỈ LỆ 16:9)

### 1. Vấn Đề Của Trang Web Tham Khảo & Cách Khắc Phục
- **Trang web cũ (Giaoviensangtao):** Ép buộc hình ảnh phải nằm trong khung chữ nhật đứng (tỉ lệ 3:4 hoặc 9:16). Khi đưa ảnh phong cảnh cánh đồng lúa, ảnh trường học hay ảnh vũ trụ vào, hai bên trái phải bị cắt xén (crop) nghiêm trọng, ảnh bị thu hẹp lại khiến các em học sinh rất khó nhìn.
- **Giải pháp của Dương Kinh EdGames:**
  - Hỗ trợ **chuẩn màn ảnh rộng 16:9** (Widescreen): Đây là tỉ lệ vàng của màn hình vi tính, tivi thông minh trong lớp học và máy chiếu.
  - Cho phép chọn tỉ lệ linh hoạt: **16:9**, **4:3**, **1:1** (vuông) hoặc **Dọc** tùy theo ý thích của giáo viên khi tạo trò chơi.
  - Tích hợp nút chuyển đổi nhanh tỉ lệ ngay trên thanh điều khiển của trò chơi để thầy cô kiểm tra trực tiếp.

---

### 2. Thông Số Kỹ Thuật Hình Ảnh Khuyên Dùng

| Tiêu chí | Khuyến nghị tối ưu cho học sinh | Ghi chú |
| :--- | :--- | :--- |
| **Tỉ lệ khung hình (Aspect Ratio)** | **16:9** (Rộng 16 phần, Cao 9 phần) | Hiển thị trọn vẹn phong cảnh, tranh vẽ |
| **Kích thước độ phân giải (Pixels)** | **1280 x 720 px** (HD) hoặc **1920 x 1080 px** (Full HD) | Sắc nét trên màn hình tivi lớn của lớp |
| **Định dạng tệp** | `.jpg`, `.jpeg`, `.png`, hoặc `.webp` | WebP và JPEG tải nhanh nhất |
| **Dung lượng tệp (File size)** | Từ **150 KB đến 500 KB** / 1 ảnh | Đảm bảo game mở lên ngay không cần chờ |

---

### 3. Quy Trình Chuẩn Bị & Chèn Ảnh Vào Game

#### Cách 1: Tải ảnh trực tiếp từ máy tính (Khuyên dùng)
1. Trong màn hình **Tạo Game Mới** hoặc **Sửa Game**, tìm đến mục đối tượng cần thêm ảnh.
2. Nhấn nút **"Tải ảnh 16:9"** (hoặc biểu tượng tải lên).
3. Chọn tệp ảnh từ máy tính của bạn.
4. Hệ thống đã tích hợp sẵn bộ nén tự động `compressAndConvertImage()` trong `src/utils/storage.ts`: Ảnh sẽ được tự động tối ưu hóa kích thước xuống tối đa 1280px để giữ cho hệ thống chạy siêu mượt.

#### Cách 2: Sử dụng Thư viện Ảnh Mẫu Chuẩn 16:9 Có Sẵn
Hệ thống đã chuẩn bị sẵn 4 bức tranh 16:9 vẽ theo phong cách tranh truyện thiếu nhi sinh động:
1. `PRESET_IMAGES.countryside16x9`: Phong cảnh đồng quê Việt Nam (lúa chín vàng, ao sen, làng xóm).
2. `PRESET_IMAGES.city16x9`: Thành phố hiện đại (trường học sinh thái, đường phố, tàu điện trên cao).
3. `PRESET_IMAGES.forest16x9`: Rừng xanh kỳ thú (muông thú thân thiện, suối trong).
4. `PRESET_IMAGES.solarSystem16x9`: Hệ Mặt Trời và vũ trụ bao la.

---

## PHẦN 2: HƯỚNG DẪN QUẢN TRỊ CƠ SỞ DỮ LIỆU

### 1. Kiến Trúc Lưu Trữ Dữ Liệu Hiện Tại (Offline-First)
- Toàn bộ danh sách trò chơi, câu hỏi, cặp nối ý được lưu trữ an toàn trong **LocalStorage** của trình duyệt (`hoanghia_edgames_library_v1`).
- **Ưu điểm vượt trội:**
  - Không cần máy chủ internet vẫn chơi được ngay cả khi trường mất mạng.
  - Tốc độ tải dữ liệu là 0 mili-giây (tức thì).
  - Không lo chi phí duy trì máy chủ ban đầu.

---

### 2. Quy Trình Sao Lưu & Chuyển Dữ Liệu Giữa Các Máy Tính

#### A. Cách Xuất (Export) Bản Sao Lưu
1. Trên thanh điều hướng trên cùng, bấm nút **"Sao Lưu"** (biểu tượng tải xuống).
2. Trình duyệt sẽ tự động tải về tệp tin có tên dạng: `hoanghia_edgames_backup_2026-11-05.json`.
3. Giáo viên có thể gửi tệp JSON này qua Zalo, Google Drive hoặc sao chép vào USB.

#### B. Cách Nạp (Import) Dữ Liệu Vào Máy Tính Khác
1. Mở trang web trên máy tính phòng học hoặc máy tính của học sinh.
2. Bấm nút **"Nạp Tệp"** trên thanh điều hướng.
3. Chọn tệp `.json` đã sao lưu.
4. Hệ thống sẽ kiểm tra tính hợp lệ và cập nhật toàn bộ kho game ngay lập tức!

#### C. Cách Khôi Phục Dữ Liệu Gốc (Reset)
- Nếu lỡ xóa hoặc sửa nhầm, bấm nút **"Khôi phục mẫu"** (biểu tượng đồng bộ) ở danh mục kho game để lấy lại các bài học mẫu chuẩn ban đầu.

---

### 3. Cấu Trúc Dữ Liệu JSON (Data Schema)

Thầy cô và các em học sinh có thể mở tệp `.json` bằng Notepad hoặc VS Code để xem và chỉnh sửa trực tiếp:

```json
[
  {
    "id": "game-matching-noi-y",
    "title": "Nơi Ở Của Hai Anh Em",
    "type": "matching",
    "aspectRatio": "16:9",
    "gradeLevel": "Lớp 3",
    "subject": "Tiếng Việt & Tự nhiên",
    "thumbnail": "/src/assets/images/edu_countryside_habitat_....jpg",
    "instruction": "Hãy chọn hoặc kéo đối tượng vào đúng bức tranh 16:9 nhé!",
    "matchPairs": [
      {
        "id": "p1",
        "leftText": "Chuột Đồng",
        "leftImage": "data:image/svg+xml;...",
        "rightText": "Làng Quê Thanh Bình",
        "rightImage": "/src/assets/images/edu_countryside_habitat_....jpg",
        "hint": "Chính xác! Chuột đồng sống ở nông thôn."
      }
    ]
  }
]
```

---

### 4. Hướng Dẫn Nâng Cấp Lên Cơ Sở Dữ Liệu Đám Mây (Cloud Database)

Khi nhà trường muốn toàn bộ học sinh tại các lớp học đồng bộ tài khoản và bảng xếp hạng trực tuyến:
1. **Dùng Firebase Firestore:**
   - Mở tệp `src/utils/storage.ts`.
   - Kết nối `firebase/firestore`.
   - Lưu trữ bộ sưu tập `collection(db, "games")`.
2. **Dùng PostgreSQL / Cloud SQL:**
   - Tạo bảng `games (id VARCHAR PRIMARY KEY, data JSONB)`.
   - Tạo API route `/api/games` trong Express server.
   - Hàm `storage.getGames()` chuyển sang gọi `fetch('/api/games')`.

Mọi thành phần giao diện (UI) và logic trò chơi đã được tách bạch hoàn toàn, không cần thay đổi khi đổi cơ sở dữ liệu!
