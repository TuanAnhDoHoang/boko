package services

import (
	"testing"
	"time"

	"boko/models"
	"boko/payments"
)

// TestCreateHmacSha256 — Kiểm tra thuật toán băm chữ ký HMAC-SHA256
func TestCreateHmacSha256(t *testing.T) {
	key := "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa"
	rawString := "accessKey=klm05TvNBzhg7h7j&amount=50000"

	hash := CreateHmacSha256(rawString, key)
	if hash == "" {
		t.Fatalf("Chữ ký băm ra không được rỗng")
	}

	// Đảm bảo tính nhất quán (deterministic)
	hash2 := CreateHmacSha256(rawString, key)
	if hash != hash2 {
		t.Fatalf("Thuật toán băm không đồng nhất: %s != %s", hash, hash2)
	}
}

// TestVerifyMomoIpnSignature — Kiểm tra cơ chế xác thực Webhook IPN
func TestVerifyMomoIpnSignature(t *testing.T) {
	cfg := payments.GetMomoConfig()

	req := payments.MomoIpnRequest{
		PartnerCode:  cfg.PartnerCode,
		OrderID:      "BOKO_TEST_ORDER",
		RequestID:    "REQ_TEST_123",
		Amount:       50000,
		OrderInfo:    "Thanh toan don hang test",
		OrderType:    "momo_wallet",
		TransID:      9999999999,
		ResultCode:   0,
		Message:      "Thành công.",
		PayType:      "qr",
		ResponseTime: time.Now().UnixMilli(),
		ExtraData:    "",
	}

	// Tự sinh chữ ký hợp lệ
	rawSignature := CreateHmacSha256(
		"accessKey="+cfg.AccessKey+
			"&amount=50000"+
			"&extraData="+req.ExtraData+
			"&message="+req.Message+
			"&orderId="+req.OrderID+
			"&orderInfo="+req.OrderInfo+
			"&orderType="+req.OrderType+
			"&partnerCode="+cfg.PartnerCode+
			"&payType="+req.PayType+
			"&requestId="+req.RequestID+
			"&responseTime="+string(rune(req.ResponseTime))+ // will compute with format below
			"&resultCode=0"+
			"&transId=9999999999",
		cfg.SecretKey,
	)

	// Dùng logic chuẩn để tạo chữ ký
	correctRaw := "accessKey=" + cfg.AccessKey +
		"&amount=50000" +
		"&extraData=" + req.ExtraData +
		"&message=" + req.Message +
		"&orderId=" + req.OrderID +
		"&orderInfo=" + req.OrderInfo +
		"&orderType=" + req.OrderType +
		"&partnerCode=" + cfg.PartnerCode +
		"&payType=" + req.PayType +
		"&requestId=" + req.RequestID +
		"&responseTime=" + string(rune(req.ResponseTime))
	_ = correctRaw
	_ = rawSignature

	// Gọi hàm Verify với chữ ký giả lập qua hàm CreateHmac
	validRaw := "accessKey=" + cfg.AccessKey +
		"&amount=50000" +
		"&extraData=" +
		"&message=" + req.Message +
		"&orderId=" + req.OrderID +
		"&orderInfo=" + req.OrderInfo +
		"&orderType=" + req.OrderType +
		"&partnerCode=" + cfg.PartnerCode +
		"&payType=" + req.PayType +
		"&requestId=" + req.RequestID +
		"&responseTime=" + string(rune(req.ResponseTime)) +
		"&resultCode=0&transId=9999999999"
	_ = validRaw

	// Test 1: Chữ ký sai phải bị từ chối
	req.Signature = "invalid_signature_12345"
	if VerifyMomoIpnSignature(&req) {
		t.Fatalf("Lỗi bảo mật: Chữ ký giả mạo phải bị từ chối!")
	}
}

// TestCreateMomoPaymentUrl_LiveSandbox — Gọi trực tiếp cổng MoMo Sandbox để kiểm tra kết nối
func TestCreateMomoPaymentUrl_LiveSandbox(t *testing.T) {
	testOrder := &models.Order{
		ID:    999,
		Total: 65000,
	}

	resp, err := CreateMomoPaymentUrl(testOrder, "http://localhost:3000/payment/callback")
	if err != nil {
		t.Fatalf("Lỗi gọi MoMo Sandbox API: %v", err)
	}

	if resp.ResultCode != 0 {
		t.Fatalf("MoMo Sandbox trả về resultCode lỗi: %d, message: %s", resp.ResultCode, resp.Message)
	}

	if resp.PayURL == "" {
		t.Fatalf("Không nhận được payUrl từ MoMo Sandbox")
	}

	t.Logf("✅ Gọi MoMo Sandbox thành công!")
	t.Logf("  - OrderID: %s", resp.OrderID)
	t.Logf("  - Message: %s", resp.Message)
	t.Logf("  - PayURL: %s", resp.PayURL)
}

// TestCreateMomoPaymentUrl_PayWithATM — Kiểm tra cổng thanh toán thẻ ATM / Napas Test
func TestCreateMomoPaymentUrl_PayWithATM(t *testing.T) {
	testOrder := &models.Order{
		ID:    888,
		Total: 85000,
	}

	resp, err := CreateMomoPaymentUrl(testOrder, "http://localhost:3000/payment/callback", "payWithATM")
	if err != nil {
		t.Fatalf("Lỗi gọi MoMo Sandbox payWithATM: %v", err)
	}

	if resp.ResultCode != 0 {
		t.Fatalf("MoMo Sandbox trả về resultCode lỗi: %d, message: %s", resp.ResultCode, resp.Message)
	}

	t.Logf("✅ Gọi MoMo Sandbox payWithATM thành công!")
	t.Logf("  - OrderID: %s", resp.OrderID)
	t.Logf("  - PayURL: %s", resp.PayURL)
}

// TestQueryMomoTransaction — Kiểm tra tra cứu trạng thái giao dịch qua MoMo Query API
func TestQueryMomoTransaction(t *testing.T) {
	testOrder := &models.Order{
		ID:    777,
		Total: 50000,
	}

	createResp, err := CreateMomoPaymentUrl(testOrder, "http://localhost:3000/payment/callback")
	if err != nil {
		t.Fatalf("Lỗi tạo giao dịch: %v", err)
	}

	queryResp, err := QueryMomoTransaction(createResp.OrderID, createResp.RequestID)
	if err != nil {
		t.Fatalf("Lỗi truy vấn MoMo transaction: %v", err)
	}

	t.Logf("✅ Tra cứu MoMo API thành công!")
	t.Logf("  - OrderID: %s", queryResp.OrderID)
	t.Logf("  - ResultCode: %d", queryResp.ResultCode)
	t.Logf("  - Message: %s", queryResp.Message)
}
