FROM node:lts-alpine
RUN apk add dumb-init
ENV NODE_ENV production
COPY . .
RUN npm install
CMD ["dumb-init", "node", "server.js"]
