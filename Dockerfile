FROM node:12.12.0-alpine
RUN mkdir -p /usr/src/app
RUN cd /usr/src/app
RUN ls
RUN npm install

EXPOSE 80
ENTRYPOINT ["node", "/usr/src/app/server.js"]
