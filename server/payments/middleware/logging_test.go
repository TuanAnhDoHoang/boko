package middleware

import "testing"

func TestRedactSensitiveJSON(t *testing.T) {
	input := []byte(`{"pan":"4111111111111111","token":"tok_test_123","nested":{"cvv":"123"},"status":"ok"}`)
	redacted := RedactSensitiveJSON(input)
	if string(redacted) == string(input) {
		t.Fatal("expected redacted output to change payload")
	}
	if string(redacted) == "[redacted]" {
		t.Fatal("body should not be fully redacted; it should preserve non-sensitive fields")
	}
	if string(redacted) == "" {
		t.Fatal("redacted body should not be empty")
	}
	if !containsSubstring(string(redacted), "status") || !containsSubstring(string(redacted), "[REDACTED]") {
		t.Fatal("expected non-sensitive fields to remain and sensitive fields to be masked")
	}
}

func containsSubstring(s, sub string) bool {
	return len(sub) == 0 || (len(s) >= len(sub) && (func() bool {
		for i := 0; i+len(sub) <= len(s); i++ {
			if s[i:i+len(sub)] == sub {
				return true
			}
		}
		return false
	})())
}
