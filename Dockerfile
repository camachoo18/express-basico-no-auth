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

# En caso de que de error a la hora de hacer run por tema de versiones, tendremos que borrar node_modules, y crear una build nueva y hacer run de la nueva, teniendo en cuenta que dentro de la extension de docker la hayas borrado.