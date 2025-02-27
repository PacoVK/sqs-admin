package handler

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/pacoVK/aws"
	"github.com/pacoVK/aws/types"
	"github.com/pacoVK/utils"
)

func WebsiteHandler() http.Handler {
	// Get base path from environment or use empty string for root
	basePath := utils.GetEnv("BASE_PATH", "")

	// If no base path, serve directly
	if basePath == "" {
		return http.FileServer(http.Dir("../public"))
	}

	staticDir := utils.GetEnv("SQS_ADMIN_STATIC_DIR", "../public")

	// If there is a base path, strip it before serving files
	return http.StripPrefix(basePath, http.FileServer(http.Dir(staticDir)))
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
				case "GetRegion":
					region := utils.GetEnv("SQS_AWS_REGION", "eu-central-1")
					response := types.AwsRegion{Region: region}
					respondJSON(writer, Response{
						Payload:    response,
						StatusCode: http.StatusOK,
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
