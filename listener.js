var mqtt = require('mqtt')
const express = require('express')

var app = express()
var PORT = 9000

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

//setup the callbacks
client.on('connect', function () {
  console.log('Connected')
})

client.on('error', function (error) {
  console.log(error)
})

client.on('message', function (topic, message) {
  //Called each time a message is received
  console.log('Received message:', topic, message.toString())
  sensorData = JSON.parse(message)
  console.log(sensorData)
})

// subscribe to topic 'my/test/topic'
client.subscribe('my/test/topic')

// app.get('/data', function (req, res) {

//     console.log("data")
// //   client.on('message', function (topic, message) {
// //     //Called each time a message is received
// //     console.log('Received message:', topic, message.toString())
// //     sensorData = JSON.parse(message)

// //     res.send(sensorData)
// //   })
// })

app.listen(PORT)
