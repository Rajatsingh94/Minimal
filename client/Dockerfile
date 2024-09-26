# Use official Node.js image
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the client port for HTTP
EXPOSE 8080

# Run the gRPC client with the HTTP server
CMD ["node", "client.js"]