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
2. Run with: `docker run -it --init --name node-app-dev -p8080:3000 -v ${pwd}:/app nodeapp:dev`

We add `-v ${pwd}:/app` to mount the host folder to the container folder. This way, when we change a file in the host, it will be changed in the container too. I used `${pwd}` to get the current directory, but you can use the absolute path too. First argument is the path to the folder in the host machine, and the second is the path to the folder in the container. First argument as volume name as well.

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

## Networks
Create a network: `docker network create <network_name>`

### Run database container in a network
Create postgres container: `docker run -it --name db --network docker-practice --network-alias db -v pgdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=admin postgres:15.3-alpine`
- `--network <network_name>`: Add the container to the network
- `--network-alias <network_alias>`: Set the container alias in the network
- `-v`: Mount volume, first argument is the volume name, and the second is the path in the container. First argument can be a path too.

Now, we can connect to the database using the alias `db` as the host, and the default port `5432`. We need to create the node app container in the same network to be able to connect to the database.

### Run node app container in a network
Create node app container: `docker run -it --init --name node-app-dev --network docker-practice -p8080:3000 -v ${pwd}:/app nodeapp:dev`


## Useful docker run arguments/options
- `-it`: Interactive mode. You can use `Ctrl + p + q` to detach from the container without stopping it.
- `-rm`: Remove the container when it stops.
- `-d`: Detached mode. Run the container in the background.
- `-p <host_port>:<container_port>`: Map a port from the host to the container.
- `-v <host_path>:<container_path>`: Mount a volume from the host to the container.
- `-e <variable_name>=<variable_value>`: Set an environment variable.
- `--name <container_name>`: Set the container name.
- `--network <network_name>`: Add the container to the network.
- `--network-alias <network_alias>`: Set the container alias in the network.
