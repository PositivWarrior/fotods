# Use Node.js 20 LTS
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for the build)
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the application (Vite and esbuild will be available here)
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine

WORKDIR /app

# Copy package files for installing production dependencies
COPY package*.json ./

# Install only production dependencies based on package-lock.json
# This ensures we have the exact versions needed for runtime
RUN npm ci --omit=dev # More modern and preferred over --only=production

# Copy built server artifacts from the builder stage
COPY --from=builder /app/dist ./dist

# Expose port that the app runs on
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start the application
# The built server code is in /app/dist/index.js
CMD ["node", "dist/index.js"] 