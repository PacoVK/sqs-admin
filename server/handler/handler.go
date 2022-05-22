package handler

import (
	"encoding/json"
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
		respondJSON(w, http.StatusOK, aws.CreateQueue(payload.SqsQueue.QueueName))
	case "DeleteQueue":
		respondJSON(w, http.StatusAccepted, aws.DeleteQueue(payload.SqsQueue.QueueUrl))
	case "PurgeQueue":
		respondJSON(w, http.StatusAccepted, aws.PurgeQueue(payload.SqsQueue.QueueUrl))
	case "GetMessages":
		messages, err := aws.GetMessages(payload.SqsQueue.QueueUrl)
		if err != nil {
			respondError(w, http.StatusBadRequest, err.Error())
		}
		respondJSON(w, http.StatusOK, messages)
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
