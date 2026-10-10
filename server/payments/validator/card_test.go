package validator

import "testing"

func TestLuhnCheck(t *testing.T) {
	if !LuhnCheck("4111111111111111") {
		t.Fatal("expected valid Visa test PAN to pass Luhn")
	}
	if LuhnCheck("4111111111111112") {
		t.Fatal("expected invalid PAN to fail Luhn")
	}
}

func TestIsVisaPAN(t *testing.T) {
	if !IsVisaPAN("4111111111111111") {
		t.Fatal("expected Visa PAN to pass")
	}
	if IsVisaPAN("5555555555554444") {
		t.Fatal("expected non-Visa PAN to fail")
	}
}
