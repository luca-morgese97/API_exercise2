
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require ('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/', express.static('public'));

app.get('/search', function(req, res) {
	
})

app.listen(PORT, function(){
	console.log('Server running on port ', PORT);
})