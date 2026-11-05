<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Dương Kinh EdGames

Trang tạo và chơi trò chơi giáo dục dành cho học sinh và giáo viên Tiểu học Dương Kinh.

## Triển khai lên GitHub Pages

1. Tạo repository trên GitHub và đẩy nhánh `main`.
2. Mở **Settings > Pages**, chọn **Source: GitHub Actions**.
3. GitHub Actions sẽ tự chạy workflow `.github/workflows/deploy.yml` và xuất bản thư mục `dist`.
4. Sau mỗi lần đẩy code mới lên nhánh `main`, Vite tạo tên file asset mới có mã hash để trình duyệt không dùng bản cũ.

Không cần khai báo API key để chạy ứng dụng này.

## Dữ liệu và bộ nhớ trình duyệt

- Dữ liệu trò chơi được lưu trong LocalStorage và không bị xóa tự động khi đóng trình duyệt.
- Khi rời trang, ứng dụng xóa Cache Storage, đăng ký Service Worker cũ và dữ liệu SessionStorage.
- Khi deploy, Vite tạo tên asset có mã hash để tránh tải nhầm JavaScript/CSS cũ.

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c9fdf877-899e-429a-bf76-8f04a542f87c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
