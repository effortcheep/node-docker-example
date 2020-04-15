FROM node:12.12.0
RUN mkdir -p /usr/src/app
COPY package.json /usr/src/app
RUN npm install
COPY . /usr/src/app

EXPOSE 80
ENTRYPOINT ["cd", "/usr/src/app"]
ENTRYPOINT ["node", "server.js"]
