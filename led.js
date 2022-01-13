const express = require('express')
const app = express()
const PORT = 8000

var ledStatus = false

// Crated API to turn on the LED
app.post("/turnon", function() {
    console.log("Turning on the lighs")
    ledStatus = true
})

// Created AOU to turn off the LED
app.post("/turnoff", function() {
    console.log("Turning off the lighs")
    ledStatus = false
})

// Created API to get the LED status
app.get("/status", function(req, res) {
    console.log("Getting the status")
    res.send({
        "status": ledStatus
    })
})

app.listen(PORT)