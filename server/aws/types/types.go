package types

type SqsQueue struct {
	QueueUrl        string
	QueueName       string
	QueueAttributes *map[string]string
}

type SqsMessage struct {
	MessageId         string            `json:"messageId"`
	MessageBody       string            `json:"messageBody"`
	MessageAttributes map[string]string `json:"messageAttributes"`
	MessageGroupId		string            `json:"messageGroupId,omitempty"`
}

type Request struct {
	Action     string     `json:"action"`
	SqsQueue   SqsQueue   `json:"queue"`
	SqsMessage SqsMessage `json:"message"`
}
