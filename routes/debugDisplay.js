var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/tty.usbserial-A603Q3QZ", {
  baudrate: 115200
}, false); // this is the openImmediately flag [default is true]

serialPort.open(function (error) {
  if ( error ) {
    console.log('failed to open: '+error);
  } else {
    console.log('open');
    serialPort.on('data', function(data) {
      console.log('data received: ' + data);
    });
    setInterval(function(){
      var d = new Date();
      var separator = (d.getSeconds()%2 == 0) ? ":" : " ";
      var timestamp = "t"+d.getHours()+separator+d.getMinutes()+"w90"+String.fromCharCode(247);
      //var timestamp = "t"+d.getHours()+separator+d.getMinutes();
      console.log("timestamp:"+timestamp);
      serialPort.write(timestamp+"\n", function(err, results) {
        console.log('err ' + err);
        console.log('results ' + results);
      });
    },1000);
  }
});