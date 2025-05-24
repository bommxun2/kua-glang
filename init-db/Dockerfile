FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install @aws-sdk/client-dynamodb

COPY . .

CMD ["bash", "-c", "\
  echo 'Waiting for DynamoDB...'; \
  until curl -s http://dynamodb:8000 > /dev/null; do \
    echo '.'; \
    sleep 2; \
  done; \
  echo 'DynamoDB is up! Running init-db.js'; \
  node init-db.js"]
