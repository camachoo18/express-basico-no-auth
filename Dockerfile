FROM node:18

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]

# Crear la imagen
# docker build -t node-app .

# Ejecutar la imagen
# docker run -p 3000:3000 node-app