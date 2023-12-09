const axios = require('axios')
const express = require('express')

const app = express()

// Catch Invalid JSON data and send the same as response
app.use(express.json({
    verify : (req, res, buf, encoding) => {
      try {
        JSON.parse(buf);
      } catch(e) {
        res.status(404).send('Invalid JSON');
      }
    }
  })
)

const port = 3000

// Takes city name as argument and returns object with latitude and longitude
// If city is not found returns error
const getLatLong = async (name) => {
    const response = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=1`
    )
    if ( !response.data.results ) 
        return { 
            "error" : true, 
            "description" : "City " + name + " could not be found"
        }
    return {
        "name" : name,
        "latitude" : response.data["results"][0]["latitude"],
        "longitude" : response.data["results"][0]["longitude"],
        "error" : false
    }
}

// Takes latidtude and longitude as arguments and returns current temperature
// Returns error if invalid input is given
const getWeather = async (latitude, longitude) => {
    const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
    )
    if ( response.data.error ) 
        return { 
            "error" : true, 
            "description" : response.data.reason
        }
    return {
        "error" : false,
        "temperature" : response.data.current["temperature_2m"]
    }
}

// POST /getLatLong endpoint that takes JSON data of city
// and returns the latitude and longitude of the city
app.post('/getLatLong', async (req, res) => {
    if ( !Object.hasOwn(req.body, "city") ) {
        res.status(400)
            .send({ "Error" : "Invalid JSON : Payload has to contain property *city*" });
        return;
    }
    const city = req.body["city"];
    const latLong = await getLatLong(city);
    if ( !latLong.error ) {
        res.status(404)
            .send(latLong);
    } else {
        res.status(200)
            .send(latLong);
    }
})

// POST /getWeather endpoint that takes JSON data of cities as array
// and returns the temperaure of each city
app.post("/getWeather", async (req, res) => {

    if ( !Object.hasOwn(req.body, "cities") ) {
        res.status(400)
            .send({ "Error" : "Invalid JSON : Payload has to contain property *cities* as an array" });
        return;
    }

    const cities = req.body["cities"];
    if ( !Array.isArray(cities) ) {
        res.status(400)
            .send({ "Error" : "Invalid JSON : Payload has to contain property *cities* as an array" });
        return;
    }

    let weatherResult = {
        "weather" : {}
    }

    for ( let i=0; i<cities.length; i++ ) {
        const city = cities[i];
        const latLong = await getLatLong(city);
        if ( !latLong.error ) {
            const weather = await getWeather(latLong.latitude, latLong.longitude);
            console.log(weather);
            if ( weather.error ) 
                weatherResult.weather[city] = "error"
            else 
                weatherResult.weather[city] = weather["temperature"] + "C"
        } else {
            weatherResult.weather[city] = "error"
        }
    }

    res.status(200)
        .send(weatherResult);
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})