FROM node:latest
RUN mkdir -p /usr/src/app
COPY . /usr/src/app
RUN cd /usr/src/app && npm install
RUN npm install pm2 -g

EXPOSE 80
CMD ["pm2-runtime", "/usr/src/app/server.js"]
