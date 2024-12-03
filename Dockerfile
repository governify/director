FROM node:lts-alpine

WORKDIR /director

COPY . .

RUN npm install --omit dev && \
    rm -rf $(npm get cache)
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ENTRYPOINT [ "npm", "start" ]