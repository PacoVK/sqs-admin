.PHONY: dev server frontend down

dev: server frontend

server:
	docker compose -f server/docker-compose.yml up -d
	cd server && go run main.go & cd ..

frontend:
	yarn start --cwd frontend

down:
	docker compose -f server/docker-compose.yml down

