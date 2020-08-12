const express = require('express')
const aes = require('wx-ding-aes')
const app = express()
const crypto = require('crypto');
const encodingAESKey = "fhpuqnmo6mw3l1gvo030tiy0kvpido2zje4nxu8tpdn"
const axios = require('axios')

app.get('/ttt', (req, res) => {
  get_suite_token()
  res.send({
    success: 'ok'
  })
})

app.post('/test', (req, res) => {
  const param = decryptMsg(req.body)
  if (param.EventType === 'tmp_auth_code') {
    test_suite(param.AuthCode)
  }
  console.log(param)
  var timeStamp = ""+parseInt(new Date()/1000)
  var nonce = "aaaaaa"
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

function test_suite(tmp_auth_code) {
  const suite_access_token = get_suite_token()
  const permanentData = get_permanent_code(suite_access_token, tmp_auth_code)
  const res = activate_suite(suite_access_token, permanentData.permanent_code, permanentData.auth_corp_info.auth_corpid)
  console.log(res)
}

//第三方应用凭证
async function get_suite_token() {
  const res = await axios.post('https://oapi.dingtalk.com/service/get_suite_token', {"suite_key": "suite7qgj8mrncxv6g4m6", "suite_secret": "eii7lhdU_xpvhXiC-LlH3SHNTLTYZnIEtWtM-4hmxPlcoUd8OBNFMJpxDgQ7XVYn", "suite_ticket": "suite_ticket"})
  return res.data.suite_access_token
}

// 企业永久授权码
async function get_permanent_code(suite_access_token, tmp_auth_code) {
  const res = await axios.post(`https://oapi.dingtalk.com/service/get_permanent_code?suite_access_token=${suite_access_token}`, {"tmp_auth_code": tmp_auth_code})
  return res.data
}

//激活应用
async function activate_suite(suite_access_token, permanent_code, auth_corpid) {
  const res = await axios.post(`https://oapi.dingtalk.com/service/activate_suite?suite_access_token=${suite_access_token}`, {"suite_key":"suite7qgj8mrncxv6g4m6","auth_corpid": auth_corpid,"permanent_code": permanent_code})
  return res
}

app.listen(8080)

function getRandomStr(strLength) {
  var str = "";
  var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  for (var i = 1; i <= strLength; i++) {
    var random = Math.floor(Math.random() * arr.length);
    str += arr[random];
  }
  return str;
}

function decryptMsg(text) {
  var aes_msg_buffer = new Buffer(text, 'base64');
  var key = new Buffer("fhpuqnmo6mw3l1gvo030tiy0kvpido2zje4nxu8tpdn" + "=", 'base64');
  var iv = key.slice(0, 16);
  var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  var dec = decipher.write(aes_msg_buffer);
  dec = decipher.read();
  var msg_leng_buffer = dec.slice(16, 20);
  var msg_length = msg_leng_buffer.readInt32BE();
  var rand_buffer = dec.slice(20, 20 + msg_length);
  var msg = rand_buffer.toString("utf-8");
  var result = JSON.parse(msg);
  return result;
};

function encrypt_text(text, aes_key, suiteKey) {
  var key = new Buffer(aes_key + "=", 'base64');
  var iv = key.slice(0, 16);
  var random_buffer = new Buffer(getRandomStr(16), 'utf-8');
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
