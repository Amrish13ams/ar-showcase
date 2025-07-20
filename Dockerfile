FROM node:18

# Install system dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ libpq-dev && \
    corepack enable && \
    corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy only dependency files first (for caching)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy the rest of the app
COPY . .

# 🔧 Build the production app
RUN pnpm build

# Expose port (Next.js uses 3000 by default)
EXPOSE 3000

# Start the production server
CMD ["pnpm", "start"]
