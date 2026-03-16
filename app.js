import express from 'express' // run webapage and server
import dotenv from 'dotenv' //used when doing PORT or API keys
import fs, { readFileSync } from 'fs'
import path from 'path' //finds files the right way
import csv from 'csv-parser' //library to read CSV files in Node.js

dotenv.config()

const app = express()

const PORT = process.env.port || 5000

const DATA_DIR = path.join(import.meta.dirname, 'data') //construct path to a data folder relative to the current file
const WEATHER_FILE = path.join(DATA_DIR, 'weather.json') // builds a full path to a file named 'weather.json' inside 'data' folder
const LOG_FILE = path.join(DATA_DIR, 'weather_log.csv') // builds a full path to a CSV file 'weather_log.csv in the same folder

app.use(express.static(path.join(import.meta.dirname, 'public'))) // sets up middleware to serve static files (HTML, CSS, JS) from 'public' folder

app.get('/api/weather', (req, res) => { //when a client sens a GET request to this URL, the funciton inside is exectued.
    if (!fs.existsSync(WEATHER_FILE)) { // chwck 'weather.json' exists
        return res.status(404).json({error: 'Now weather available'})
    }

    try{
        const weatherData = JSON.parse(fs.readFileSync(WEATHER_FILE, 'utf8'))
        res.json(weatherData)
    }catch (err) {
        console.log('Error reading weather.json', err)
        res.status(500).json({error: 'Failed to read weather data'})
    }
    
})
app.get('/api/weather-log', (req, res) => {
    if (!fs.existsSync(LOG_FILE)){
        return res.status(404).json({ error: 'No weather log available'})
    }

    const timestamp = []
    const temperature = []

    fs.createReadStream(LOG_FILE) //opens csv to read line by line
        .pipe(csv()) //converts csv in java script
        .on('data', row => {
            if (row.timestamp && row.temperature) {
                timestamp.push(row.timestamp)
                temperature.push(parseFloat(row.temperature))
            }
        })
        .on('end', () => res.json({timestamp, temperature}))
        .on('error', err => {
            console.log('Error reading CSV:', err)
            res.status(500).json({error: 'Failed to read log'})
        })
})

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT})`);
})