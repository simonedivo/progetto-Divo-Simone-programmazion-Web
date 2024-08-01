FROM node:latest
RUN mkdir -p /var/www
WORKDIR /var/www
COPY ./app/package.json /var/www/
RUN npm install
COPY ./app /var/www/
RUN npm install -g nodemon
EXPOSE 3000
cmd ["node", "app.js"]