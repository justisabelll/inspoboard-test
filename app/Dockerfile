# Frontend Dockerfile (app/Dockerfile)
FROM oven/bun:latest AS base

WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the frontend application code
COPY . .

# Development stage
FROM base AS development
ENV NODE_ENV=development
EXPOSE 3000
CMD ["bun", "run", "dev", "--host"]

# Production stage
FROM base AS production
ENV NODE_ENV=production
RUN bun run build
CMD ["bun", "run", "serve", "--host"]
