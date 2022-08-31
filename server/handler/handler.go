package handler

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/pacoVK/aws/types"
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

func unpackRequestPayload(r io.ReadCloser) *types.Request {
	data := types.Request{}
	jsonBlob, err := io.ReadAll(r)
	if err != nil {
		log.Fatal(err.Error())
	}
	json.Unmarshal(jsonBlob, &data)
	return &data
}

func unpackResponsePayload(r io.ReadCloser) []types.SqsMessage {
	data := make([]types.SqsMessage, 0)
	jsonBlob, err := io.ReadAll(r)
	if err != nil {
		log.Fatal(err.Error())
	}
	json.Unmarshal(jsonBlob, &data)
	return data
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
