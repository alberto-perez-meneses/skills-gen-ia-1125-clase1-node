# Use Node.js LTS Alpine for a lightweight production image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application code
COPY index.js ./
COPY lib/ ./lib/

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

