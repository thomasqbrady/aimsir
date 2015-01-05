var express = require('express');
var router = express.Router();
var http = require('http');

var commands = [];

var cycles = 0;

var currentWeather = "w???";

function getTime() {
    var date = new Date();
    var h = date.getHours();
    if (h > 12) { h -= 12 }
    if (h < 10) { h = " " + h }
    var m = date.getMinutes();
    if (m < 10) {
        m = "0" + m;
    }
    var s = date.getSeconds();
    if (s % 2 == 0) {
        return "t" + h + ":" + m
    } else {
        return "t" + h + " " + m
    }
}

var weatherOptions = {
  //http://api.openweathermap.org/data/2.5/weather?id=4671654&units=imperial
  host: 'api.openweathermap.org',
  path: '/data/2.5/weather?id=4671654&units=imperial'
};

setWeather = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    var weatherJSON = JSON.parse(str);
    currentWeather = "w" + weatherJSON['main']['temp'];
  } );
}


function getWeather() {
    http.request(weatherOptions, setWeather).end();
}

getWeather();

/* GET users listing. */
router.get('/', function(req, res) {
    cycles++;
    if (cycles === 900000) {
        cycles = 0;
        getWeather();
    }
    var command = "";
    if (commands.length > 0) {
        command = commands.shift();
    } else {
        command = getTime() + currentWeather;
    }
    res.send("<bof>"+command+"<eof>");
}).post('/',function(req,res){
    if (req && req.body && req.body.command) {
        commands.push("m"+req.body.command);
    }
    console.log(req.body.command);
    backURL=req.header('Referer') || '/';
    res.redirect(backURL);
});

module.exports = router;
