import $ from 'jquery';

import {lilliput} from './lilliput';
var font = lilliput();


export function pixel() {

  // console.log(zero);

  var matrixSourceEl = $('#matrixSource')[0];
  var mtxCtx = matrixSourceEl.getContext('2d');
  var matrixProjected = $('#matrixProjected')[0];
  var mtxPrjCtx = matrixProjected.getContext('2d');
  mtxCtx.translate(0.5,0.5);
  mtxCtx.webkitImageSmoothingEnabled = false;
  mtxCtx.imageSmoothingEnabled = false;
  mtxCtx.rect(0,0,34,18);
  mtxCtx.strokeStyle = "#ffffff";
  mtxCtx.stroke();



  var currentColor = [255,255,255,255];
  var coloredPixel = mtxCtx.createImageData(1,1);
  coloredPixel.data[0] = currentColor[0]; //red
  coloredPixel.data[1] = currentColor[1]; //green
  coloredPixel.data[2] = currentColor[2]; //blue
  coloredPixel.data[3] = currentColor[3]; //alpha

  var blackPixel = mtxCtx.createImageData(1,1);
  blackPixel.data[0] = 0; //red
  blackPixel.data[1] = 0; //green
  blackPixel.data[2] = 0; //blue
  blackPixel.data[3] = 255; //alpha

  var halfRedPixel = mtxCtx.createImageData(1,1);
  halfRedPixel.data[0] = 255; //red
  halfRedPixel.data[1] = 0; //green
  halfRedPixel.data[2] = 0; //blue
  halfRedPixel.data[3] = 122; //alpha

  var halfBluePixel = mtxCtx.createImageData(1,1);
  halfBluePixel.data[0] = 0; //red
  halfBluePixel.data[1] = 0; //green
  halfBluePixel.data[2] = 255; //blue
  halfBluePixel.data[3] = 122; //alpha

  function fillText(message,startX,startY) {
    var a = message.split("");

    $.each(a,function(msgI,letter){
      var letterData = font[letter];
      var dY = startY + letterData.startY;
      $.each(letterData.dots,function(row,flags){
        var width = letterData.width;
        for (var i=width-1;i>=0;i--) {
          var pixelOn = flags & (1 << i);
          if (pixelOn) {
            mtxCtx.putImageData(coloredPixel,startX + (width-i),dY+row);
          }
        }
      });
      startX += letterData.width + 1;
    });
  }

  function clear() {
    mtxCtx.clearRect(-1,-1,34,18);
    mtxPrjCtx.clearRect(0,0,320,160);
  }

  fillText("test",1,1);

  // setInterval(function(){
  //   var d = new Date();
  //   var seconds = d.getSeconds();
  //   clear();
  //   if (seconds%2 == 0) {
  //     fillText(d.getHours()+":"+d.getMinutes(),1,1);
  //   } else {
  //     fillText(d.getHours()+" "+d.getMinutes(),1,1);
  //   }

  //   blowUp();


  // },1000);

  // mtxCtx.font = "5px Lilliput Steps";
  // mtxCtx.fillText(" 4:40",2,14);

  // mtxCtx.moveTo(12,8);
  // mtxCtx.arc(8,8,4,0,359);
  // mtxCtx.stroke();

  // var imgData = mtxCtx.getImageData(0,0,32,16);
  // var newCanvas = $('<canvas>').attr('width',32).attr('height',16)[0];
  // newCanvas.getContext('2d').putImageData(imgData,0,0);

  // mtxPrjCtx.scale(10,10);
  // mtxPrjCtx.drawImage(newCanvas,0,0);

  function blowUp() {
    for (var col = 1;col < 33;col++) {
      for (var row = 1;row < 17;row++) {
          var imgData = mtxCtx.getImageData(col,row,1,1);
          for (var x = 0;x<10;x++) {
              for (var y = 0;y < 10;y++) {
                  mtxPrjCtx.putImageData(imgData,col*10+x,row*10+y);
              }
          }
      }
    }
  }
}