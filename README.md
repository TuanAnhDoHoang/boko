# Boko - Docker Compose Setup

Hướng dẫn chạy dự án Boko bằng Docker Compose từ thư mục gốc.

## Yêu cầu

- Docker
- Docker Compose
- Git

## Cấu trúc dự án

- `app/`: frontend React + Vite
- `server/`: backend Go Gin API
- `docker-compose.yml`: file compose gốc kết nối app + backend + database

## Bước 1: Clone dự án

```bash
git clone <repo-url>
cd boko
```

## Bước 2: Khởi động tất cả service

Từ thư mục gốc của dự án, chạy:

```bash
docker compose up --build
```

Lệnh này sẽ build và chạy:

- PostgreSQL database trên cổng `5432`
- Backend Go trên cổng `8080`
- Frontend React trên cổng `3000`

## Bước 3: Kiểm tra trạng thái

```bash
docker compose ps
```

Bạn nên thấy các container sau đang chạy:

- `boko-db`
- `boko-backend`
- `boko_frontend`

## Truy cập ứng dụng

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Database PostgreSQL: localhost:5432

## Dừng hệ thống

```bash
docker compose down
```

Nếu muốn xoá luôn volume dữ liệu database:

```bash
docker compose down -v
```

## Khắc phục nhanh

### Nếu backend chưa bắt đầu đúng

```bash
docker compose logs -f backend
```

### Nếu frontend chưa cập nhật

```bash
docker compose rebuild app
```

### Nếu muốn chạy lại từ đầu

```bash
docker compose down -v
docker compose up --build
```

## Môi trường

Các biến môi trường cho backend nằm trong:

- `server/.env`

Nếu file `.env` chưa tồn tại, copy từ:

```bash
cp server/.env.example server/.env
```

## Ghi chú

- Dự án có cấu hình root compose ở thư mục gốc, nên không cần chạy từng service riêng lẻ.
- Nếu đang chạy local frontend khác trên cổng 3000, hãy dừng tiến trình đó trước khi dùng Docker.
