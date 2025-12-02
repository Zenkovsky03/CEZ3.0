# 1. Base/Build stage
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package files first for caching efficiency
COPY package*.json ./

# Install all dependencies (including the newly added sass-embedded)
# Vite/Sass will use this environment to compile CSS
RUN npm install

# Copy all application source code
COPY . .

# Run the build command
RUN npm run build

# --- 2. Production stage (Nginx) ---
FROM nginx:alpine
# Copy the built artifacts from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]