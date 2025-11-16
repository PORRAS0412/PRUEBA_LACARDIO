# ======== STAGE 1: Build Angular ===========
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --force

COPY . .
RUN npm run build --prod

# ======== STAGE 2: Run NGINX ===============
FROM nginx:alpine

# Copiar build Angular a NGINX
COPY --from=build /app/dist/ /usr/share/nginx/html

# Copiar configuración personalizada (404 fallback, SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
