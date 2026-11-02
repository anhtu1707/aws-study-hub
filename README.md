# AWS Services Mastery Hub (Torn Paper Style)

[![Live Web](https://img.shields.io/badge/Live%20Web-Vercel-black?style=for-the-badge&logo=vercel)](https://aws-study-hub-beige.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-anhtu1707%2Faws--study--hub-181717?style=for-the-badge&logo=github)](https://github.com/anhtu1707/aws-study-hub)
[![Node](https://img.shields.io/badge/Node-20%2B-green?style=for-the-badge)](https://nodejs.org/)

Ứng dụng sổ tay tra cứu & ôn luyện toàn diện hơn **200+ dịch vụ AWS**, **60 mẫu kiến trúc doanh nghiệp** và **110 câu trắc nghiệm chuẩn đề thi thật** theo phong cách **Giấy xé thủ công (Torn Paper Craft)** với mực in đậm nét, độ tương phản cao, tối giản và dịu mắt.

-  **Live Demo:** [https://aws-study-hub-beige.vercel.app/](https://aws-study-hub-beige.vercel.app/)
-  **GitHub Repository:** [https://github.com/anhtu1707/aws-study-hub](https://github.com/anhtu1707/aws-study-hub)

---

## 🚀 Tính Năng Chính

- **Kho 200+ Dịch Vụ AWS:** Phân loại theo 15 phân hệ (Compute, Storage, Database, Network, Security, AI/ML, Analytics, FinOps, IoT, Media...).
- **Hồ Sơ Giải Mã Kỹ Thuật (Dossier):**
  - Bản chất kiến trúc & khi nào nên chọn.
  - **Mẹo thi sát đề & Cạm bẫy câu hỏi**: Từ khóa nhận diện trong 3 giây và cách loại trừ đáp án nhiễu.
  - **Cạm bẫy chi phí (FinOps Gotchas)**: Chi phí ngầm, bẫy Free Tier và chiến thuật tối ưu hóa ngân sách.
  - Hướng dẫn thực hành từng bước trên cả **AWS Console (GUI)** lẫn **AWS CLI (Terminal)**.
- **Phòng Lab Docker Cục Bộ (Thực Hành Miễn Phí):**
  - Chạy giả lập AWS Core, DynamoDB, MinIO, Redis, MSK Kafka, OpenSearch bằng LocalStack qua Docker tại máy nhà mà không tốn phí tài khoản thật:
    - Trên Windows: `.\lab.ps1 start core` (hoặc `dynamodb`, `s3`, `rds`, `all`)
    - Trên Linux / Mac: `./lab.sh start core`
    - Lệnh Docker gốc: `docker compose --profile core up -d`
- **Kho 60 Mẫu Kiến Trúc Doanh Nghiệp (Enterprise Blueprints):**
  - 10 phân nhánh Well-Architected kinh điển: Serverless Web, EKS Graviton Mesh, GenAI Bedrock RAG, Streaming Lakehouse Iceberg/Flink, Zero Trust, Hub-and-Spoke Transit Gateway, Multi-Region Active-Active DR, v.v. Có tìm kiếm tức thì.
- **Luyện Phản Xạ Đề Thi (110 Câu Hỏi Thực Tế):**
  - Mô phỏng đề thi SAA-C03, SAP-C02, SCS-C02, ANS-C01, DEA-C01, DBS-C01, MLS-C01, DVA-C02.
  - Chế độ **Thi thử ABCD** (phân tích bẫy từng đáp án), **Lật thẻ Flashcard** và **Ôn riêng câu sai**.
  - Bảng điểm dự đoán Pass/Fail chuẩn thang 1000 của AWS.
- **Giọng Đọc Google Neural Audio HD:**
  - Nghe audio đọc hồ sơ dịch vụ, câu hỏi trắc nghiệm và mẫu kiến trúc bằng tiếng Việt tự nhiên khi rảnh tay.
- **Tiến Độ Cá Nhân:** Tự động lưu tiến độ vào `LocalStorage`, hỗ trợ **Sao lưu (JSON)** và **Khôi phục (JSON)**.

---

## 🛠️ Cài Đặt & Chạy Cục Bộ

Yêu cầu: Node.js 18+

```bash
# 1. Clone repository về máy
git clone https://github.com/anhtu1707/aws-study-hub.git
cd aws-study-hub

# 2. Cài đặt thư viện
npm install

# 3. Khởi chạy môi trường phát triển (Dev)
npm run dev
# Truy cập: http://localhost:3000

# 4. Biên dịch phiên bản tĩnh để xuất xưởng
npm run build
# Thư mục xuất ra: dist/
```

---

## 🐳 Hướng Dẫn Chạy Lab Docker LocalStack

```bash
# Windows (PowerShell):
.\lab.ps1 start core     # Bật S3, SQS, SNS, Lambda, Secrets Manager
.\lab.ps1 stop           # Tắt và giải phóng RAM

# Linux / macOS (Bash):
./lab.sh start core
./lab.sh stop

# Hoặc dùng Docker Compose trực tiếp:
docker compose --profile core up -d
docker compose --profile core down
```

---

## 📜 Giấy Phép

Mã nguồn mở phục vụ mục đích học tập và chia sẻ kiến thức cộng đồng Cloud & DevOps.
