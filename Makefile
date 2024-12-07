.PHONY: dev server frontend test down

dev: server frontend

server: up
	cd server && go run main.go & cd ..

frontend:
	yarn run dev

up:
	docker compose -f server/docker-compose.yml up -d

down:
	docker compose -f server/docker-compose.yml down

test: up
	cd server && go test ./... -v && cd ..
