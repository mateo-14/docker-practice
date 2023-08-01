# With Docker Compose

## docker-compose.yml
```yml
services:
  api: # Service name
    build: . # Path to Dockerfile
    ports:               
      - "3000:3000"
    depends_on:
      - db # Service dependency, wait for db to be ready
    environment:
      LOG_FILE: dev-log-otro.txt
    links:
      - db # Link to db service, you can use db as hostname
  db:
    image: postgres:15.3-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - db-data:/var/lib/postgresql/data # Persist data in a volume
  
volumes: # Declare volumes
  db-data: # Volume name, used by db service
```

## Commands
- `docker compose up`: Start services
- `docker compose up --build`: Start services and rebuild images
- `docker compose up -d`: Start services in background
- `docker compose down`: Stop services
- `docker compose logs`: Show logs
- `docker compose logs -f`: Show logs in real time
- `docker compose ps`: Show running services