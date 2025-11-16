FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install --production --force

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
