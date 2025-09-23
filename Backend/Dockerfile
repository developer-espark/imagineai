# backend Dockerfile
 
# Use Node.js for backend
FROM node:20-alpine
 
WORKDIR /app
 
# Install deps
COPY package*.json ./
RUN npm install
 
# Copy source code
COPY . .
 
# Build TypeScript
RUN npm run build
 
# Expose GraphQL API port
EXPOSE 4000
 
# Run API
CMD ["npm", "run", "dev"]