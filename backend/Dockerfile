FROM node:22-alpine

RUN npm install cors

WORKDIR /app
RUN npm install --global nodemon
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]