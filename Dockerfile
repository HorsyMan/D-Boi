FROM node:12.16.1
COPY * /root
WORKDIR /root
RUN npm install
CMD [ "node index.js" ]