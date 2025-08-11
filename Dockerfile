# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies for build
RUN npm ci

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Production stage - using nginx for static serving
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default nginx config and create our own
RUN rm -f /etc/nginx/conf.d/default.conf && \
    echo 'server { \
    listen 4173; \
    listen [::]:4173; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    location = /health { \
        access_log off; \
        return 200 "healthy"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/app.conf

# Install wget for health checks
RUN apk add --no-cache wget

# Expose port
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4173/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]