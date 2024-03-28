# Step 1: Build static react app
FROM node:18-alpine AS builder

WORKDIR /app

COPY ./package.json ./package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Step 2: Run image
FROM nginx:1.25.4-alpine-slim

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
