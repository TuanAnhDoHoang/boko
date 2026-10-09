package controllers

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"boko/config"
	"boko/models"
)

// ==================== ORDER ====================

// CreateOrder — tạo đơn hàng từ giỏ hàng (dùng transaction)
func CreateOrder(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var input struct {
		ShippingAddress string `json:"shipping_address" binding:"required"`
		Phone           string `json:"phone" binding:"required"`
		PaymentMethod   string `json:"payment_method"` // cod | momo
		CouponCode      string `json:"coupon_code"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ: " + err.Error()})
		return
	}

	if input.PaymentMethod == "" {
		input.PaymentMethod = "cod"
	}

	// ===== TRANSACTION =====
	err := config.DB.Transaction(func(tx *gorm.DB) error {
		// 1. Lấy giỏ hàng
		type cartItem struct {
			CartID   uint
			BookID   uint
			Title    string
			Price    float64
			Quantity int
			Stock    int
			SellerID uint
		}

		var cartItems []cartItem
		tx.Table("carts").
			Select("carts.id as cart_id, carts.book_id, books.title, books.price, carts.quantity, books.stock, books.user_id as seller_id").
			Joins("join books on books.id = carts.book_id").
			Where("carts.user_id = ?", userID).
			Scan(&cartItems)

		if len(cartItems) == 0 {
			return errors.New("Giỏ hàng trống")
		}

		// 2. Kiểm tra tồn kho
		var total float64
		for _, item := range cartItems {
			if item.Quantity > item.Stock {
				return errors.New("Sách \"" + item.Title + "\" không đủ tồn kho")
			}
			total += item.Price * float64(item.Quantity)
		}

		// 3. Kiểm tra & áp dụng coupon nếu có
		discountPercent := 0
		if input.CouponCode != "" {
			var coupon models.Coupon
			if result := tx.Where("code = ? AND is_active = ?", input.CouponCode, true).First(&coupon); result.Error != nil {
				return errors.New("Mã giảm giá không hợp lệ")
			}
			if time.Now().After(coupon.ExpiresAt) {
				return errors.New("Mã giảm giá đã hết hạn")
			}
			if coupon.UsedCount >= coupon.MaxUses {
				return errors.New("Mã giảm giá đã hết lượt sử dụng")
			}
			discountPercent = coupon.DiscountPercent

			// Tăng UsedCount
			tx.Model(&coupon).Update("used_count", coupon.UsedCount+1)
		}

		// Tính tổng sau giảm giá
		finalTotal := total * (100 - float64(discountPercent)) / 100

		// 4. Tạo đơn hàng
		order := models.Order{
			UserID:          userID.(uint),
			Total:           finalTotal,
			Status:          "pending",
			ShippingAddress: input.ShippingAddress,
			Phone:           input.Phone,
			PaymentMethod:   input.PaymentMethod,
			CouponCode:      input.CouponCode,
			DiscountPercent: discountPercent,
			CreatedAt:       time.Now(),
		}
		if err := tx.Create(&order).Error; err != nil {
			return err
		}

		// 5. Tạo OrderItem + trừ stock
		for _, item := range cartItems {
			orderItem := models.OrderItem{
				OrderID:  order.ID,
				BookID:   item.BookID,
				Title:    item.Title,
				Price:    item.Price,
				Quantity: item.Quantity,
			}
			if err := tx.Create(&orderItem).Error; err != nil {
				return err
			}

			// Trừ tồn kho
			if err := tx.Model(&models.Book{}).Where("id = ?", item.BookID).
				Update("stock", gorm.Expr("stock - ?", item.Quantity)).Error; err != nil {
				return err
			}
		}

		// 6. Xoá giỏ hàng
		if err := tx.Where("user_id = ?", userID).Delete(&models.Cart{}).Error; err != nil {
			return err
		}

		return nil
	})
	// ===== END TRANSACTION =====

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Lấy đơn vừa tạo
	var order models.Order
	config.DB.Preload("Items").Where("user_id = ?", userID).Order("id desc").First(&order)

	c.JSON(http.StatusCreated, gin.H{
		"message":        "Đặt hàng thành công!",
		"order_id":       order.ID,
		"total":          order.Total,
		"status":         order.Status,
		"payment_method": order.PaymentMethod,
		"payment_status": order.PaymentStatus,
	})
}

// GetMyOrders — lịch sử đơn hàng của user (hỗ trợ cả token auth hoặc theo email query)
func GetMyOrders(c *gin.Context) {
	var orders []models.Order
	query := config.DB.Preload("Items")

	if val, exists := c.Get("user_id"); exists {
		if uid, ok := val.(uint); ok && uid > 0 {
			query = query.Where("user_id = ?", uid)
		}
	} else if email := c.Query("email"); email != "" {
		var user models.User
		if err := config.DB.Where("email = ?", email).First(&user).Error; err == nil {
			query = query.Where("user_id = ?", user.ID)
		} else {
			c.JSON(http.StatusOK, gin.H{"data": []models.Order{}})
			return
		}
	}

	query.Order("created_at DESC").Find(&orders)
	c.JSON(http.StatusOK, gin.H{"data": orders})
}

// CreateCodOrder — Tạo đơn hàng COD trực tiếp từ giỏ hàng checkout
func CreateCodOrder(c *gin.Context) {
	var input struct {
		Amount          float64 `json:"amount"`
		ShippingAddress string  `json:"shipping_address"`
		Phone           string  `json:"phone"`
		Email           string  `json:"email"`
		CustomerName    string  `json:"customer_name"`
		CouponCode      string  `json:"coupon_code"`
		Items           []struct {
			BookID   uint    `json:"book_id"`
			Title    string  `json:"title"`
			Price    float64 `json:"price"`
			Quantity int     `json:"quantity"`
		} `json:"items"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ: " + err.Error()})
		return
	}

	// Xác định user_id: ưu tiên từ JWT token đã xác thực, nếu không có thì liên kết qua email hoặc tài khoản khách
	var currentUserID uint
	if val, exists := c.Get("user_id"); exists {
		if uid, ok := val.(uint); ok {
			currentUserID = uid
		}
	}

	if currentUserID == 0 {
		targetEmail := input.Email
		if targetEmail == "" {
			targetEmail = "guest@boko.com"
		}
		var user models.User
		if err := config.DB.Where("email = ?", targetEmail).First(&user).Error; err != nil {
			name := input.CustomerName
			if name == "" {
				name = "Khách mua hàng"
			}
			user = models.User{
				Email: targetEmail,
				Name:  name,
				Role:  "customer",
			}
			config.DB.Create(&user)
		}
		currentUserID = user.ID
	}

	// Tạo đơn hàng COD
	// Trạng thái đơn: "shipping" (vì 3 bước đầu: Đã đặt đơn, Đã đóng gói, Đang giao hàng đã hoàn thành)
	// Trạng thái thanh toán: "unpaid" (vì nhận hàng mới trả tiền mặt)
	order := models.Order{
		UserID:          currentUserID,
		Total:           input.Amount,
		Status:          "shipping",
		PaymentStatus:   "unpaid",
		PaymentMethod:   "cod",
		ShippingAddress: input.ShippingAddress,
		Phone:           input.Phone,
		CouponCode:      input.CouponCode,
		CreatedAt:       time.Now(),
	}

	if err := config.DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo đơn hàng: " + err.Error()})
		return
	}

	// Tạo OrderItems nếu có
	for _, it := range input.Items {
		orderItem := models.OrderItem{
			OrderID:  order.ID,
			BookID:   it.BookID,
			Title:    it.Title,
			Price:    it.Price,
			Quantity: it.Quantity,
		}
		config.DB.Create(&orderItem)
	}

	// Preload items trả về
	config.DB.Preload("Items").First(&order, order.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message":        "Đặt hàng COD thành công!",
		"order_id":       order.ID,
		"order":          order,
		"total":          order.Total,
		"status":         order.Status,
		"payment_method": order.PaymentMethod,
		"payment_status": order.PaymentStatus,
	})
}

// ConfirmReceiptOrder — Người mua xác nhận đã nhận hàng COD thành công
func ConfirmReceiptOrder(c *gin.Context) {
	orderID := c.Param("id")
	var order models.Order
	if err := config.DB.Preload("Items").First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy đơn hàng"})
		return
	}

	// Cập nhật trạng thái hoàn thành và đã thanh toán
	order.Status = "completed"
	if order.PaymentMethod == "cod" || order.PaymentStatus != "paid" {
		order.PaymentStatus = "paid"
	}
	config.DB.Save(&order)

	c.JSON(http.StatusOK, gin.H{
		"message":        "Xác nhận nhận hàng thành công!",
		"order":          order,
		"status":         order.Status,
		"payment_status": order.PaymentStatus,
	})
}

// GetOrderDetail — chi tiết 1 đơn hàng
func GetOrderDetail(c *gin.Context) {
	userID, _ := c.Get("user_id")
	orderID := c.Param("id")

	var order models.Order
	if result := config.DB.Preload("Items").
		Where("id = ? AND user_id = ?", orderID, userID).
		First(&order); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy đơn hàng"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}

// CancelOrder — huỷ đơn hàng (chỉ khi pending, hoàn lại stock)
func CancelOrder(c *gin.Context) {
	userID, _ := c.Get("user_id")
	orderID := c.Param("id")

	var order models.Order
	if result := config.DB.Where("id = ? AND user_id = ?", orderID, userID).First(&order); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy đơn hàng"})
		return
	}

	if order.Status != "pending" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Chỉ có thể huỷ đơn hàng đang ở trạng thái chờ xử lý"})
		return
	}

	// Transaction: huỷ đơn + hoàn stock
	config.DB.Transaction(func(tx *gorm.DB) error {
		// Hoàn stock
		var items []models.OrderItem
		tx.Where("order_id = ?", order.ID).Find(&items)
		for _, item := range items {
			tx.Model(&models.Book{}).Where("id = ?", item.BookID).
				Update("stock", gorm.Expr("stock + ?", item.Quantity))
		}

		// Cập nhật trạng thái
		tx.Model(&order).Update("status", "cancelled")
		return nil
	})

	c.JSON(http.StatusOK, gin.H{"message": "Đã huỷ đơn hàng!"})
}

// VerifyAtmOtpPayment — Xác thực OTP Thẻ ATM Nội Địa NCB 1-chạm và hoàn tất thanh toán
func VerifyAtmOtpPayment(c *gin.Context) {
	var input struct {
		Amount          float64 `json:"amount"`
		CardNumber      string  `json:"card_number"`
		CardHolder      string  `json:"card_holder"`
		BankName        string  `json:"bank_name"`
		Otp             string  `json:"otp"`
		ShippingAddress string  `json:"shipping_address"`
		Phone           string  `json:"phone"`
		Email           string  `json:"email"`
		CustomerName    string  `json:"customer_name"`
		CouponCode      string  `json:"coupon_code"`
		Items           []struct {
			BookID   uint    `json:"book_id"`
			Title    string  `json:"title"`
			Price    float64 `json:"price"`
			Quantity int     `json:"quantity"`
		} `json:"items"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ: " + err.Error()})
		return
	}

	// 1. Kiểm tra mã OTP: Sandbox test OTP là 123456
	if input.Otp != "123456" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Mã xác thực OTP không chính xác. Vui lòng nhập mã OTP test: 123456",
		})
		return
	}

	// 2. Xác định user_id: ưu tiên từ JWT token đã xác thực, nếu không có thì liên kết qua email hoặc tài khoản khách
	var currentUserID uint
	if val, exists := c.Get("user_id"); exists {
		if uid, ok := val.(uint); ok {
			currentUserID = uid
		}
	}

	if currentUserID == 0 {
		targetEmail := input.Email
		if targetEmail == "" {
			targetEmail = "guest@boko.com"
		}
		var user models.User
		if err := config.DB.Where("email = ?", targetEmail).First(&user).Error; err != nil {
			name := input.CustomerName
			if name == "" {
				name = "Khách mua hàng"
			}
			user = models.User{
				Email: targetEmail,
				Name:  name,
				Role:  "customer",
			}
			config.DB.Create(&user)
		}
		currentUserID = user.ID
	}

	// 3. Tạo mã giao dịch NCB
	transID := fmt.Sprintf("NCB_OTP_%d", time.Now().Unix())

	// 4. Tạo đơn hàng với trạng thái paid
	order := models.Order{
		UserID:          currentUserID,
		Total:           input.Amount,
		Status:          "shipping",
		PaymentStatus:   "paid",
		PaymentMethod:   "atm",
		PaymentTransID:  transID,
		PaymentOrderID:  transID,
		ShippingAddress: input.ShippingAddress,
		Phone:           input.Phone,
		CouponCode:      input.CouponCode,
		CreatedAt:       time.Now(),
	}

	if err := config.DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo đơn hàng: " + err.Error()})
		return
	}

	// 5. Lưu các mặt hàng trong đơn
	for _, it := range input.Items {
		orderItem := models.OrderItem{
			OrderID:  order.ID,
			BookID:   it.BookID,
			Title:    it.Title,
			Price:    it.Price,
			Quantity: it.Quantity,
		}
		config.DB.Create(&orderItem)
	}

	c.JSON(http.StatusOK, gin.H{
		"success":        true,
		"message":        "Xác thực OTP thành công! Đơn hàng đã được thanh toán qua Thẻ ATM NCB.",
		"order_id":       order.ID,
		"transaction_id": transID,
		"total":          order.Total,
		"payment_status": order.PaymentStatus,
		"status":         order.Status,
	})
}