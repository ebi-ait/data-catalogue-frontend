# Step 1: Build static react app
FROM node:18-alpine AS builder

# Define working directory and copy source
WORKDIR /app

COPY . .

# Install dependencies and build whatever you have to build
RUN npm install && npm run build

# Step 2: Run image
FROM nginx:1.25.4-alpine-slim

COPY --from=builder /app/build /usr/share/nginx/html

COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
