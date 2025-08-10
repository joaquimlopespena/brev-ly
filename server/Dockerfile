FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build  # Ajuste aqui se usar tsup, tsc, vite, etc

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY .env.example .env

EXPOSE 3333

CMD ["node", "dist/routes/server.js"]
