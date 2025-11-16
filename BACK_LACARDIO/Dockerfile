FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install --production --force

COPY . .

EXPOSE 3000

# Ejecutar siempre desde /app/src
WORKDIR /app/src

CMD ["node", "index.js"]
