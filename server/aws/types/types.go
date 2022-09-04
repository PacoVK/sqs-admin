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
}
