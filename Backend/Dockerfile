# ─── Base ────────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
# Install dependencies only when package files change
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY . .

# ─── Development ─────────────────────────────────────────────
FROM base AS development
# Re-install with devDependencies for hot-reload (nodemon)
RUN npm ci && npm cache clean --force
EXPOSE 5000
CMD ["npm", "run", "dev"]

# ─── Production ──────────────────────────────────────────────
FROM base AS production
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server.js"]
