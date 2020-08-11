FROM node:12.12.0-alpine
RUN mkdir -p /usr/src/app
RUN ls
COPY package.json /usr/src/app
RUN npm install
COPY . /usr/src/app
RUN npm install

EXPOSE 80
ENTRYPOINT ["node", "/usr/src/app/server.js"]
