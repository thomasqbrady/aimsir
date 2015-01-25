var express = require('express');
var router = express.Router();
var http = require('http');
var font = require('../font/lilliput');

var commands = [];

var cycles = 0;

var currentWeather = "w???";

function Screen(width,height) {
  this.width = width;
  this.height = height;
  this.currentColor = [1,1,1];
  var self = this;
  this.clear = function() {
    self.rows = [];
    for (var i=0;i<height;i++) {
      var row = [];
      for (var j=0;j<width;j++) {
        row.push(0);
      }
      self.rows.push(row);
    }
  }
  this.clear();
  
  this.fillText = function (message,startX,startY) {
    var a = message.split("");

    a.forEach(function(letter,msgI){
      var letterData = font[letter];
      var dY = startY + letterData.startY;
      letterData.dots.forEach(function(flags,row){
        var width = letterData.width;
        for (var i=width-1;i>=0;i--) {
            //mtxCtx.putImageData(coloredPixel,startX + (width-i),dY+row);
          self.rows[dY+row][startX+(width-i)] = (flags & (1 << i)) ? self.currentColor : 0;
          //console.log(letter,startX+(width-i),dY+row);
        }
      });
      startX += letterData.width + 1;
    });
  }
  this.serialize = function() {
    var instructions = {};
    for (var i=0;i<height;i++) {
      for (var j=0;j<width;j++) {
        var pixel = self.rows[i][j];
        if (pixel) {
          if (!instructions[pixel]) {
            instructions[pixel] = [];
          }
          instructions[pixel].push([i,j]);
        }
      }
    }
    return JSON.stringify(instructions);
  }
}



var scr = new Screen(32,16);

scr.fillText("test",1,1);

console.log(scr.rows[1]);

console.log(scr.serialize());

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
    currentWeather = "w" + parseInt(weatherJSON['main']['temp']);
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
