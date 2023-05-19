FROM node:16-alpine3.16 as build
WORKDIR /usr/app
COPY . /usr/app
RUN yarn
RUN yarn build

FROM nginx:1.23.1-alpine
EXPOSE 80
COPY ./docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/app/build /usr/share/nginx/html