package handler

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/pacoVK/aws"
	"log"
	"net/http"
)

func WebsiteHandler() http.Handler {
	return http.FileServer(http.Dir("../public"))
}

func SQSHandler() Handler {
	return Handler{
		Route: func(r *mux.Route) {
			r.Methods("GET", "POST").Path("/sqs")
		},
		Func: func(writer http.ResponseWriter, request *http.Request) {
			if request.Method == http.MethodGet {
				queues := aws.ListQueues()
				respondJSON(writer, Response{
					Payload:    queues,
					StatusCode: http.StatusOK,
				})
			} else {
				payload := unpackRequestPayload(request.Body)
				switch payload.Action {
				case "CreateQueue":
					log.Printf("Creating queue [%v] with attributes [%v]", payload.SqsQueue.QueueName, payload.SqsQueue.QueueAttributes)
					_, err := aws.CreateQueue(payload.SqsQueue.QueueName, payload.SqsQueue.QueueAttributes)
					checkForErrorAndRespondJSON(&writer, Response{
						Payload: nil,
						Error:   err,
					})
				case "SendMessage":
					_, err := aws.SendMessage(payload.SqsQueue.QueueUrl, payload.SqsMessage)
					checkForErrorAndRespondJSON(&writer, Response{
						Payload: nil,
						Error:   err,
					})
				case "DeleteQueue":
					log.Printf("Deleting queue [%v]", payload.SqsQueue.QueueName)
					_, err := aws.DeleteQueue(payload.SqsQueue.QueueUrl)
					checkForErrorAndRespondJSON(&writer, Response{
						Payload: nil,
						Error:   err,
					})
				case "PurgeQueue":
					log.Printf("Purging queue [%v]", payload.SqsQueue.QueueName)
					_, err := aws.PurgeQueue(payload.SqsQueue.QueueUrl)
					checkForErrorAndRespondJSON(&writer, Response{
						Payload: nil,
						Error:   err,
					})
				case "GetMessages":
					messages, err := aws.GetMessages(payload.SqsQueue.QueueUrl)
					checkForErrorAndRespondJSON(&writer, Response{
						Payload: messages,
						Error:   err,
					})
				default:
					log.Printf("Unsupported action provided [%v]", payload.Action)
					respondJSON(writer, Response{
						Payload:    fmt.Sprintf("Unsupported action provided [%v]", payload.Action),
						StatusCode: http.StatusBadRequest,
					})
				}
			}
		},
	}

}
