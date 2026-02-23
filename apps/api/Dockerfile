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

# Build NestJS app — debug output to diagnose build failures
RUN cd apps/api && \
    echo "=== nest-cli.json ===" && cat nest-cli.json && \
    echo "=== tsconfig.build.json ===" && cat tsconfig.build.json && \
    echo "=== Running nest build ===" && \
    npx nest build 2>&1; \
    BUILD_EXIT=$?; \
    echo "=== nest build exit code: $BUILD_EXIT ===" && \
    echo "=== dist/ contents ===" && \
    ls -laR dist/ 2>&1 || echo "dist/ does not exist" && \
    test -f dist/main.js

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
