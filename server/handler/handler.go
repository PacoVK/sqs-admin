package handler

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"io"
	"log"
	"net/http"
)

type Handler struct {
	Route func(r *mux.Route)
	Func  http.HandlerFunc
}

type Response struct {
	Payload    interface{} `json:"payload"`
	StatusCode int         `json:"statusCode"`
	Error      error       `json:"error"`
}

func (h Handler) AddRoute(r *mux.Router) {
	h.Route(r.NewRoute().HandlerFunc(h.Func))
}

func unmarshalJsonData(r io.ReadCloser, target interface{}) interface{} {
	jsonBlob, err := io.ReadAll(r)
	if err != nil {
		log.Fatal(err.Error())
	}
	json.Unmarshal(jsonBlob, &target)
	return target
}

func respondJSON(w http.ResponseWriter, res Response) {
	var response, err = json.Marshal(res.Payload)
	if err != nil {
		respondJSON(w, Response{
			StatusCode: http.StatusInternalServerError,
			Error:      err,
		})
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(res.StatusCode)
	w.Write(response)
}

func checkForErrorAndRespondJSON(w *http.ResponseWriter, res Response) {
	if res.Error != nil {
		respondJSON(*w, Response{
			Payload:    nil,
			StatusCode: http.StatusBadRequest,
			Error:      res.Error,
		})
	} else {
		respondJSON(*w, Response{
			Payload:    res.Payload,
			StatusCode: http.StatusOK,
			Error:      nil,
		})
	}
}
