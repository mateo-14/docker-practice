# Without Docker Compose

## Commands
### Images
- Download an image: `docker pull <image_name>`
- List all images: `docker images`
### Containers
- Create a container: `docker create <image_name>`
- Create and start a container: `docker run <image_name>`
- List all containers: `docker ps -a`
- Start a container: `docker start <container_id>/<container_name>`
- List running containers: `docker ps`
- Stop a container: `docker stop <container_id>/<container_name>`
- Remove a container: `docker rm <container_id>/<container_name>`
- Attach to a container: `docker attach <container_id>/<container_name>`
- Detach from a container without stopping it: `Ctrl + p + q`
#### Create container arguments
- Container name: `docker create/run --name <container_name> <image_name>`
- Port mapping: `docker create/run -p <host_port>:<container_port> <image_name>`
- Detached mode (docker run only): `docker run -d <image_name>`
#### Container logs
- Show container logs: `docker logs <container_id>` or `docker logs <container_name>`


## Dockerfile
1. Build with: `docker build -t nodeapp .`
2. Run with: `docker run -it --init --name node-app -p8080:3000 nodeapp`
```dockerfile
# Base image
FROM node:18

# Set working directory. Creates if not exists, and navigates to it. All commands will be executed in this directory.
WORKDIR /app

# Copy files from host to container. The first argument is the path to the file/folder in the host machine, and the second is the path to the file/folder in the container.
COPY . . 

# Expose a port. This is not necessary, but it is a good practice.
EXPOSE 3000

# Install dependencies. This command will be executed when the image is built.
RUN npm install

# Set environment variables. Used in sample app.
ENV LOG_FILE="./dev-logs.txt"

# Run a command. This is the command that will be executed when the container is started.
CMD ["npm", "start"]
```

### Hot reload
1. Build with: `docker build -t nodeapp:dev -f Dockerfile.dev .`
2. Run with: `docker run -it --init --name node-app-dev -p8080:3000 -v :.:/app nodeapp:dev`

We add `-v :.:/app` to mount the host folder to the container folder. This way, when we change a file in the host, it will be changed in the container too.

```dockerfile
# Base image
FROM node:18

# Set working directory. Creates if not exists, and navigates to it. All commands will be executed in this directory.
WORKDIR /app

# COPY . . We don't need to copy the files, because we will mount the host folder to the container folder.

# Expose a port. This is not necessary, but it is a good practice.
EXPOSE 3000

# Install dependencies. This command will be executed when the image is built.
RUN npm install

# Set environment variables. Used in sample app.
ENV LOG_FILE="./dev-logs.txt"

# Run a command. This is the command that will be executed when the container is started.
CMD ["npm", "dev"]
```