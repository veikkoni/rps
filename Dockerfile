FROM node:17.4.0-alpine3.14 as build-stage
WORKDIR /usr/src/app
COPY package.json ./ 
COPY yarn.lock ./
RUN yarn install
COPY . ./
RUN yarn build

FROM nginx:1.21.4-alpine
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]