# Multi-stage Dockerfile for Patogh Frontend
# Stage 1 — build the Vite/React app with pnpm
# Stage 2 — serve the static bundle with Nginx

# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

# Enable corepack so pnpm is available without a separate install step
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency manifests first for better layer caching
COPY package.json pnpm-workspace.yaml ./
# Lock file may not be committed (it's in .gitignore); copy if present
COPY pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

# Copy the rest of the source tree
COPY . .

# Vite env vars injected at build time via Docker build args.
# VITE_API_URL="" (empty) → frontend uses relative URLs (/api/...).
#   Nginx then proxies /api/* to the ASP.NET Core backend.
# VITE_USE_MOCK=false → disable mock data layer in production.
ARG VITE_API_URL=""
ARG VITE_USE_MOCK="false"
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_USE_MOCK=$VITE_USE_MOCK

RUN pnpm build

# ── Stage 2: Serve ────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS final

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom site config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
