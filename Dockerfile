FROM node:12.12.0-alpine
RUN mkdir -p /usr/src/app
COPY . /usr/src/app
RUN cd /usr/src/app && yarn add

EXPOSE 80
# ENTRYPOINT ["node", "/usr/src/app/server.js"]
