# AWS Services Mastery Hub (Torn Paper Style)

Ứng dụng sổ tay tra cứu & ôn luyện toàn diện các dịch vụ AWS theo phong cách **Giấy xé thủ công (Torn Paper Craft)** với tông màu nâu sáng cực sáng (`#FAF7F2`), tương phản cao bằng mực đen (`#141210`) và giấy trắng (`#FFFFFF`).

---

## 🚀 Tính Năng Chính

- **Kho 80+ Dịch Vụ AWS:** Phân loại theo 12 phân hệ chuẩn AWS (Compute, Storage, Database, Network, Security, GenAI, DevOps...).
- **Hồ Sơ Giải Mã Kỹ Thuật (Dossier):**
  - Bản chất dịch vụ & khi nào nên chọn.
  - Mẹo thi thực chiến (*Exam Tips*) & Cạm bẫy chi phí (*Pricing Gotchas*).
  - Lệnh AWS CLI mẫu với nút sao chép nhanh 1 chạm.
  - Ghi chú cá nhân tự động lưu vào trình duyệt.
- **Bộ Lọc Đa Chiều:** Tìm kiếm tức thì, lọc theo phân hệ, chứng chỉ (CLF, SAA, DVA, SOA, SAP) và Free Tier.
- **Chế Độ Flashcards:** Luyện phản xạ giải quyết bài toán thực tế đề thi SAA-C03 & SAP-C02.
- **Mẫu Kiến Trúc Chuẩn (Well-Architected):** Serverless Web, Resilient 3-Tier Multi-AZ, Fan-out EDA, Enterprise GenAI RAG.
- **Tiến Độ Cá Nhân:** Tự động lưu tiến độ vào `LocalStorage`, hỗ trợ **Sao lưu (JSON)** và **Khôi phục (JSON)**.

---

## 🛠️ Cài Đặt & Chạy Cục Bộ

Yêu cầu: Node.js 18+

```bash
# 1. Cài đặt thư viện
npm install

# 2. Khởi chạy môi trường phát triển (Dev)
npm run dev
# Truy cập: http://localhost:3000

# 3. Biên dịch phiên bản tĩnh để xuất xưởng
npm run build
# Thư mục xuất ra: dist/
```

---

## ☁️ Hướng Dẫn Triển Khai Lên AWS (S3 + CloudFront)

1. Tạo một S3 Bucket (ví dụ `my-aws-study-hub`) và bật chế độ Static Website Hosting.
2. Build dự án: `npm run build`
3. Đồng bộ thư mục `dist/` lên S3:
   ```bash
   aws s3 sync ./dist s3://my-aws-study-hub --delete
   ```
4. (Tùy chọn) Tạo CloudFront Distribution trỏ Origin vào S3 Bucket để có chứng chỉ SSL HTTPS miễn phí và CDN toàn cầu.

---

## 📂 Cấu Trúc Mã Nguồn

```
├── design/                 # Bản thiết kế canvas tương tác (/claude-design)
├── dist/                   # File build tĩnh sẵn sàng deploy
├── src/
│   ├── index.css           # Toàn bộ CSS mép giấy xé, washi tape, stamps
│   ├── data/
│   │   └── services.ts     # Dữ liệu 80+ AWS services, flashcards & patterns
│   ├── components/
│   │   ├── Header.tsx      # Thanh tiêu đề, thanh tiến độ, backup/restore
│   │   ├── FilterBar.tsx   # Bộ lọc tìm kiếm, phân hệ, level thi
│   │   ├── ServiceCard.tsx # Thẻ dịch vụ giấy xé với nút toggle học tập
│   │   ├── ServiceDetailModal.tsx # Hồ sơ giải mã, CLI, ghi chú cá nhân
│   │   ├── QuizView.tsx    # Chế độ luyện đề Flashcards
│   │   └── ArchitectureView.tsx # Mẫu kiến trúc kinh điển
│   ├── types/              # TypeScript interfaces
│   ├── App.tsx             # Điều phối trạng thái chính
│   └── main.tsx            # Điểm khởi chạy React
```
