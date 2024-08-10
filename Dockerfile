FROM node:latest
RUN mkdir -p /var/www
WORKDIR /var/www
    COPY . /var/www/
    RUN npm install
    EXPOSE 3000
    EXPOSE 5173
    CMD ["npm", "run", "dev"]