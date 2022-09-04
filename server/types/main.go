package types

import "github.com/pacoVK/aws/types"

type Request struct {
	Action     string           `json:"action"`
	SqsQueue   types.SqsQueue   `json:"queue"`
	SqsMessage types.SqsMessage `json:"message"`
}
