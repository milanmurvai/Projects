# Build the app in a node.js docker image
FROM node:20.12.1-alpine3.18 as build
WORKDIR /app
COPY package*.json ./

# Install dependencies
RUN npm install
COPY . .
# Run build script
RUN npm run build

# Serve the app from an nginx docker image
FROM nginx:1.25.3-alpine3.18-slim
# Copy from the default Vite output directory
COPY --from=build /app/dist /usr/share/nginx/html
# Copy your nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
