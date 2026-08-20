# Multi-stage Dockerfile for YNR Happy Homes Backend Server
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and backend package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY prisma ./prisma/

# Install dependencies
RUN npm install --prefix backend
RUN npm install

# Copy source files
COPY backend ./backend/

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN cd backend && npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY backend/package*.json ./backend/
COPY prisma ./prisma/

# Install production dependencies only
RUN cd backend && npm install --only=production

# Copy built dist files
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/backend/node_modules/.prisma ./backend/node_modules/.prisma

# Create uploads directory for persistent media storage
RUN mkdir -p /app/backend/uploads

EXPOSE 8000

CMD ["node", "backend/dist/server.js"]
