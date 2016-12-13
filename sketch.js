var song;

var serial; // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbmodem1421'; // fill in your serial port name here
var inData; // for incoming serial data
var shouldIbereading = true;
var interval = 8000;
var lastTime; //var to store millis
var currentTime; //timestamp for the last time it checked activity


function preload() {
  song = loadSound('frogs.mp3'); //add sound to the project folder. no spaces in the name.
  console.log("loaded");
}


function setup() {
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event

  serial.list(); // list the serial ports

  createCanvas(400, 300);

  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing

  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port
}


// get the list of ports:
function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    println(i + " " + portList[i]);
  }
}


function serverConnected() {
  println('connected to server.');
}

function portOpen() {
  println('the serial port opened.')
}

function serialEvent() {
  inData = Number(serial.read());

}

console.log("notplaying");

function serialError(err) {
  println('Something went wrong with the serial port. ' + err);
}

function draw() {
  background(0);
  fill(255);
  text("sensor value: " + inData, 30, 30);
  currentTime = millis();

  if (shouldIbereading === true) { // the sensor is set to read
    if (inData == 1) { //if there is movement then it checks
      if (!song.isPlaying()) { //if the song is not playing. if it's not playing, then:
        song.play(); //play the song
        lastTime = millis(); // set lastTime to be millis
        shouldIbereading = false;  // call the sensor to not read
      }
    }
  }





  if (shouldIbereading === false) {  // if the sensor is set not to read, update previous time to millis 
    if (currentTime - lastTime > interval) {  // check timer
      if (inData === 0) {  // if there is no movement
        if (song.isPlaying()) {  // if the song is playing
          song.pause();  // stop the song

          shouldIbereading = true; // reset the sensor to read
        }

      }
    }
  }
}





function portClose() {
  println('The serial port closed.');
}