var express = require('express');
var router = express.Router();
var time = require('time');

var commands = [];

function getTime() {
    var now = new time.Date();
    now.setTimezone('America/Chicago');
    var timeObj = time.localtime(Date.now()/1000);
    var h = timeObj.hours;
    if (h > 12) { h -=12 }
    var m = timeObj.minutes;
    if (m < 10) { m = "0" + m }
    if (timeObj.seconds%2 == 0) {
        return "t"+h+":"+m;
    } else {
        return "t"+h+" "+m;
    }
}

/* GET users listing. */
router.get('/', function(req, res) {
    var command = "";
    if (commands.length > 0) {
        command = commands.shift();
    } else {
        command = getTime();
    }
    res.send("<bof>"+command+"<eof>");
}).post('/',function(req,res){
    if (req && req.body && req.body.command) {
        commands.push(req.body.command);
    }
    console.log(req.body.command);
    backURL=req.header('Referer') || '/';
    res.redirect(backURL);
});

module.exports = router;
