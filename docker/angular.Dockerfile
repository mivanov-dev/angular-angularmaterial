FROM node:12.18.3-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./ ./
RUN npm install
EXPOSE 4200
CMD ["sh", "-c", "npm run e2e-docker && npm run ssr" ]
