FROM node:18

WORKDIR /app

COPY . .

EXPOSE 3000

RUN npm install

ENV LOG_FILE="./dev-logs.txt"

CMD ["npm", "start"]