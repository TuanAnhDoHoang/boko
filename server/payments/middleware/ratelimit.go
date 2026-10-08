package middleware

import (
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type RateLimiter struct {
	mu      sync.Mutex
	limit   int
	window  time.Duration
	entries map[string][]time.Time
}

func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
	return &RateLimiter{
		limit:   limit,
		window:  window,
		entries: make(map[string][]time.Time),
	}
}

func (rl *RateLimiter) Allow(key string) bool {
	if key == "" {
		return false
	}
	now := time.Now()
	rl.mu.Lock()
	defer rl.mu.Unlock()

	cutoff := now.Add(-rl.window)
	filtered := rl.entries[key][:0]
	for _, t := range rl.entries[key] {
		if t.After(cutoff) {
			filtered = append(filtered, t)
		}
	}
	rl.entries[key] = filtered
	if len(filtered) >= rl.limit {
		return false
	}
	filtered = append(filtered, now)
	rl.entries[key] = filtered
	return true
}

func RateLimitMiddleware(limit int, window time.Duration, keyFunc func(c *gin.Context) string) gin.HandlerFunc {
	limiter := NewRateLimiter(limit, window)
	return func(c *gin.Context) {
		key := keyFunc(c)
		if !limiter.Allow(key) {
			c.AbortWithStatusJSON(429, gin.H{"error": "too many requests; temporarily locked"})
			return
		}
		c.Next()
	}
}
