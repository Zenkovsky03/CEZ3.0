# 1. Base stage (for development)
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# 2. Build stage
FROM base AS build
COPY . .
RUN npm run build

# 3. Production stage (Nginx)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]