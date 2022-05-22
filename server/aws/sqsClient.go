package aws

import (
	"context"
	"github.com/aws/aws-sdk-go-v2/service/sqs"
	awsTypes "github.com/aws/aws-sdk-go-v2/service/sqs/types"
	"github.com/pacoVK/aws/types"
	"log"
	"strings"
)

func getQueues() (*sqs.ListQueuesOutput, error) {
	return sqsClient.ListQueues(context.TODO(), &sqs.ListQueuesInput{})
}

func getQueueAttributes(queueUrl *string) (*sqs.GetQueueAttributesOutput, error) {
	return sqsClient.GetQueueAttributes(context.TODO(), &sqs.GetQueueAttributesInput{
		QueueUrl:       queueUrl,
		AttributeNames: []awsTypes.QueueAttributeName{awsTypes.QueueAttributeNameAll},
	})
}

func ListQueues() []types.SqsQueue {
	var queues = []types.SqsQueue{}
	result, err := getQueues()
	if err != nil {
		log.Println("Got an error retrieving queue URLs:")
		log.Println(err)
		return queues
	}
	for _, url := range result.QueueUrls {
		attributes, err := getQueueAttributes(&url)
		if err != nil {
			log.Println("Got an error retrieving queue Attributes:")
			log.Println(err)
			return queues
		}
		arnParts := strings.Split(attributes.Attributes["QueueArn"], ":")
		queues = append(queues, types.SqsQueue{
			QueueUrl:        url,
			QueueAttributes: &attributes.Attributes,
			QueueName:       arnParts[len(arnParts)-1],
		})
	}
	return queues
}

func receiveMessages(queueUrl *string) (*sqs.ReceiveMessageOutput, error) {
	return sqsClient.ReceiveMessage(context.TODO(), &sqs.ReceiveMessageInput{
		QueueUrl:            queueUrl,
		AttributeNames:      []awsTypes.QueueAttributeName{awsTypes.QueueAttributeNameAll},
		VisibilityTimeout:   1,
		MaxNumberOfMessages: 10,
		WaitTimeSeconds:     1,
	})
}

func GetMessages(queueUrl string) ([]types.SqsMessage, error) {
	var sqsMessages = []types.SqsMessage{}
	messages, err := receiveMessages(&queueUrl)
	if err != nil {
		return nil, err
	}
	for _, message := range messages.Messages {
		sqsMessages = append(sqsMessages, types.SqsMessage{
			MessageId:         *message.MessageId,
			MessageBody:       *message.Body,
			MessageAttributes: message.Attributes,
		})
	}
	return sqsMessages, nil
}

func purgeQueue(queueUrl *string) (*sqs.PurgeQueueOutput, error) {
	return sqsClient.PurgeQueue(context.TODO(), &sqs.PurgeQueueInput{
		QueueUrl: queueUrl,
	})
}

func PurgeQueue(queueUrl string) error {
	_, err := purgeQueue(&queueUrl)
	if err != nil {
		return err
	}
	return nil
}

func deleteQueue(queueUrl *string) (*sqs.DeleteQueueOutput, error) {
	return sqsClient.DeleteQueue(context.TODO(), &sqs.DeleteQueueInput{
		QueueUrl: queueUrl,
	})
}

func DeleteQueue(queueUrl string) error {
	_, err := deleteQueue(&queueUrl)
	if err != nil {
		return err
	}
	return nil
}

func createQueue(queueName *string) (*sqs.CreateQueueOutput, error) {
	return sqsClient.CreateQueue(context.TODO(), &sqs.CreateQueueInput{
		QueueName: queueName,
	})
}

func CreateQueue(queueName string) error {
	_, err := createQueue(&queueName)
	if err != nil {
		return err
	}
	return nil
}

func sendMessage(queueUrl *string, sqsMessage *types.SqsMessage) (*sqs.SendMessageOutput, error) {
	return sqsClient.SendMessage(context.TODO(), &sqs.SendMessageInput{
		QueueUrl:    queueUrl,
		MessageBody: &sqsMessage.MessageBody,
	})
}

func SendMessage(queueUrl string, sqsMessage types.SqsMessage) error {
	_, err := sendMessage(&queueUrl, &sqsMessage)
	if err != nil {
		return err
	}
	return nil
}
