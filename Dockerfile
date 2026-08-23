# ==========================================
# YNR Happy Homes Backend
# Multi-stage Dockerfile
# ==========================================

# ==========================================
# Stage 1: Build
# ==========================================
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL required by Prisma
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY prisma ./prisma/

# Install dependencies
RUN npm install
RUN cd backend && npm install

# Copy backend source
COPY backend ./backend/

# Generate Prisma clients
RUN npx prisma generate

# Build backend
RUN cd backend && npm run build


# ==========================================
# Stage 2: Production
# ==========================================
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install OpenSSL required by Prisma
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY prisma ./prisma/

# Install production dependencies
RUN npm install --omit=dev
RUN cd backend && npm install --omit=dev

# Copy compiled backend
COPY --from=builder /app/backend/dist ./backend/dist

# Copy generated Prisma clients
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/backend/node_modules/.prisma ./backend/node_modules/.prisma

# Create uploads directory
RUN mkdir -p /app/backend/uploads

# Backend port
EXPOSE 8000

# Start server
CMD ["node", "backend/dist/server.js"]