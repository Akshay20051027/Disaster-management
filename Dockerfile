## Multi-stage Dockerfile
# Stage 1: build frontend and backend dependencies
FROM node:18 AS builder
WORKDIR /app

# Copy root package files and install frontend deps
COPY package.json package-lock.json ./
RUN npm install --silent

# Install backend deps
COPY backend/package.json backend/package-lock.json ./backend/
RUN npm --prefix backend install --silent

# Copy full repo and build frontend
COPY . .
RUN npm run build

# Stage 2: runtime image
FROM node:18-alpine
WORKDIR /app

# Copy backend and built frontend from builder
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/build ./build

WORKDIR /app/backend

# Install only production deps for backend
RUN npm install --production --silent

ENV NODE_ENV=production
EXPOSE 8000

CMD ["node", "server.js"]
