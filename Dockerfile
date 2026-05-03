# Use the official Bun image
FROM oven/bun:latest AS base
WORKDIR /app

# Install dependencies into a separate layer for better caching
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install production dependencies only
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Final image
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Expose the application port
EXPOSE 8000

# Start the application using the start script defined in package.json
# This ensures that database migrations (db:push) are run before the server starts.
CMD ["bun", "run", "start"]
