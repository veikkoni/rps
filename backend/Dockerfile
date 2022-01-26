FROM node:16.13.0-alpine3.12
COPY package.json ./
COPY package-lock.json ./
RUN npm install --only=prod
COPY . ./
CMD ["npm", "run", "start"]