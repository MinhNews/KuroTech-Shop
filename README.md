# 🛒 KuroTech - E-Commerce Platform with AI Assistant

![KuroTech Banner](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge) 
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)

KuroTech là một nền tảng thương mại điện tử chuyên cung cấp đồ công nghệ (Laptop, Điện thoại, Phụ kiện) với giao diện người dùng hiện đại, tốc độ cao và đặc biệt là được tích hợp **Trợ lý ảo AI thông minh** (sử dụng sức mạnh của Google Gemini 2.5 Flash).

## 🌐 Trải nghiệm Live (Đã Deploy)

- **Frontend (Website):** [https://kurotech.vercel.app](https://kurotech.vercel.app)
- **Backend API:** Host trên Render (Tự động sleep sau 15p không hoạt động)
## ✨ Tính năng nổi bật

### 🛍️ Dành cho Khách hàng (Client)
- **Giao diện hiện đại & Responsive:** Tối ưu hóa cho cả PC và thiết bị di động (sử dụng Tailwind CSS).
- **Trợ lý ảo AI (Chatbot):** Khách hàng có thể chat trực tiếp với AI để nhờ tư vấn sản phẩm. AI được **ghi nhớ ngữ cảnh** trò chuyện và có thể đọc trực tiếp dữ liệu tồn kho, giá cả từ Database, trả về danh sách sản phẩm trực quan dạng Card.
- **Tìm kiếm & Lọc sản phẩm:** Tìm kiếm thông minh theo tên, danh mục.
- **Giỏ hàng & Thanh toán:** Thêm nhanh vào giỏ hàng mà không cần chuyển trang (sử dụng Zustand quản lý State toàn cục).
- **Hệ thống Thông báo (Notification):** Cập nhật trạng thái đơn hàng thời gian thực qua chuông thông báo.
- **Quản lý Tài khoản:** Đăng nhập an toàn bằng Google, Đăng ký, Đăng nhập cơ bản, Quên mật khẩu, Theo dõi lịch sử đơn hàng.

### 🛡️ Dành cho Quản trị viên (Admin)
- **Dashboard Thống kê:** Tổng quan doanh thu, số lượng đơn hàng.
- **Quản lý Sản phẩm & Danh mục:** Thêm, sửa, xóa, tải lên hình ảnh sản phẩm.
- **Quản lý Đơn hàng:** Cập nhật trạng thái đơn hàng từ lúc đặt đến lúc giao.
- **Quản lý Người dùng & Coupon:** Phân quyền người dùng, tạo mã giảm giá.
- **Quản lý Đánh giá (Review):** Theo dõi, xóa và trực tiếp phản hồi lại bình luận của Khách hàng ngay trong Dashboard.

## 🛠️ Công nghệ sử dụng

- **Frontend:**
  - React.js (Vite)
  - Tailwind CSS (Styling)
  - Zustand (State Management)
  - React Router DOM (Routing)
  - Axios (Data fetching)

- **Backend:**
  - Node.js & Express.js
  - MongoDB & Mongoose
  - JSON Web Token (JWT) & bcrypt (Authentication)
  - Google GenAI SDK (Chatbot AI)

## 🚀 Hướng dẫn cài đặt & Chạy cục bộ

1. **Clone repository:**
```bash
git clone https://github.com/MinhNews/KuroTech-Shop.git
cd KuroTech-Shop
```

2. **Cài đặt thư viện & Cấu hình môi trường:**
- **Backend:**
  ```bash
  cd ecommerce-backend
  npm install
  ```
  Tạo file `.env` và điền thông tin kết nối DB, JWT Secret, và `GEMINI_API_KEY`.
- **Frontend:**
  ```bash
  cd ../ecommerce-frontend
  npm install
  ```
  Tạo file `.env` nếu cần thiết (ví dụ cấu hình Google Client ID cho đăng nhập).

3. **Chạy dự án:**
Mở 2 terminal riêng biệt:
- **Terminal 1 (Backend):**
  ```bash
  cd ecommerce-backend
  npm run dev
  ```
- **Terminal 2 (Frontend):**
  ```bash
  cd ecommerce-frontend
  npm run dev
  ```
Sau đó truy cập `http://localhost:5174` để trải nghiệm.

---
*Dự án được xây dựng và phát triển với ❤️.*
