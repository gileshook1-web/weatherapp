# Weateh App - DataOps

## Descritpion
s\gdicsdchi  \sodhci\dcj\zxlc \isdjci\ c\yu

## Installation
- Clone this repo
- on your terminal
    - `cd` to root folder
    - delete data folder to start your own
    - setup `.env` with:
        -`PORT` of your choosing
        - `CITY` of you rchoosing
        - `API_KEY` from open weather
    - `npm i` to install dependencies
    - `node fetchWeather.js` to create/upload data folder
    - `node app.js` to start server
- Open browser on `PORT` to see weather and graph

## Using Docker

- Open Docker Desktop
- Make sure you are on same path as Dockerfile
- On your terminal run:
    - `docker build -t <app-name>:<tag> .` or `docker build -t weatherapp .` - to build docker image based on docker file
    - `docker run -p <local-port>:<container-port> <image-name>` or `docker run -p 3000:5000 weatherapp` - to run a container based on an image

## Tests

We have test to check if files inside the data folder is correct
