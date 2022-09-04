package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/pacoVK/aws"
	awsTypes "github.com/pacoVK/aws/types"
	"github.com/pacoVK/types"
	"github.com/pacoVK/utils"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
)

var router = mux.NewRouter()

const testingQueueName = "TestingQueue"

var testingQueueUrl = fmt.Sprintf("%s/000000000000/%s", utils.GetEnv("SQS_ENDPOINT_URL", "http://localhost:4566"), testingQueueName)

func TestMain(m *testing.M) {
	setUp()
	retCode := m.Run()
	tearDown()
	os.Exit(retCode)
}

func setUp() {
	SQSHandler().AddRoute(router)
}

func tearDown() {
	_, err := aws.DeleteQueue(testingQueueUrl)
	if err != nil {
		return
	}
}

func TestCreateSqsQueues(t *testing.T) {
	var s, _ = json.Marshal(types.Request{
		Action: "CreateQueue",
		SqsQueue: awsTypes.SqsQueue{
			QueueUrl:  testingQueueUrl,
			QueueName: testingQueueName,
		},
	})
	req, _ := http.NewRequest("POST", "/sqs", bytes.NewBuffer(s))
	response := executeRequest(req, router)
	checkResponseCode(t, http.StatusOK, response.Code)
	if response.Body.String() != "null" {
		t.Error("Did not get expected response body, got", response.Body.String())
	}
}

func TestListSqsQueues(t *testing.T) {
	req, _ := http.NewRequest("GET", "/sqs", nil)
	response := executeRequest(req, router)
	checkResponseCode(t, http.StatusOK, response.Code)
	if response.Body.String() == "[]" {
		t.Error("Received empty set of queues, expected 1 queue, got:", response.Body.String())
	}
}

func TestSendMessages(t *testing.T) {
	var s, _ = json.Marshal(types.Request{
		Action: "SendMessage",
		SqsQueue: awsTypes.SqsQueue{
			QueueName: testingQueueName,
			QueueUrl:  testingQueueUrl,
		},
		SqsMessage: awsTypes.SqsMessage{
			MessageBody: "Funky Honker Land",
		},
	})
	req, _ := http.NewRequest("POST", "/sqs", bytes.NewBuffer(s))
	response := executeRequest(req, router)
	checkResponseCode(t, http.StatusOK, response.Code)
	if response.Body.String() != "null" {
		t.Error("Did not get expected response body, got", response.Body.String())
	}
}

func TestReceiveMessages(t *testing.T) {
	var s, _ = json.Marshal(types.Request{
		Action: "GetMessages",
		SqsQueue: awsTypes.SqsQueue{
			QueueUrl: testingQueueUrl,
		},
	})
	req, _ := http.NewRequest("POST", "/sqs", bytes.NewBuffer(s))
	response := executeRequest(req, router)
	checkResponseCode(t, http.StatusOK, response.Code)
	stringReader := strings.NewReader(response.Body.String())
	payload := make([]awsTypes.SqsMessage, 0)
	unmarshalJsonData(io.NopCloser(stringReader), &payload)
	if len(payload) != 1 {
		t.Error("Received wrong amount of messages , got", len(payload))
	}
	if payload[0].MessageBody != "Funky Honker Land" {
		t.Error("Did not receive expected message, got", payload[0].MessageBody)
	}
}

func TestPurgeSqsQueues(t *testing.T) {
	var s, _ = json.Marshal(types.Request{
		Action: "PurgeQueue",
		SqsQueue: awsTypes.SqsQueue{
			QueueUrl:  testingQueueUrl,
			QueueName: testingQueueName,
		},
	})
	req, _ := http.NewRequest("POST", "/sqs", bytes.NewBuffer(s))
	response := executeRequest(req, router)
	checkResponseCode(t, http.StatusOK, response.Code)
	if response.Body.String() != "null" {
		t.Error("Did not get expected response body, got", response.Body.String())
	}
}

func TestReceiveEmptyMessages(t *testing.T) {
	var s, _ = json.Marshal(types.Request{
		Action: "GetMessages",
		SqsQueue: awsTypes.SqsQueue{
			QueueUrl: testingQueueUrl,
		},
	})
	req, _ := http.NewRequest("POST", "/sqs", bytes.NewBuffer(s))
	response := executeRequest(req, router)
	checkResponseCode(t, http.StatusOK, response.Code)
	if response.Body.String() != "[]" {
		t.Error("Did not get expected response body, got", response.Body.String())
	}
}

func TestDeleteSqsQueues(t *testing.T) {
	var s, _ = json.Marshal(types.Request{
		Action: "DeleteQueue",
		SqsQueue: awsTypes.SqsQueue{
			QueueUrl:  testingQueueUrl,
			QueueName: testingQueueName,
		},
	})
	req, _ := http.NewRequest("POST", "/sqs", bytes.NewBuffer(s))
	response := executeRequest(req, router)
	checkResponseCode(t, http.StatusOK, response.Code)
	if response.Body.String() != "null" {
		t.Error("Did not get expected response body, got", response.Body.String())
	}
}

func TestListEmptySqsQueues(t *testing.T) {
	req, _ := http.NewRequest("GET", "/sqs", nil)
	response := executeRequest(req, router)
	checkResponseCode(t, http.StatusOK, response.Code)
	if response.Body.String() != "[]" {
		t.Error("Did not get expected response body, got", response.Body.String())
	}
}

func executeRequest(req *http.Request, router *mux.Router) *httptest.ResponseRecorder {
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)
	return rr
}

func checkResponseCode(t *testing.T, expected, actual int) {
	if expected != actual {
		t.Errorf("Expected response code %d. Got %d\n", expected, actual)
	}
}
