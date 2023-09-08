.PHONY: dev server frontend

dev: server frontend

server:
	docker compose -f server/docker-compose.yml up -d
	cd server && go run main.go & cd ..

frontend:
	yarn start --cwd frontend

