const cron = require('node-cron')
const express = require('express')
const mqtt = require('mqtt')

var app = express()
var PORT = 3000

var sensorData = {
  temperature: 0,
  humidity: 0,
}

var status = 'STOP' // START / STOP
var defaultCron = '* * * * *' // Run's once every minute
var task = cron.schedule(defaultCron, () => {})
// var client = mqtt.connect('broker.hivemq.com')

// client.on('connect', function () {
//     console.log('Connected')
// })

function init(temperature, humidity) {
  console.log('Initializing...')
  sensorData = {
    temperature: temperature,
    humidity: humidity,
  }
}

function start() {
  console.log('Starting...')
  status = 'START'

  //   var client = mqtt.connect('mqtt://d011a176.us-east-1.emqx.cloud', {
  //     host: 'c137467ec1c64631a87a3bb45d1ade42.s1.eu.hivemq.cloud',
  //     port: 8883,
  //     protocol: 'mqtts',
  //     username: 'bhaskar',
  //     password: '<your-password>'
  //   })

  // console.log(client);

  var options = {
    host: 'c137467ec1c64631a87a3bb45d1ade42.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'bhaskar',
    password: 'Test@123',
  }

  //initialize the MQTT client
  var client = mqtt.connect(options)

  client.on('connect', function () {
    console.log('Connected')
    randomTemeperature = Math.floor(20 + Math.random() * 40) // 20 - 60 degree Celcius
    randomHumidity = Math.floor(5 + Math.random() * 90) // 5 - 95 RH

    sensorData = {
      temperature: randomTemeperature,
      humidity: randomHumidity,
    }

    console.log(sensorData)

    client.publish('IoTDHT11', JSON.stringify(sensorData))

    return new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
  })
}

function stop() {
  console.log('Stopping...')
  status = 'STOP'
  client.end()
}

function setFrequency(newCron) {
  console.log('Setting frequency...')
  stop()
  defaultCron = newCron
  start()
}

app.get('/start', start)
app.get('/stop', stop)
app.get('/status', function (req, res) {
  res.send(status)
})
app.get('/data', function (req, res) {
  res.send(sensorData)
})

app.listen(PORT)
