//get contents from .env file
const dotenv = require('dotenv');
dotenv.config();

const fetch = require("node-fetch");

projectData = {};

var path = require('path')
const express = require('express')

//dependencies

const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function (req, res) {
    res.send(projectData)
})

// designates what port the app will listen to for incoming requests
app.listen(8082, function () {
    console.log('Example app listening on port 8082!')
})


const baseURL = 'http://api.weatherbit.io/v2.0/forecast/daily?city=';
const weatherKey = process.env.API_KEY;
const geoKey = process.env.GEO_KEY;
const pixKey = process.env.PIX_KEY;


const data = [];

info = [];
weatherData = [];
pictures = [];

const getInputs = async (req,res) => {
  let data = req.body;
  let city = data.city;
  projectData['city'] = data.city;
  projectData['tripDate'] = data.tripDate
  city = projectData.city

  // geonames api call
  let coords = await fetch(`http://api.geonames.org/postalCodeSearchJSON?placename=${city}${geoKey}`)
  let coords_res = await coords.json();
  let lat = coords_res.postalCodes[0].lat
  let lng = coords_res.postalCodes[0].lng
  
  // weatherbit api call
  let response = await fetch(`${baseURL}&lat=${lat}&lon=${lng}${weatherKey}`);
  let res_json = await response.json();
  //console.log(res_json)
  weatherData.push({res_json})
  


  //pixabay api call
  let pics = await fetch(`https://pixabay.com/api/${pixKey}${city}`)
  let pic_res = await pics.json();
  pictures.push({pic_res})



  res.send(projectData)

}

app.post('/', getInputs)

app.get('/pics', (req,res) =>{
  res.send(pictures)
})

app.get('/data', (req,res) => {
  //res.send(weatherData)
  res.send(projectData)
})

app.get('/weather', (req,res) =>{
  res.send(weatherData)
})


/*
const res = await fetch(url)
    try{
        const data = await res.json();
        return data;
    } catch(error) {
        console.log("error at getWeather", error);
    }
    

*/
