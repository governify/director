FROM node:lts-alpine

WORKDIR /director

COPY . .

RUN npm install --omit dev && \
    rm -rf $(npm get cache)
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=3010
ENV PORT $PORT
EXPOSE $PORT

ENTRYPOINT [ "npm", "start" ]