FROM node:20-slim
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

# Copy workspace config + prisma schema (needed by postinstall)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps/api/package.json apps/api/
COPY apps/api/prisma/schema.prisma apps/api/prisma/
COPY packages/shared/package.json packages/shared/

# Install dependencies (postinstall runs prisma generate)
RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/api/ apps/api/
COPY packages/shared/ packages/shared/

# Build NestJS app (nest build uses nest-cli.json → sourceRoot: "src" → dist/main.js)
RUN cd apps/api && npx nest build && ls dist/main.js

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
