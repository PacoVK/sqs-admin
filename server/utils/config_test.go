package utils

import (
	"testing"
)

func TestGetEnvReturnsFallbackWhenNotSet(t *testing.T) {
	got := GetEnv("ENV_VAR", "funky-honker")
	want := "funky-honker"
	if got != want {
		t.Errorf("got %q want %q", got, want)
	}
}

func TestGetEnvReturnsValueIfSet(t *testing.T) {
	t.Setenv("ENV_VAR", "goozy-booz")
	got := GetEnv("ENV_VAR", "funky-honker")
	want := "goozy-booz"
	if got != want {
		t.Errorf("got %q want %q", got, want)
	}
}
