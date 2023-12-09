# Simple-Weather-API-Express

A simple API to get weather information using [Open-Meteo API](https://open-meteo.com/). Built using Express.

### 1. Get Latitude and Longitude for a City

#### Endpoint: `POST /getLatLong`

##### Request:

```json
{
    "city": "<city_name>"
}
```

##### Response:

```json
{
    "name": "<city_name>",
    "latitude": 13.08784,
    "longitude": 80.27847,
    "error": false
}
```

### 2. Get Weather Information for Multiple Cities

#### Endpoint: `POST /getWeather`

##### Request:

```json
{
    "cities": ["<city1>", "<city2>", "..."]
}
```

##### Response:

```json
{
    "weather": {
        "<city1>": "27.3C",
        "<city2>": "22.2C",
        "..."
    }
}
```

#### Error Handling:

```json
{
    "error": true,
    "message": "Description of the error."
}
```

---
