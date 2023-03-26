FROM node:19-alpine as node-builder

RUN npm install --location=global npm@9.3.1
WORKDIR /app

FROM node-builder as builder

COPY . .
RUN npm install
RUN npm run build

FROM node-builder

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/server.js .

CMD [ "node", "server.js" ]