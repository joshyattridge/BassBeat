var crypto = require('crypto')
var request = require('request')

var ACRdefaultOptions = {
  host: 'identify-eu-west-1.acrcloud.com',
  endpoint: '/v1/identify',
  signature_version: '1',
  data_type: 'audio',
  secure: true,
  access_key: 'f9328e0ffdcc1d53af1b92be0538158c',
  access_secret: 'M0N1Q8UsaFBULT24AIJ0XAAnRrrMfZUHWh8qtN8x'
}
var YTdefaultOptions = {
  host: 'identify-eu-west-1.acrcloud.com',
  endpoint: '/v1/identify',
  signature_version: '1',
  data_type: 'audio',
  secure: true,
  access_key: 'c020b1aece5adec8bc9a4bb55699a275',
  access_secret: 'sRTMZpX8x8vLWycjj5JjIKOZv150Bvq0i1Yv1ZOb'
}

const buildStringToSign = (method, uri, accessKey, dataType, signatureVersion, timestamp) => {
  return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n')
}

const sign = (signString, accessSecret) => {
  return crypto.createHmac('sha1', accessSecret)
    .update(new Buffer.from(signString, 'utf-8'))
    .digest().toString('base64')
}

const identify = (data, options, cb) => {
  var currentData = new Date()
  var timestamp = currentData.getTime() / 1000

  var stringToSign = buildStringToSign('POST',
    options.endpoint,
    options.access_key,
    options.data_type,
    options.signature_version,
    timestamp)

  var signature = sign(stringToSign, options.access_secret)

  var formData = {
    sample: data,
    access_key: options.access_key,
    data_type: options.data_type,
    signature_version: options.signature_version,
    signature: signature,
    sample_bytes: data.length,
    timestamp: timestamp
  }
  request.post({
    url: 'http://' + options.host + options.endpoint,
    method: 'POST',
    formData: formData
  }, cb)
}
exports.detectSong = (soundFile, method) =>
  new Promise(async (resolve, reject) => {
    if (method === 'YT') {
      await identify(new Buffer.from(soundFile, 'base64'), YTdefaultOptions, function (err, httpResponse, body) {
        if (err) reject(err)
        resolve(body)
      })
    } else {
      await identify(new Buffer.from(soundFile, 'base64'), ACRdefaultOptions, function (err, httpResponse, body) {
        if (err) reject(err)
        resolve(body)
      })
    }

  })
