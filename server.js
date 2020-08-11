const express = require('express')

const app = express()

app.get('/ttt', (req, res) => {
  res.send({
    success: 'ok'
  })
})

app.post('/test', (req, res) => {
  res.send({
    successk: 'ok'
  })
})

app.listen(8080)
