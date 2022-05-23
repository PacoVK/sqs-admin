package handler

import (
	"encoding/json"
	"errors"
	"github.com/pacoVK/aws"
	"github.com/pacoVK/aws/types"
	"io/ioutil"
	"log"
	"net/http"
)

func WebsiteHandler() http.Handler {
	return http.FileServer(http.Dir("../public"))
}

func ListQueuesHandler(w http.ResponseWriter, r *http.Request) {
	queues := aws.ListQueues()
	respondJSON(w, http.StatusOK, queues)
}

func SQSHandler(w http.ResponseWriter, r *http.Request) {
	payload := unpackPayload(r)
	switch payload.Action {
	case "CreateQueue":
		log.Printf("Creating queue [%v]", payload.SqsQueue.QueueName)
		checkErrorAndRespond(aws.CreateQueue(payload.SqsQueue.QueueName), &w)
	case "SendMessage":
		log.Printf("Send message to queue [%v]", payload.SqsQueue.QueueName)
		checkErrorAndRespond(aws.SendMessage(payload.SqsQueue.QueueUrl, payload.SqsMessage), &w)
	case "DeleteQueue":
		log.Printf("Deleting queue [%v]", payload.SqsQueue.QueueName)
		checkErrorAndRespond(aws.DeleteQueue(payload.SqsQueue.QueueUrl), &w)
	case "PurgeQueue":
		log.Printf("Purging queue [%v]", payload.SqsQueue.QueueName)
		checkErrorAndRespond(aws.PurgeQueue(payload.SqsQueue.QueueUrl), &w)
	case "GetMessages":
		messages, err := aws.GetMessages(payload.SqsQueue.QueueUrl)
		if err != nil {
			respondError(w, http.StatusBadRequest, err.Error())
		} else {
			respondJSON(w, http.StatusOK, messages)
		}
	default:
		log.Printf("Unsupported action provided [%v]", payload.Action)
		respondError(w, http.StatusBadRequest, errors.New("unsupported method").Error())
	}
}

func unpackPayload(r *http.Request) *types.Request {
	data := types.Request{}
	jsonBlob, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err.Error())
	}
	json.Unmarshal(jsonBlob, &data)
	return &data
}

func respondJSON(w http.ResponseWriter, status int, payload interface{}) {
	response, err := json.Marshal(payload)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(response)
}

func respondError(w http.ResponseWriter, code int, message string) {
	respondJSON(w, code, map[string]string{"error": message})
}

func checkErrorAndRespond(err error, w *http.ResponseWriter) {
	if err != nil {
		respondError(*w, http.StatusBadRequest, err.Error())
	} else {
		respondJSON(*w, http.StatusOK, nil)
	}
}
