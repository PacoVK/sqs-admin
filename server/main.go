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
	handler.SQSHandler().AddRoute(router)
	router.PathPrefix("/").Handler(handler.WebsiteHandler()).Methods("GET")
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
