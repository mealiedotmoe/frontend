# node alpine 14.8
# https://hub.docker.com/layers/node/library/node/14.8.0-alpine3.11/images/sha256-95562acd0ed9398e21babe6b90fd8ac3974709c9338155e2b4ef1c0824e60be1?context=explore
FROM node@sha256:95562acd0ed9398e21babe6b90fd8ac3974709c9338155e2b4ef1c0824e60be1

# Install git + SSL ca certificates.
# Git is required for fetching the dependencies.
# Ca-certificates is required to call HTTPS endpoints.
RUN apk update && apk add --no-cache git ca-certificates tzdata && update-ca-certificates

# Create appuser and set working dir
RUN adduser -D -g '' appuser
WORKDIR /usr/src/app

# Copy dep files and install
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install

COPY . .

# Build production server
RUN npm run build

# Next setup
EXPOSE 3000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Entrypoint
CMD [ "npm", "start" ]
