# STAGE 1
# (avoid Alpine unless you need smaller images and are ready for musl issues).
FROM node:20-bullseye-slim

# Update system packages to address vulnerabilities
# - procps includes ps, top, and other process tools.
# - The --no-install-recommends keeps image bloat minimal.
# - rm -rf /var/lib/apt/lists/* cleans up cache to keep the image size smaller.
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends \
    procps \
 && rm -rf /var/lib/apt/lists/*


# 1) set working dir inside container
WORKDIR /app

# 2) copy only package files first to leverage Docker cache for deps
COPY package.json package.json
COPY package-lock.json* package-lock.json

# 3) install dependencies (dev deps included so we can compile/watch)
# Installs exact dependencies from package-lock.json in a deterministic way. We install dev deps too
RUN npm ci

# 4) copy source
# We copy only the dependencies first so Docker can cache the npm ci layer. When you change source code but not dependencies, Docker will reuse the cached layer and skip reinstalling packages.
COPY . .

# 5) expose the port your Nest app listens on (common default 3000)
EXPOSE 3000

# 6) default dev command: run Nest in watch mode (you should have this in package.json)
CMD ["npm", "run", "start:dev"]


