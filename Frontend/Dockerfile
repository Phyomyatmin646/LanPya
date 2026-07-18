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
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]

# ─── Production ──────────────────────────────────────────────
FROM base AS production
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
