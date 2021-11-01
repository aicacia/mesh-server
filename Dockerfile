FROM node:14-alpine as node-builder

RUN npm install -g npm@8.1.2
WORKDIR /app

FROM node-builder as builder

COPY . .
RUN npm install
RUN npm run build

FROM node-builder

COPY --from=builder /app/package*.json ./
RUN npm install --only=production

COPY --from=builder /app/server.js .

EXPOSE 8080

CMD [ "node", "server.js" ]