var videoIdString, duration, startTime, player, songLength

function ytVideoSetup(videoId, durationReceived, songLengthReceived, startTimeReceived) {
  songLength = songLengthReceived
  videoIdString = videoId
  duration = durationReceived
  startTime = startTimeReceived
  onYouTubeIframeAPIReady()
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '100%',
    width: '100%',
    videoId: videoIdString,
    playerVars: { 'autoplay': 1, 'controls': 0, 'mute': 1, 'rel': 0, 'showinfo': 0, 'ecver': 2, 'fs': 0, 'modestbranding': 0, 'origin': window.location.origin },
    events: {
      'onError': onPlayerError,
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  })
  $('iframe').hide()
}

function onPlayerReady(event) {
  event.target.playVideo()
  duration = parseFloat((duration / 1000) + ((new Date().getTime() - startTime) / 1000))
  player.seekTo(duration)
  //stop video when song finishes
  //   setTimeout(
  //     function () {
  //       player.stopVideo()
  //       closeVideoTransition()
  //       checkAutoDetection()
  //     }, songLength - duration)
}

function onPlayerError(event) {
  finishedListenMusicTransition()
  if (event.data === 150) {
    closeVideoTransition()
    songDetectionErrorTransition()
  }
}

function onPlayerStateChange(event) {
  finishedListenMusicTransition()
  if (event.data === 0) {
    closeVideoTransition()
    checkAutoDetection()
  } else if (event.data === 1) {
    loadVideoTransition()
    closeSideNav()
  } else if (event.data === 2) {
    event.target.playVideo()
  }
}