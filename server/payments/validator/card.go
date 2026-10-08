package validator

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

func LuhnCheck(number string) bool {
	number = strings.ReplaceAll(number, " ", "")
	if number == "" || len(number) < 13 || len(number) > 19 {
		return false
	}
	for _, ch := range number {
		if ch < '0' || ch > '9' {
			return false
		}
	}
	checksum := 0
	parity := len(number) % 2
	for i, ch := range number {
		digit, _ := strconv.Atoi(string(ch))
		if i%2 == parity {
			digit *= 2
			if digit > 9 {
				digit -= 9
			}
		}
		checksum += digit
	}
	return checksum%10 == 0
}

func IsVisaPAN(pan string) bool {
	pan = strings.ReplaceAll(pan, " ", "")
	if !LuhnCheck(pan) {
		return false
	}
	return strings.HasPrefix(pan, "4") && (len(pan) == 13 || len(pan) == 16 || len(pan) == 19)
}

func ValidateExpiry(month, year int) error {
	if month < 1 || month > 12 {
		return fmt.Errorf("card expiration month is invalid")
	}
	now := time.Now()
	cutoff := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
	if cutoff.Before(now.AddDate(0, 0, -1)) {
		return fmt.Errorf("card is expired")
	}
	return nil
}

func ValidateAmount(amount int64) error {
	if amount <= 0 {
		return fmt.Errorf("amount must be positive")
	}
	return nil
}

func ValidateCurrency(code string) error {
	code = strings.ToUpper(strings.TrimSpace(code))
	if len(code) != 3 {
		return fmt.Errorf("currency must be an ISO 4217 code")
	}
	for _, r := range code {
		if r < 'A' || r > 'Z' {
			return fmt.Errorf("currency must contain letters only")
		}
	}
	return nil
}
