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

type App struct {
	Router *mux.Router
}

func (app *App) Initialize() *App {
	router := mux.NewRouter()
	
	// Get API prefix from environment variable (for Localstack extension compatibility)
	apiPrefix := utils.GetEnv("API_PREFIX", "")
	
	// Set up API routes with optional prefix
	if apiPrefix != "" {
		// For extensions, we might want a specific route
		apiRouter := router.PathPrefix(apiPrefix).Subrouter()
		handler.SQSHandler().AddRoute(apiRouter)
	} else {
		// Default behavior - use /sqs endpoint
		handler.SQSHandler().AddRoute(router)
	}
	
	// Get base path from environment
	basePath := utils.GetEnv("BASE_PATH", "")
	
	// Set up static file serving with optional base path
	if basePath != "" {
		router.PathPrefix(basePath).Handler(handler.WebsiteHandler()).Methods("GET")
	} else {
		router.PathPrefix("/").Handler(handler.WebsiteHandler()).Methods("GET")
	}
	
	app.Router = router
	return app
}

func (app *App) Run() {
	HttpPort := fmt.Sprintf(":%v", utils.GetEnv("HTTP_PORT", "3999"))
	log.Printf("Backend listening on %v...", HttpPort)
	err := http.ListenAndServe(HttpPort, handlers.CORS(
		handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type"}),
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"}),
	)(app.Router))
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	app := App{}
	app.Initialize().Run()
}
