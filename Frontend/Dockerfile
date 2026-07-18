# ─── Base ────────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
# --include=dev ensures vite and other devDependencies are installed
# regardless of NODE_ENV (important for development containers)
RUN npm install --include=dev && npm cache clean --force
COPY . .

# ─── Development ─────────────────────────────────────────────
FROM base AS development
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ─── Production ──────────────────────────────────────────────
FROM base AS production
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
