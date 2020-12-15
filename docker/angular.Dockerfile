FROM node:14.15.1-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN ng build
RUN ng run angular-angularmaterial:server
EXPOSE 4200
CMD ["sh", "-c", "npm run e2e-docker && npm run serve:ssr" ]
