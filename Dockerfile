FROM node:latest
EXPOSE 3000
EXPOSE 5173

COPY . /var/www/
WORKDIR /var/www
    RUN npm install
    CMD ["npm", "run", "dev"]