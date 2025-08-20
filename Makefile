.PHONY: up down logs build clean seed

# Start all services
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Build images
build:
	docker-compose build

# Clean up containers and volumes
clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

# Seed the database
seed:
	docker-compose exec api npm run seed

# Restart services
restart:
	docker-compose restart

# Show service status
status:
	docker-compose ps

# Access API container shell
shell:
	docker-compose exec api sh

# Access MongoDB shell
mongo:
	docker-compose exec mongo mongosh

# Quick start (build and up)
start: build up 