FROM node:12.16.3-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build:ssr
EXPOSE 4200
CMD [ "npm", "run", "serve:ssr" ]