FROM node:12.19.0-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN ng build
RUN ng run angular-angularmaterial:server
EXPOSE 4200
CMD ["sh", "-c", "npm run e2e-docker && npm run serve:ssr" ]
