const AWS = require('aws-sdk');
const fs = require('fs');
AWS.config.update({ region: 'eu-west-2' })
var ddb = new AWS.DynamoDB({ apiVersion: '2012-10-17' })

exports.uploadToS3 = (songId) =>
  new Promise(async (resolve, reject) => {
    // Enter copied or downloaded access ID and secret key here
    const ID = '****'
    const SECRET = '*****'

    // The name of the bucket that you have created
    const BUCKET_NAME = 'basebeatfingerprints'
    const s3 = new AWS.S3({
      accessKeyId: ID,
      secretAccessKey: SECRET
    })
    // Read content from the file
    const fileContent = fs.readFileSync('/tmp/songAudio.mp4.db.lo')

    // Setting up S3 upload parameters
    const params = {
      Bucket: BUCKET_NAME,
      Key: songId + '.mp4.db.lo', // File name you want to save as in S3
      Body: fileContent
    }

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
      if (err) {
        reject(data.Location)
      }
      console.log(`File uploaded successfully. ${data.Location}`)
      resolve(data.Location)
    })
  }
  )

exports.checkDatabase = (songId) =>
  new Promise((resolve, reject) => {
    var params = {
      TableName: 'BaseBeat-videoIDs',
      Key: {
        SongID: { S: songId }
      }
    }
    // Call DynamoDB to read the item from the table
    ddb.getItem(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        if (data.Item === undefined) {
          resolve(false)
        } else {
          console.log(data)
          console.log('timetest', data.Item.songLength.N)
          resolve({
            VideoID: data.Item.VideoID.S,
            songLength: data.Item.songLength.N
          })
        }
      }
    })
  })

exports.addToDatabase = (songId, videoId, songInfo, fingerPrintUrl, songLength) =>
  new Promise((resolve, reject) => {
    console.log(songLength)
    var params
    if (songLength) {
      params = {
        TableName: 'BaseBeat-videoIDs',
        Item: {
          SongID: { S: songId },
          VideoID: { S: videoId },
          SongInfo: { S: songInfo },
          FingerPrintUrl: { S: fingerPrintUrl },
          songLength: { N: JSON.stringify(songLength) }
        }
      }
    } else {
      params = {
        TableName: 'BaseBeat-videoIDs',
        Item: {
          SongID: { S: songId },
          VideoID: { S: videoId },
          SongInfo: { S: songInfo },
          FingerPrintUrl: { S: fingerPrintUrl }
        }
      }
    }

    ddb.putItem(params, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })