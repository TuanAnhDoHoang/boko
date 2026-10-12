package main

import (
	"encoding/hex"
	"log"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"

	"boko/config"
	"boko/middleware"
	"boko/models"
	pmiddleware "boko/payments/middleware"
	"boko/routes"
)

func main() {
	// Đọc biến môi trường từ server/.env khi chạy local dev
	if err := godotenv.Load(); err != nil {
		// Không fatal nếu file .env không tồn tại ở môi trường khác
		_ = err
	}

	// Kiểm tra tính hợp lệ của JWT_SECRET (bắt buộc tối thiểu 32 byte CSPRNG dạng hex)
	secretHex := strings.TrimSpace(os.Getenv("JWT_SECRET"))
	rawBytes, err := hex.DecodeString(secretHex)
	if err != nil || len(rawBytes) < 32 {
		log.Fatalf("FATAL ERROR: JWT_SECRET chưa được cấu hình hoặc không hợp lệ! Bắt buộc phải là chuỗi Hex tối thiểu 32 byte (64 ký tự hex) sinh từ CSPRNG. Dừng backend.")
	}
	middleware.JwtSecret = rawBytes

	// Kết nối database
	config.ConnectDatabase()

	// Tự động tạo bảng
	config.DB.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Book{},
		&models.Cart{},
		&models.Order{},
		&models.OrderItem{},
		&models.Review{},
		&models.Coupon{},
	)

	// Tạo router Gin
	r := gin.Default()
	r.Use(pmiddleware.NewRedactingLogger())
	r.Use(pmiddleware.RateLimitMiddleware(120, 1*time.Minute, func(c *gin.Context) string {
		return c.ClientIP()
	}))

	// CORS — cho phép React frontend (localhost:3000)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://127.0.0.1:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Đăng ký routes
	routes.SetupRoutes(r)

	// Seed dữ liệu mẫu
	seedData()

	// Chạy server
	r.Run(":8080")
}

// seedData — tạo dữ liệu mẫu nếu database trống
func seedData() {
	// Tạo admin nếu chưa có
	var count int64
	config.DB.Model(&models.User{}).Where("role = ?", "admin").Count(&count)
	if count == 0 {
		hashed, _ := bcrypt.GenerateFromPassword([]byte("admin123456"), bcrypt.DefaultCost)
		config.DB.Create(&models.User{
			Email:    "admin@boko.com",
			Password: string(hashed), // hash đúng của "admin123456"
			Name:     "Admin Boko",
			Role:     "admin",
		})
	}

	// Tạo tài khoản thử nghiệm khách hàng test@gmail.com nếu chưa có
	var testCount int64
	config.DB.Model(&models.User{}).Where("email = ?", "test@gmail.com").Count(&testCount)
	if testCount == 0 {
		hashed, _ := bcrypt.GenerateFromPassword([]byte("testpass"), bcrypt.DefaultCost)
		config.DB.Create(&models.User{
			Email:    "test@gmail.com",
			Password: string(hashed),
			Name:     "test_user",
			Role:     "customer",
		})
	}

	// Tạo danh mục mẫu cùng tên với UI frontend để đồng bộ giữa backend và frontend
	categories := []models.Category{
		{Name: "Mystery", Description: "Sách trinh thám, bí ẩn, khám phá"},
		{Name: "Literature", Description: "Tiểu thuyết, truyện ngắn, thơ"},
		{Name: "History", Description: "Sách lịch sử, chính trị, văn hóa"},
		{Name: "Science", Description: "Sách khoa học, công nghệ, xã hội"},
		{Name: "Art", Description: "Sách nghệ thuật, hội họa, thiết kế"},
	}
	for _, c := range categories {
		var existing models.Category
		if err := config.DB.Where("name = ?", c.Name).First(&existing).Error; err != nil {
			config.DB.Create(&c)
		}
	}

	// Tạo sách mẫu tương ứng từng danh mục UI
	var admin models.User
	if err := config.DB.Where("role = ?", "admin").First(&admin).Error; err == nil {
		var catTrinhTham, catVanHoc, catLichSu, catKhoaHoc, catNgheThuat models.Category
		config.DB.Where("name = ?", "Mystery").First(&catTrinhTham)
		config.DB.Where("name = ?", "Literature").First(&catVanHoc)
		config.DB.Where("name = ?", "History").First(&catLichSu)
		config.DB.Where("name = ?", "Science").First(&catKhoaHoc)
		config.DB.Where("name = ?", "Art").First(&catNgheThuat)

		sampleBooks := []models.Book{
			{Title: "The Hound of the Baskervilles", Author: "Arthur Conan Doyle", Description: "Tiểu thuyết trinh thám kinh điển", Price: 250000, Stock: 50, CategoryID: &catTrinhTham.ID, UserID: admin.ID},
			{Title: "Nhà Giả Kim", Author: "Paulo Coelho", Description: "Hành trình theo đuổi giấc mơ", Price: 79000, Stock: 200, CategoryID: &catVanHoc.ID, UserID: admin.ID},
			{Title: "Lịch Sử Việt Nam", Author: "TS. Lê Văn Hồng", Description: "Khái quát lịch sử Việt Nam qua các triều đại", Price: 89000, Stock: 150, CategoryID: &catLichSu.ID, UserID: admin.ID},
			{Title: "Lập Trình Go Cơ Bản", Author: "Nguyễn Văn A", Description: "Hướng dẫn lập trình Go từ cơ bản đến nâng cao", Price: 150000, Stock: 100, CategoryID: &catKhoaHoc.ID, UserID: admin.ID},
			{Title: "Câu Chuyện Nghệ Thuật", Author: "E.H. Gombrich", Description: "Hành trình khám phá mỹ thuật và hình thành văn hóa", Price: 180000, Stock: 80, CategoryID: &catNgheThuat.ID, UserID: admin.ID},
		}
		for _, b := range sampleBooks {
			var existing models.Book
			if err := config.DB.Where("title = ?", b.Title).First(&existing).Error; err != nil {
				config.DB.Create(&b)
			}
		}
	}
}
