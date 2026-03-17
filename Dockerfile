#Use Node 22 slim image
FROM node:22-slim  
# Set working directory inside container
WORKDIR /app
#copy package files first for caching
COPY package*.json ./
#Install dependencies using lock file
RUN npm ci
COPY . . 
ENV PORT=5000
CMD [ "node", "app.js" ]