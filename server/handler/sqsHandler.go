package handler

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/pacoVK/aws"
	"github.com/pacoVK/types"
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
				payload := types.Request{}
				unmarshalJsonData(request.Body, &payload)
				switch payload.Action {
				case "CreateQueue":
					log.Printf("Creating queue [%v]", payload.SqsQueue.QueueName)
					_, err := aws.CreateQueue(payload.SqsQueue.QueueName)
					checkForErrorAndRespondJSON(&writer, Response{
						Payload: nil,
						Error:   err,
					})
				case "SendMessage":
					log.Printf("Send message to queue [%v]", payload.SqsQueue.QueueName)
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
