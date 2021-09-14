FROM node:14.17.6-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build:ssr
EXPOSE 4200
CMD ["sh", "-c", "npm run e2e:docker && npm run serve:ssr" ]
