import fs from 'fs' //allows to read and write form files were gonna create
import path from 'path' //helps build a file path that works in our envoiroment
import dotenv from 'dotenv' //allows us to read from env
import { pathToFileURL } from "url";


dotenv.config() // loads the .env file into the process.env

const DATA_DIR = path.join(import.meta.dirname, 'data') //creating a file called 'data', the rest gives us a path to the folder
if (!fs.existsSync(DATA_DIR)) { //does this data folder exist?
    fs.mkdirSync(DATA_DIR) //says that if it can't see it or if the folder doesnt exist then it will create one
}

const WEATHER_FILE = path.join(DATA_DIR, 'weather.json') //full path to data/weather.json
const LOG_FILE = path.join(DATA_DIR, 'weather_log.csv') // path to data/weather_log.csv

export async function fetchWeather() { //lets other files import this function. async allows you to use await. This function fetches weather data and saves it 
    const apiKey = process.env.WEATHER_API_KEY //reads API key from .env
    const city = process.env.CITY || 'London' //if CITY exists then use it, otherwise deafult to 'London'
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric` //template string

    try { //if anything fails inside here got to 'catch'
        const response = await fetch(url) //sends a request to OpenWeather API, 'await' pauses until response comes back
        if (!response.ok){
            throw new Error(`HTTP error! Status ${response.status}`) // throws an error
        }

        const data = await response.json() //turns the API response into a JavaScript object
        const nowUTC = new Date().toISOString() //creates a timestamp like '2026-03-16T20: 15:30.000Z'
        data._last_updated_utc = nowUTC 
        fs.writeFileSync(WEATHER_FILE, JSON.stringify(data, null, 2)) // writing data object to the weather file, the data is from the api and using the json format to make it into a string. basically making it readable. the 2 is the indentation on the page.

        const header = 'timestamp,city,temperature,description\n' //defines the header row for CSV file
        if(!fs.existsSync(LOG_FILE)) { //checks if the log file exists. if not it writes it and add a header
            fs.writeFileSync(LOG_FILE, header) 
        } else {
            const firstLine = fs.readFileSync(LOG_FILE, "utf8").split('\n')[0] // if it exists then were gonna create the first line and ask the gile system to read the file and split into lines and grab the first ones
            if (firstLine !== 'timestamp,city,temperature,description\n') { // if the first line isnt equal to it we will add it to the file
                fs.writeFileSync(LOG_FILE, header + fs.readFileSync(LOG_FILE, 'utf8')) // it will append into the log file if the first line isnt there, we will add the header 
            }
        }
        const logEntry = `${nowUTC},${city},${data.main.temp},${data.weather[0].description}\n` // this creates a CSV row string
        fs.appendFileSync(LOG_FILE, logEntry) // opens weather_log.csv and adds the new row at the end and DOES NOT overwrite existing data

        console.log(`Weather data updated for ${city} at ${nowUTC}`) //prints a success message
    
    }catch(err){
        console.log('Error fetching weather:', err) //If ANYTHING inside try { ... } throws an error, jump here instead

    }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    fetchWeather();
}