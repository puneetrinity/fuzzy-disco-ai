# Use Node.js 18+ as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy application files
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "import('node-fetch').then(({default: fetch}) => fetch('http://localhost:8000/health').then(r => r.ok ? process.exit(0) : process.exit(1)))"

# Default command - can be overridden
CMD ["npm", "run", "start:web"]