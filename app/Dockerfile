# Stage 1: Build ứng dụng
FROM node:20-alpine AS builder

WORKDIR /app

# Copy các file quản lý dependency (hỗ trợ cả npm và bun)
COPY package.json package-lock.json* bun.lock* ./

# Cài đặt dependency (ưu tiên npm ci để build production ổn định)
RUN npm ci

# Copy toàn bộ mã nguồn vào container
COPY . .

# Chạy lệnh build của Vite (sẽ sinh ra thư mục /dist)
RUN npm run build

# Stage 2: Phục vụ file tĩnh bằng Nginx
FROM nginx:alpine

# Cấu hình Nginx để hỗ trợ Client-side Routing (React Router)
# Chuyển hướng mọi request không tìm thấy file vật lý về index.html
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Xóa nội dung mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy thư mục dist từ Stage 1 sang thư mục root của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
