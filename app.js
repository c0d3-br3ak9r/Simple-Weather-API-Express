const axios = require('axios')
const express = require('express')

const app = express()
app.use(express.json())
const port = 3000

const getLatLong = async (name) => {
    const response = await axios.get("https://geocoding-api.open-meteo.com/v1/search?name=" + name + "&count=1")
    if ( !response.data.results ) 
        return { 
            "success" : 0, 
            "description" : "City " + name + " could not be found"
        }
    return {
        "name" : name,
        "latitude" : response.data["results"][0]["latitude"],
        "longitude" : response.data["results"][0]["longitude"],
        "success" : 1
    }
}

app.post('/getll', async (req, res) => {
    const city = req.body["city"];
    const latLong = await getLatLong(city);
    if ( !latLong.success ) {
        res.status(404)
            .send(latLong);
    } else {
        res.status(200)
            .send(latLong);
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})