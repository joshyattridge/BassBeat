var YouTube = require('youtube-node')

exports.searchYoutubeApi = (songName, artistName) =>
  new Promise((resolve, reject) => {
    var youTube = new YouTube()
    youTube.setKey('AIzaSyADg3GwGlftEyAU-j9iYdRouzKsmY2e1p8')
    youTube.search((songName + ' by ' + artistName + ' music video'), 1, (error, result) => {
      if (error) {
        reject(error)
      } else {
        if (result.items && result.items.length >= 1) {
          resolve(result.items[0].id.videoId)
        } else {
          reject(error)
        }
      }
    })
  })
