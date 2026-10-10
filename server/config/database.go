package config

import (
	"fmt"
	"log"
	"os"
	"strings"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// ConnectDatabase — khởi tạo kết nối đến PostgreSQL
//
// Thứ tự ưu tiên:
//  1. DATABASE_URL nguyên chuỗi (Neon/Render/Supabase cấp sẵn)
//  2. DB_HOST nếu user paste nhầm full URL vào đó
//  3. Ráp từng biến DB_HOST/DB_PORT/... (Docker/localhost)
func ConnectDatabase() {
	// 1. Ưu tiên DATABASE_URL nguyên chuỗi
	//    Ví dụ: postgresql://neondb_owner:xxx@ep-xxx-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
	dsn := strings.TrimSpace(os.Getenv("DATABASE_URL"))

	// 2. Phòng trường hợp paste nhầm full URL vào DB_HOST
	if dsn == "" {
		host := strings.TrimSpace(os.Getenv("DB_HOST"))
		if strings.HasPrefix(host, "postgres://") || strings.HasPrefix(host, "postgresql://") {
			dsn = host
			log.Println("Cảnh báo: DB_HOST đang chứa full connection URL — dùng luôn làm DSN")
		}
	}

	// 3. Fallback: ráp từ từng biến rời (Docker/local)
	if dsn == "" {
		host := getEnv("DB_HOST", "localhost")
		port := getEnv("DB_PORT", "5432")
		user := getEnv("DB_USER", "postgres")
		password := getEnv("DB_PASSWORD", "123456")
		dbname := getEnv("DB_NAME", "boko_db")
		// Neon/managed DB bắt buộc sslmode=require; local docker dùng disable
		sslmode := getEnv("DB_SSLMODE", "disable")

		dsn = fmt.Sprintf(
			"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
			host, port, user, password, dbname, sslmode,
		)

		// Neon yêu cầu channel_binding=require khi connection string có nó
		if cb := strings.TrimSpace(os.Getenv("DB_CHANNEL_BINDING")); cb != "" {
			dsn += " channel_binding=" + cb
		}
		log.Printf("Kết nối Postgres rời: host=%s port=%s db=%s sslmode=%s", host, port, dbname, sslmode)
	} else {
		log.Println("Kết nối Postgres qua DATABASE_URL (Neon/managed DB)")
	}

	cfg := postgres.New(postgres.Config{
		DSN: dsn,
		// Neon pooler (pgbouncer) không hỗ trợ prepared statement
		// → phải dùng simple protocol, không sẽ lỗi "prepared statement S_1 already exists"
		PreferSimpleProtocol: getEnv("DB_SIMPLE", "false") == "true",
	})

	var err error
	DB, err = gorm.Open(cfg, &gorm.Config{})
	if err != nil {
		panic("Không thể kết nối database: " + err.Error())
	}

	// Giới hạn pool kết nối — Neon free tier chỉ cho ~20 kết nối đồng thời
	sqlDB, err := DB.DB()
	if err == nil {
		sqlDB.SetMaxOpenConns(10)
		sqlDB.SetMaxIdleConns(5)
	}
}

// getEnv — trả về biến môi trường, nếu không có thì dùng fallback
func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
