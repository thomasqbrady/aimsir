var express = require('express');
var router = express.Router();

var commands = [];

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
        commands.push("m"+req.body.command);
    }
    console.log(req.body.command);
    backURL=req.header('Referer') || '/';
    res.redirect(backURL);
});

module.exports = router;
