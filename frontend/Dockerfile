FROM node:24-alpine

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

# Use --host 0.0.0.0 to bind to all interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

EXPOSE 5173