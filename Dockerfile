# Use Node 18 as base image
FROM node:18

# Install required build tools for libpq and enable pnpm
RUN apt-get update && \
    apt-get install -y python3 make g++ libpq-dev && \
    corepack enable && \
    corepack prepare pnpm@latest --activate

# Set working directory in container
WORKDIR /app

# Copy only package definition files and install deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy the rest of your codebase
COPY . .

# Expose your app’s port (change if needed)
EXPOSE 3000

# Start the app (change if your entry point is different)
CMD ["pnpm", "start"]
