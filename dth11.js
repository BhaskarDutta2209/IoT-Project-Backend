// Importing libaries
var mqtt = require('mqtt')
const express = require('express')

// Creating a server to simulate our sensor device
var app = express()
var PORT = 4000

// Define the datamodel for our sensor device
var sensorData = {
  temperature: 0,
  humidity: 0,
}

// Define the state of the device (On/OFF) => (true / false)
var isActive = true

// Define the MQTT client configuration (Assignment 4)
var options = {
  host: 'c137467ec1c64631a87a3bb45d1ade42.s1.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts',
  username: 'bhaskar',
  password: 'Test@123',
}

//initialize the MQTT client (Assignment 4)
var client = mqtt.connect(options)

//setup the callbacks (Assignment 4)
client.on('connect', function () {
  console.log('Connected')
})

client.on('error', function (error) {
  console.log(error)
})

// Created API for starting the device simulation
app.post('/start', function () {
  console.log('Starting...')
  isActive = true
  generateData()
})

// Created API for stopping the device simulation
app.post('/stop', function () {
  console.log('Stopping...')
  isActive = false
})

// Created the function that generated the random data
function generateData() {
  randomTemeperature = Math.floor(20 + Math.random() * 40) // 20 - 60 degree Celcius
  randomHumidity = Math.floor(5 + Math.random() * 90) // 5 - 95 RH

  sensorData = {
    temperature: randomTemeperature,
    humidity: randomHumidity,
  }

  // Publishing to MQTT Server
  client.publish('my/test/topic', JSON.stringify(sensorData))
  console.log('Published:', JSON.stringify(sensorData))

  if (isActive) [setTimeout(generateData, 1000)]
}

// Finally listed for any API calls
app.listen(PORT)