
/*
*Actions:
*Get latLng data from mapQuest API, given City,STATEID
*Get sunrise sunset time using sunrise-sunset API
*Print results in page
*/


//Imports
const express = require('express');
const http = require('http');
const https = require('https');
const bodyParser = require ('body-parser');
const axios = require('axios');

//Inits
const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/', express.static('public'));

//Global consts
const MQKEY = 'NrYb7rVBlGeuct1c86VvX1TwqD4oiUre';
var pos = '';

//Logic. Axios implements asynchronous calls

app.get('/search', function(req, res) {
	const start = async () => {

		//Get input data and prepare location variable
		var city_name = req.query.city_name;
		var state_name = req.query.state_name;
		var location = city_name + "," + state_name;

		console.log('location requested: ' + location);

		if (!city_name || !state_name) {
			res.status(400);
			res.send("Bad request <br><br>"
						+ "<form method='GET' action='/'> <input type='submit' value='Go back'></form>");
		}
		
		//Asynchronous response get position data
		var response = await getPos(location);
		var pos = response.data.results[0].locations[0].latLng;
		
		console.log('App.get LOCATION response: \n' + response + '\n');
		console.log('App.get pos variable:\n' + pos + '\n');

		//Asynchronous response get time data of position
		response = await getTimeData(pos.lat, pos.lng);
		var times = response.data.results;

		console.log('App.get TIMES response: \n' + response + '\n');
		console.log('App.get times variable: \n' + times + '\n');

		if (response) {
			res.send("You searched: " + location + '<br>' + 'lat:' + pos.lat +  ', lng: ' + pos.lng
						+ '<br><br>'
						+ 'Sun rises at: ' + times.sunrise + '<br>'
						+ 'Sun sets at: ' + times.sunset + '<br>'
						+ 'NOTE: All times are in UTC and summer time adjustments are not included in the returned data <br>'
						+ "<br><form method='GET' action='/'> <input type='submit' value='Go back'></form>");
		} else {
			res.send('All went bananas');
		}
	}
	start();
})

//Get complete location data JSON 
async function getPos(location) {
	var url = 'http://www.mapquestapi.com/geocoding/v1/address?key=' + MQKEY + '&location=' + location;
	try {
		//Axios does automatic JSON parse
		return await axios.get(url)
	} catch (err) {
		console.error(err);
	}
}

//Get complete timeData for given location
async function getTimeData(lat, lng) {
	try {		
		var url = 'https://api.sunrise-sunset.org/json?lat=' + lat + '&lng=' + lng +'&date=today';
		return await axios.get(url);
	} catch (err){
		console.error('getTimeData error: \n' + err);
	}
}

app.listen(PORT, function(){
	console.log('Server running on port ', PORT);
})