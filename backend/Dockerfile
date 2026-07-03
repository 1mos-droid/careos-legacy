# --- Multi-Stage Build: Build & Production ---
# 1. Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install all dependencies (including devDependencies for optional compilation)
RUN npm ci

# Copy application source code
COPY . .

# 2. Production stage (Minimal Image)
FROM node:20-alpine

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Install production-only dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/src ./src

# Create a database directory with correct permissions for SQLite storage
RUN mkdir -p /app/data && chown -R node:node /app/data

# Run as a non-privileged system user for container security
USER node

EXPOSE 3000

# Health check to monitor container responsiveness
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start script
CMD ["node", "src/server.js"]
