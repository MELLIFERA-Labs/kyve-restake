# Use an official Node.js runtime as the base image
FROM node:20-alpine
RUN apk add g++ make py3-pip
# Set the working directory inside the container

WORKDIR /usr/src/app/app
COPY app .

WORKDIR /usr/src/app/client

# Copy package.json and package-lock.json to the container
COPY client/package*.json /usr/src/app/client
RUN npm i
COPY client .
RUN npm run build

WORKDIR /usr/src/app/app
# Expose the port on which your Node.js server listens

ENV NODE_ENV='production'
RUN npm ci --only=production
EXPOSE 5000

# Define the command to run your Node.js server
CMD [ "node", "/usr/src/app/app/cli/index.js" ]
