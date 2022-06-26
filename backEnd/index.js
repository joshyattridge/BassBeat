exports.handler = (event, context) => {
  return new Promise(async (resolve, reject) => {
    try {
      var songDetection = require('./songDetection.js')
      var youtubeIdRetrieval = require('./youtubeIdRetrieval.js')
      var awsData = require('./awsData.js')
      var addToBucket = require('./addToBucket.js')
      var output

      switch (event.action) {
        case 'detectSong':
          output = await songDetection.detectSong(event.soundFile, 'YT')
          output = JSON.parse(output)
          if (output.metadata) {
            var musicData = await awsData.checkDatabase(output.metadata.custom_files[0].audio_id)
            resolve({
              currentTime: output.metadata.custom_files[0].play_offset_ms + output.metadata.custom_files[0].sample_end_time_offset_ms,
              youtubeId: musicData.VideoID,
              songLength: musicData.songLength,
              dbInfo: output
            })
          } else {
            output = await songDetection.detectSong(event.soundFile, 'ACR')
            output = JSON.parse(output)
            var songLength = output.metadata.music[0].duration_ms
            var videoId = await youtubeIdRetrieval.searchYoutubeApi(output.metadata.music[0].title, output.metadata.music[0].artists[0].name)
            await addToBucket.uploadToBucket(videoId, output.metadata.music[0].title, output.metadata.music[0].artists[0].name, output.metadata.music[0].acrid)
            var fingerPrintFileUrl = await awsData.uploadToS3(output.metadata.music[0].acrid)
            await awsData.addToDatabase(output.metadata.music[0].acrid, videoId, output.metadata.music[0].title + ' by ' + output.metadata.music[0].artists[0].name, fingerPrintFileUrl, songLength)
            output = await songDetection.detectSong(event.soundFile, 'YT')
            output = JSON.parse(output)
            resolve({
              currentTime: output.metadata.custom_files[0].play_offset_ms + output.metadata.custom_files[0].sample_end_time_offset_ms,
              youtubeId: videoId,
              songLength: songLength,
              dbInfo: output
            })
          }
          break
        default:
          reject(event)
      }
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
}
