const express = require('express')
const aes = require('wx-ding-aes')
const app = express()

const encodingAESKey = "fhpuqnmo6mw3l1gvo030tiy0kvpido2zje4nxu8tpdn"

app.get('/ttt', (req, res) => {
  res.send({
    success: 'ok'
  })
})

app.post('/test', (req, res) => {
  const text = 'success'
  const key = 'ajx-app'
  const test = aes.encode(text, encodingAESKey, key)
  res.send({
    encrypt: test
  })
})

app.listen(8080)
