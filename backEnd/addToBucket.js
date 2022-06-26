const fs = require('fs')
const ytdl = require('ytdl-core')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
var path = require('path')
var crypto = require('crypto')
var request = require('request')
var awsData = require('./awsData.js')

exports.uploadToBucket = async (videoId, videoTitle, artistName, songId) => {
  await downloadYoutubeVideo(videoId)
  await convertSoundToFingerprint()
  await addToBucket(videoTitle, artistName, songId)
}

const downloadYoutubeVideo = (videoId) =>
  new Promise((resolve, reject) => {
    ytdl('http://www.youtube.com/watch?v=' + videoId, { filter: format => format.container === 'mp4' })
      .pipe(fs.createWriteStream('/tmp/songAudio.mp4').on('finish', function () { resolve('done') }))
  })

const convertSoundToFingerprint = () =>
  new Promise((resolve, reject) => {
    exec('./acrcloud_extr_linux -i /tmp/songAudio.mp4; cd /tmp/; ls',
      (error, stdout, stderr) => {
        if (error !== null) {
          console.log(`exec error: ${error}`)
          reject(stderr)
        } else {
          resolve(stdout)
        }
      })
  })

const addToBucket = (videoTitle, artistName, songId) =>
  new Promise(async (resolve, reject) => {
    var title = videoTitle
    var bucketName = 'YoutubeBucket'
    var dataType = 'fingerprint'
    var filePath = '/tmp/songAudio.mp4.db.lo'
    var audioId = songId
    var customFields = { 'artists': artistName }

    const uploadResult = await upload(filePath, bucketName, title, audioId, customFields, dataType)
    uploadResult ? resolve(uploadResult) : reject(uploadResult)

  })

const buildStringToSign = (method, uri, accessKey, signatureVersion, timestamp) => {
  return [method, uri, accessKey, signatureVersion, timestamp].join('\n')
}

const sign = (signString, accessSecret) => {
  return crypto.createHmac('sha1', accessSecret)
    .update(new Buffer.from(signString, 'utf-8'))
    .digest().toString('base64')
}

/**
 * Identifies a sample of bytes
 */
const upload = (filePath, bucket, title, audioId, custom_fields = null, dataType = 'fingerprint') =>
  new Promise(async (resolve, reject) => {
    var timestamp = new Date().getTime() / 1000

    var stringToSign = await buildStringToSign('POST',
      '/v1/audios',
      'ab7af9ef8f3b5151',
      1,
      timestamp)

    var formData = {
      audio_file: {
        value: fs.createReadStream(filePath),
        options: {
          filename: path.basename(filePath),
          contentType: 'fingerprint/lo'
        }
      },
      data_type: dataType,
      bucket_name: bucket,
      title: title,
      audio_id: audioId
    }

    if (custom_fields) {
      var keys = []
      var values = []
      for (var k in custom_fields) {
        keys.push(k)
        values.push(custom_fields[k])
      }
      formData['custom_key[]'] = keys
      formData['custom_value[]'] = values
    }

    console.log('posting audio')
    request.post({
      method: 'POST',
      url: 'https://api.acrcloud.com/v1/audios',
      headers: {
        'access-key': 'ab7af9ef8f3b5151',
        'signature-version': '1',
        signature: await sign(stringToSign, '99c5bc020881f10eba78fb9cdd643038'),
        timestamp: timestamp
      },
      formData: formData
    }, (err, httpResponse, body) => {
      if (err) {
        reject(err)
      } else {
        resolve(body)
      }
    })
  }
  )
