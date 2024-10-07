# Backend Dockerfile (api/Dockerfile)
FROM oven/bun:latest AS base

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json bun.lockb ./
RUN bun install

# Copy the rest of the application code
COPY . .

# Development stage
FROM base AS development
ENV NODE_ENV=development
# Add a new script to run setup and then start the dev server
CMD ["sh", "-c", "bun run db:setup && bun run db:seed && bun run dev"]

# Production stage
FROM base AS production
ENV NODE_ENV=production
RUN bun run build
# For production, you might want to run setup before starting the server
CMD ["sh", "-c", "bun run db:setup && bun run start"]