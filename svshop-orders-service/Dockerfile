# STAGE 1: dependencies
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json ./
RUN npm install --production

# STAGE 2: runtime
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY src/ ./src/
COPY package.json ./
COPY .env ./

RUN addgroup -S svshop && adduser -S svshop -G svshop
USER svshop

# Variable para indicar que estamos en Docker
ENV DOCKER_ENV=true

EXPOSE 3001

CMD ["node", "src/app.js"]