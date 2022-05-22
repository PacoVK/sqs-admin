package main

import (
	"fmt"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/pacoVK/handler"
	"github.com/pacoVK/utils"
	"log"
	"net/http"
)

func main() {
	HttpPort := fmt.Sprintf(":%v", utils.GetEnv("HTTP_PORT", "3999"))
	router := mux.NewRouter()
	router.HandleFunc("/sqs", handler.ListQueuesHandler).Methods("GET")
	router.HandleFunc("/sqs", handler.SQSHandler).Methods("POST")
	router.PathPrefix("/").Handler(handler.WebsiteHandler()).Methods("GET")

	log.Printf("Backend listening on %v...", HttpPort)
	err := http.ListenAndServe(HttpPort, handlers.CORS(
		handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type"}),
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"}),
	)(router))
	if err != nil {
		log.Fatal(err)
	}
}
