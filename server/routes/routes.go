package routes

import (
	"github.com/gin-gonic/gin"

	"boko/controllers"
	"boko/middleware"
)

func SetupRoutes(r *gin.Engine) {
	// ==================== PUBLIC ROUTES ====================

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Boko API is running! 🚀"})
	})

	// Auth — frontend tương thích
	r.POST("/api/register", controllers.Register)
	r.POST("/api/login", controllers.Login)

	// Frontend gọi /api/auth/* (alias cho tương thích)
	r.POST("/api/auth/login", controllers.Login)
	r.POST("/api/auth/register", controllers.Register)
	r.POST("/api/auth/logout", controllers.Logout)

	// Books (public)
	r.GET("/api/books", controllers.GetBooks)
	r.GET("/api/books/:id", controllers.GetBook)

	// Payment module
	r.POST("/api/payments/intent", controllers.CreatePaymentIntent)
	r.POST("/api/payments/save-card", controllers.SaveCard)
	r.POST("/api/payments/webhook", controllers.HandlePaymentWebhook)

	// Categories (public)
	r.GET("/api/categories", controllers.GetCategories)
	r.GET("/api/categories/:id", controllers.GetCategory)

	// Reviews (public)
	r.GET("/api/books/:id/reviews", controllers.GetBookReviews)

	// Payments Webhook & Status (public cho MoMo Gateway và trang Callback)
	r.POST("/api/payment/momo/ipn", controllers.MomoIPN)
	r.POST("/api/payment/momo/mock-ipn/:id", controllers.MockMomoIPN)
	r.POST("/api/payment/momo/simulator-ipn", controllers.MomoSimulatorIPN)
	r.GET("/api/payment/momo/status/:id", middleware.AuthOptional, controllers.GetPaymentStatus)

	// Payments Create (hỗ trợ cả người dùng đăng nhập và khách)
	r.POST("/api/payment/momo/create", middleware.AuthOptional, controllers.CreateMomoPayment)

	// VNPAY Payment Routes
	r.GET("/api/payment/vnpay/ipn", controllers.VnPayIPN)
	r.GET("/api/payment/vnpay/status/:id", middleware.AuthOptional, controllers.GetVnPayPaymentStatus)
	r.POST("/api/payment/vnpay/create", middleware.AuthOptional, controllers.CreateVnPayPayment)

	// ==================== PROTECTED ROUTES ====================

	auth := r.Group("/api")
	auth.Use(middleware.AuthRequired)
	{
		// Profile — frontend tương thích
		auth.GET("/profile", controllers.GetProfile)
		auth.PUT("/profile", controllers.UpdateProfile)
		auth.GET("/auth/me", controllers.GetProfile)         // alias frontend
		auth.PUT("/auth/profile", controllers.UpdateProfile) // alias frontend

		// Books (seller)
		auth.POST("/books", middleware.SellerRequired, controllers.CreateBook)
		auth.PUT("/books/:id", middleware.SellerRequired, controllers.UpdateBook)
		auth.DELETE("/books/:id", middleware.SellerRequired, controllers.DeleteBook)

		// Categories (admin)
		auth.POST("/categories", middleware.AdminRequired, controllers.CreateCategory)
		auth.PUT("/categories/:id", middleware.AdminRequired, controllers.UpdateCategory)
		auth.DELETE("/categories/:id", middleware.AdminRequired, controllers.DeleteCategory)

		// Cart
		auth.GET("/cart", controllers.GetCart)
		auth.POST("/cart", controllers.AddToCart)
		auth.PUT("/cart/:id", controllers.UpdateCartItem)
		auth.DELETE("/cart/:id", controllers.RemoveFromCart)

		// Orders
		auth.POST("/orders", controllers.CreateOrder)
		auth.GET("/orders", controllers.GetMyOrders)
		auth.GET("/orders/:id", controllers.GetOrderDetail)
		auth.PUT("/orders/:id/cancel", controllers.CancelOrder)

		// Reviews
		auth.POST("/books/:id/reviews", controllers.CreateReview)
		auth.DELETE("/reviews/:id", controllers.DeleteReview)

		// Coupons
		auth.POST("/coupons", middleware.SellerRequired, controllers.CreateCoupon)
		auth.POST("/apply-coupon", controllers.ApplyCoupon)
		auth.GET("/coupons", controllers.GetCoupons)
		auth.DELETE("/coupons/:id", middleware.SellerRequired, controllers.DeleteCoupon)

		// Seller Dashboard
		auth.GET("/seller/books", middleware.SellerRequired, controllers.SellerGetBooks)
		auth.GET("/seller/orders", middleware.SellerRequired, controllers.SellerGetOrders)
		auth.PUT("/seller/orders/:id/status", middleware.SellerRequired, controllers.SellerUpdateOrderStatus)
	}
}
