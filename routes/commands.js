var express = require('express');
var router = express.Router();

var commands = [];

function getTime() {
    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    if (m < 10) {
        m = "0" + m;
    }
    var s = date.getSeconds();
    if (h > 12) { h -= 12 }
    if (s % 2 == 0) {
        return "" + h + ":" + m
    } else {
        return "" + h + " " + m
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
    res.send(command);
}).post('/',function(req,res){
    if (req && req.body && req.body.command) {
        commands.push(req.body.command);
    }
    console.log(req.body.command);
    backURL=req.header('Referer') || '/';
    res.redirect(backURL);
});

module.exports = router;
