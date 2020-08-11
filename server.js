const express = require('express')
const aes = require('wx-ding-aes')
const app = express()
const crypto = require('crypto');
const encodingAESKey = "fhpuqnmo6mw3l1gvo030tiy0kvpido2zje4nxu8tpdn"

app.get('/ttt', (req, res) => {
  res.send({
    success: 'ok'
  })
})

app.post('/test', (req, res) => {
  var timeStamp = ""+parseInt(new Date()/1000);
  var nonce = "aaaaaa";
  var encrypt = encrypt_text('success', 'fhpuqnmo6mw3l1gvo030tiy0kvpido2zje4nxu8tpdn', 'suite7qgj8mrncxv6g4m6')
  var token = 'sdfasfssa'
  const arr = [timeStamp, nonce, token, encrypt]
  const msg_signature = signature_arr(arr)
  res.send({
    msg_signature:msg_signature,
    timeStamp:timeStamp,
    nonce:nonce,
    encrypt:encrypt
  })
})

app.listen(8080)

function encrypt_text(text, aes_key, suiteKey) {
  var key = new Buffer(aes_key + "=", 'base64');
  var iv = key.slice(0, 16);
  var random_buffer = new Buffer('aaaaaa', 'utf-8');
  var buffer = new Buffer(text, 'utf-8');
  var length_buffer = new Buffer(4);
  length_buffer.writeUInt32BE(buffer.length, 0);
  var corpidBytes = new Buffer(suiteKey, 'utf-8');
  var newBuffer = Buffer.concat([random_buffer, length_buffer, buffer, corpidBytes]);
  var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  //cipher.write(newBuffer);
  //var dec = cipher.read();
  var cipheredMsg = Buffer.concat([cipher.update(/*encoded*/newBuffer), cipher.final()]);
  return cipheredMsg.toString('base64');
};

function signature_arr(arr) {
  arr.sort();
  var str = "";
  for (var i = 0; i < arr.length; i++) {
    str += arr[i];
  }
  var sha1 = crypto.createHash('sha1');
  sha1.update(str);
  var msg_signature = sha1.digest('hex');
  return msg_signature;
};
