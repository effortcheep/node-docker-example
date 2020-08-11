const express = require('express')

const app = express()

app.post('/test', (req, res) => {
  res.send({
    successk: 'ok'
  })
})

app.listen(8080)
