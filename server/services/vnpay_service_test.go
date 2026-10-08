package services

import (
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"sort"
	"strings"
	"testing"
	"time"

	"boko/models"
	"boko/payments"
)

func TestCreateHmacSha512(t *testing.T) {
	data := "vnp_Amount=10000000&vnp_Command=pay&vnp_TmnCode=CGXZLS0Z"
	key := "RAOCTRECEZ0ZBGZNYKSTGAAGAGZISUAQ"
	hash := CreateHmacSha512(data, key)

	if len(hash) != 128 { // SHA512 hex string is 128 characters long
		t.Errorf("Expected 128 characters for SHA-512 hex, got %d", len(hash))
	}
}

func TestCreateVnPayPaymentUrl(t *testing.T) {
	order := models.Order{
		ID:    99,
		Total: 150000,
	}

	payUrl, txnRef, err := CreateVnPayPaymentUrl(&order, "127.0.0.1", "NCB", "http://localhost:3000/payment/vnpay-callback")
	if err != nil {
		t.Fatalf("CreateVnPayPaymentUrl failed: %v", err)
	}

	if !strings.HasPrefix(payUrl, "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?") {
		t.Errorf("Invalid payment URL base: %s", payUrl)
	}

	if !strings.Contains(payUrl, "vnp_SecureHash=") {
		t.Errorf("Payment URL missing vnp_SecureHash: %s", payUrl)
	}

	if !strings.Contains(payUrl, "vnp_Amount=15000000") { // 150,000 * 100
		t.Errorf("vnp_Amount should be 15000000, got URL: %s", payUrl)
	}

	if !strings.HasPrefix(txnRef, "BOKO_99_") {
		t.Errorf("txnRef should start with BOKO_99_, got: %s", txnRef)
	}
}

func TestVerifyVnPaySignature(t *testing.T) {
	cfg := payments.GetVnPayConfig()

	params := url.Values{}
	params.Set("vnp_Amount", "24000000")
	params.Set("vnp_BankCode", "NCB")
	params.Set("vnp_OrderInfo", "Thanh toan don hang Boko")
	params.Set("vnp_ResponseCode", "00")
	params.Set("vnp_TmnCode", cfg.TmnCode)
	params.Set("vnp_TransactionNo", "14456789")
	params.Set("vnp_TxnRef", "BOKO_10_1728345678")

	signData := params.Encode()
	hash := CreateHmacSha512(signData, cfg.HashSecret)
	params.Set("vnp_SecureHash", hash)

	// Valid signature test
	if !VerifyVnPaySignature(params) {
		t.Errorf("VerifyVnPaySignature should return true for valid hash")
	}

	// Tampered data test
	tamperedParams := url.Values{}
	for k, v := range params {
		tamperedParams[k] = v
	}
	tamperedParams.Set("vnp_Amount", "1000000") // Hacker changed amount!
	if VerifyVnPaySignature(tamperedParams) {
		t.Errorf("VerifyVnPaySignature should reject tampered amount")
	}
}

func checkVnPayUrl(t *testing.T, label, rawUrl string) {
	client := &http.Client{
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
		Timeout: 10 * time.Second,
	}
	resp, err := client.Get(rawUrl)
	if err != nil {
		t.Logf("[%s] Request failed: %v", label, err)
		return
	}
	defer resp.Body.Close()
	loc := resp.Header.Get("Location")
	body, _ := io.ReadAll(resp.Body)
	t.Logf("[%s] Status: %d, Location: %s, BodyLen: %d", label, resp.StatusCode, loc, len(body))
	if strings.Contains(loc, "code=70") {
		t.Logf("[%s] FAILED (code=70 - Sai chu ky)", label)
	} else if resp.StatusCode == 200 || (loc != "" && !strings.Contains(loc, "Error.html")) {
		t.Logf("[%s] SUCCESS! Accepted by VNPay!", label)
	} else {
		t.Logf("[%s] OTHER: %s", label, loc)
	}
}

func TestVnPayGatewayLive(t *testing.T) {
	secret := "GWGVHNWAWGMSFFWQSUIJNYZPKZPGKXQD"
	tmn := "VWWK6YKC"
	now := time.Now().UTC().Add(7 * time.Hour).Format("20060102150405")
	txn := fmt.Sprintf("TEST_%d", time.Now().Unix())

	h512 := func(data string) string {
		h := hmac.New(sha512.New, []byte(secret))
		h.Write([]byte(data))
		return hex.EncodeToString(h.Sum(nil))
	}

	// Permutation 1: Current Boko implementation (url.Values.Encode())
	{
		v := url.Values{}
		v.Set("vnp_Amount", "10000000")
		v.Set("vnp_Command", "pay")
		v.Set("vnp_CreateDate", now)
		v.Set("vnp_CurrCode", "VND")
		v.Set("vnp_IpAddr", "127.0.0.1")
		v.Set("vnp_Locale", "vn")
		v.Set("vnp_OrderInfo", "Thanh toan don hang Boko 99")
		v.Set("vnp_OrderType", "other")
		v.Set("vnp_ReturnUrl", "http://localhost:3000/payment/vnpay-callback")
		v.Set("vnp_TmnCode", tmn)
		v.Set("vnp_TxnRef", txn)
		v.Set("vnp_Version", "2.1.0")

		signData := v.Encode()
		hash := h512(signData)
		u := fmt.Sprintf("https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?%s&vnp_SecureHash=%s", signData, hash)
		checkVnPayUrl(t, "P1-ValuesEncode-NoHashChar", u)
	}

	// Permutation 2: PHP style urlencode: $hashdata .= urlencode($key) . "=" . urlencode($value) . "&"
	// and query string built with urlencode
	{
		keys := []string{"vnp_Amount", "vnp_Command", "vnp_CreateDate", "vnp_CurrCode", "vnp_IpAddr", "vnp_Locale", "vnp_OrderInfo", "vnp_OrderType", "vnp_ReturnUrl", "vnp_TmnCode", "vnp_TxnRef", "vnp_Version"}
		valMap := map[string]string{
			"vnp_Amount":     "10000000",
			"vnp_Command":    "pay",
			"vnp_CreateDate": now,
			"vnp_CurrCode":   "VND",
			"vnp_IpAddr":     "127.0.0.1",
			"vnp_Locale":     "vn",
			"vnp_OrderInfo":  "Thanh toan don hang Boko 99",
			"vnp_OrderType":  "other",
			"vnp_ReturnUrl":  "http://localhost:3000/payment/vnpay-callback",
			"vnp_TmnCode":    tmn,
			"vnp_TxnRef":     txn + "_2",
			"vnp_Version":    "2.1.0",
		}
		sort.Strings(keys)

		var hashParts []string
		var queryParts []string
		for _, k := range keys {
			v := valMap[k]
			encK := url.QueryEscape(k)
			encV := url.QueryEscape(v)
			hashParts = append(hashParts, encK+"="+encV)
			queryParts = append(queryParts, encK+"="+encV)
		}
		hashData := strings.Join(hashParts, "&")
		hash := h512(hashData)
		u := fmt.Sprintf("https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?%s&vnp_SecureHash=%s", strings.Join(queryParts, "&"), hash)
		checkVnPayUrl(t, "P2-QueryEscape-Both", u)
	}

	// Permutation 3: Raw value in hashData, QueryEscape in query string
	{
		keys := []string{"vnp_Amount", "vnp_Command", "vnp_CreateDate", "vnp_CurrCode", "vnp_IpAddr", "vnp_Locale", "vnp_OrderInfo", "vnp_OrderType", "vnp_ReturnUrl", "vnp_TmnCode", "vnp_TxnRef", "vnp_Version"}
		valMap := map[string]string{
			"vnp_Amount":     "10000000",
			"vnp_Command":    "pay",
			"vnp_CreateDate": now,
			"vnp_CurrCode":   "VND",
			"vnp_IpAddr":     "127.0.0.1",
			"vnp_Locale":     "vn",
			"vnp_OrderInfo":  "Thanh toan don hang Boko 99",
			"vnp_OrderType":  "other",
			"vnp_ReturnUrl":  "http://localhost:3000/payment/vnpay-callback",
			"vnp_TmnCode":    tmn,
			"vnp_TxnRef":     txn + "_3",
			"vnp_Version":    "2.1.0",
		}
		sort.Strings(keys)

		var hashParts []string
		var queryParts []string
		for _, k := range keys {
			v := valMap[k]
			hashParts = append(hashParts, k+"="+v)
			queryParts = append(queryParts, url.QueryEscape(k)+"="+url.QueryEscape(v))
		}
		hashData := strings.Join(hashParts, "&")
		hash := h512(hashData)
		u := fmt.Sprintf("https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?%s&vnp_SecureHash=%s", strings.Join(queryParts, "&"), hash)
		checkVnPayUrl(t, "P3-RawInHash-EscapedInQuery", u)
	}

	// Permutation 4: With vnp_BankCode=NCB
	{
		v := url.Values{}
		v.Set("vnp_Amount", "10000000")
		v.Set("vnp_BankCode", "NCB")
		v.Set("vnp_Command", "pay")
		v.Set("vnp_CreateDate", now)
		v.Set("vnp_CurrCode", "VND")
		v.Set("vnp_IpAddr", "127.0.0.1")
		v.Set("vnp_Locale", "vn")
		v.Set("vnp_OrderInfo", "Thanh toan don hang Boko 99")
		v.Set("vnp_OrderType", "other")
		v.Set("vnp_ReturnUrl", "http://localhost:3000/payment/vnpay-callback")
		v.Set("vnp_TmnCode", tmn)
		v.Set("vnp_TxnRef", txn + "_4")
		v.Set("vnp_Version", "2.1.0")

		signData := v.Encode()
		hash := h512(signData)
		u := fmt.Sprintf("https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?%s&vnp_SecureHash=%s", signData, hash)
		checkVnPayUrl(t, "P4-WithBankCodeNCB", u)
	}

	// Permutation 5: With vnp_BankCode=VNBANK
	{
		v := url.Values{}
		v.Set("vnp_Amount", "10000000")
		v.Set("vnp_BankCode", "VNBANK")
		v.Set("vnp_Command", "pay")
		v.Set("vnp_CreateDate", now)
		v.Set("vnp_CurrCode", "VND")
		v.Set("vnp_IpAddr", "127.0.0.1")
		v.Set("vnp_Locale", "vn")
		v.Set("vnp_OrderInfo", "Thanh toan don hang Boko 99")
		v.Set("vnp_OrderType", "other")
		v.Set("vnp_ReturnUrl", "http://localhost:3000/payment/vnpay-callback")
		v.Set("vnp_TmnCode", tmn)
		v.Set("vnp_TxnRef", txn + "_5")
		v.Set("vnp_Version", "2.1.0")

		signData := v.Encode()
		hash := h512(signData)
		u := fmt.Sprintf("https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?%s&vnp_SecureHash=%s", signData, hash)
		checkVnPayUrl(t, "P5-WithBankCodeVNBANK", u)
	}
}

func TestQueryOrder40(t *testing.T) {
	resp, err := QueryVnPayTransaction("BOKO_40_1791452121", "20261008163521", "127.0.0.1")
	if err != nil {
		t.Logf("QueryVnPayTransaction error: %v", err)
		return
	}
	t.Logf("Query Order 40: ResponseCode=%s, TransactionStatus=%s, Amount=%s, TransNo=%s, Message=%s",
		resp.ResponseCode, resp.TransactionStatus, resp.Amount, resp.TransactionNo, resp.Message)
}


