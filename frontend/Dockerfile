# --- Multi-Stage Build: Build & Serve ---
# 1. Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build production client assets
RUN npm run build

# 2. Production Stage (Nginx)
FROM nginx:stable-alpine

# Copy static assets to Nginx serving directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
