FROM node:12.18.3-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./ ./
EXPOSE 4200
CMD [ "npm", "run", "ssr" ]
