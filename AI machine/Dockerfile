FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG VITE_APP_ENV=production
ARG VITE_API_BASE_URL=/api
ARG VITE_BUILD_VERSION=QWG-production
ARG VITE_MARKET_DATA_MODE=live

ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_BUILD_VERSION=$VITE_BUILD_VERSION
ENV VITE_MARKET_DATA_MODE=$VITE_MARKET_DATA_MODE

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV LOCAL_API_PORT=8787

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server

EXPOSE 8787

CMD ["node", "server/local-api.mjs"]
