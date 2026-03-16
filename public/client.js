async function loadWeather() {
    try{
        const res = await fetch('/api/weather')
        const weather = await res.json()

        document.getElementById('weather').innerHTML = `
            <h2>${weather.name}</h2>
            <p>Temperature: ${weather.main.temp}C</p>
            <p>Condition: ${weather.weather[0].description}</p>
        `
    } catch (err) {
        document.getElementById('weather').innerHTML = '<p>Failed to load weather data</p>'
        console.log(error)
    }
}

async function loadChart() {
    try{
        const res = await fetch('/api/weather-log')
        const { timestamp, temperature } = await res.json()

        const trace = {
            x: timestamp,
            y: temperature,
            type: 'scatter',
            mode: 'lines+markers',
            line:{
                color: 'purple'
            }
        }

        const layout = {
            title: 'Temperature Over Time',
            xaxis: { title: 'Date', type: 'date'},
            yaxis: { title: 'Temperature C'},
            legend: {orientation: 'h', x:0, y: 1.1}
        }

        Plotly.newPlot('chart', [trace], layout)
    } catch (err) {
        console.error('Failed to load chart', err);
    }
}

loadWeather()
loadChart()