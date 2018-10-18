
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require ('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/', express.static('public'));

app.post('/search', function(req, res) {
	var city = req.body.city_name;
	var state = req.body.state_name;
	res.send(city +  ", " + state);
})

app.listen(PORT, function(){
	console.log('Server running on port ', PORT);
})