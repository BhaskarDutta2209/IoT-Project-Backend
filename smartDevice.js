var mqtt = require('mqtt')
const express = require('express')
const fetch = require('node-fetch')
// import {fetch} from 'node-fetch'

var app = express()
var PORT = 6000

var sensorData = {
  temperature: 0,
  humidity: 0,
}

var options = {
  host: 'c137467ec1c64631a87a3bb45d1ade42.s1.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts',
  username: 'bhaskar',
  password: 'Test@123',
}

//initialize the MQTT client
var client = mqtt.connect(options)
var dewPoint = 0
//setup the callbacks
client.on('connect', function () {
  console.log('Connected')
})

client.on('error', function (error) {
  console.log(error)
})

client.on('message', function (topic, message) {
  //Called each time a message is received
  //   console.log('Received message:', topic, message.toString())
  sensorData = JSON.parse(message)

  // Processing the Sensor data
  dewPoint = sensorData.temperature - (100 - sensorData.humidity) / 5
  
  console.log(dewPoint)
  
  if (dewPoint <= 55) {
    console.log('COMFORTABLE')
    // Calling the LED ON API
    fetch('http://localhost:8000/turnon', {
      method: 'POST',
    })
  } else {
    // Calling the LED OFF API
    fetch('http://localhost:8000/turnoff', {
      method: 'POST',
    })
    console.log('UNCOMFORTABLE')
  }
})

// subscribe to topic 'my/test/topic'
client.subscribe('my/test/topic')

app.listen(PORT)
