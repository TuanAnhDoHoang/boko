package middleware

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

var sensitiveFields = map[string]struct{}{
	"pan": {}, "card": {}, "number": {}, "cvv": {}, "cvc": {}, "pin": {},
	"token": {}, "payment_method_id": {}, "api_key": {}, "secret": {},
	"webhook_secret": {}, "authorization": {}, "cookie": {}, "set-cookie": {},
}

func RedactSensitiveJSON(data []byte) []byte {
	if len(data) == 0 {
		return data
	}
	var v any
	if err := json.Unmarshal(data, &v); err != nil {
		return []byte("[redacted]")
	}
	redactValue(v)
	out, err := json.Marshal(v)
	if err != nil {
		return []byte("[redacted]")
	}
	return out
}

func redactValue(value any) {
	switch v := value.(type) {
	case map[string]any:
		for key, item := range v {
			if _, ok := sensitiveFields[strings.ToLower(key)]; ok {
				v[key] = "[REDACTED]"
				continue
			}
			redactValue(item)
		}
	case []any:
		for _, item := range v {
			redactValue(item)
		}
	}
}

func NewRedactingLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		if c.Request.Body != nil {
			buf := new(bytes.Buffer)
			if _, err := buf.ReadFrom(c.Request.Body); err == nil {
				body := RedactSensitiveJSON(buf.Bytes())
				c.Request.Body = io.NopCloser(bytes.NewReader(body))
				c.Set("redacted_body", string(body))
			}
		}
		c.Next()
		log.Printf("%s %s status=%d latency=%s client_ip=%s", c.Request.Method, c.Request.URL.Path, c.Writer.Status(), time.Since(start), c.ClientIP())
	}
}
