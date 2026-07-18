# ─── Base ────────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install && npm cache clean --force
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
