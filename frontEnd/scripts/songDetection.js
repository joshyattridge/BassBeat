var mic, recorder, soundFile, previous
var listeningActive = false
var checkAutoDetectionLoop
var start_time

function recordSetup(mic) {
  mic = mic
  recorder = new p5.SoundRecorder()
  recorder.setInput(mic)
  soundFile = new p5.SoundFile()
}

$(document).ready(function () {
  $("#micButton").click(function () {
    if ($("#micPrompt").length == 0) {
      $('#songDetectionError').hide()
      $(".icons").each(function (index) {
        $(this).animate({ 'top': 24, 'opacity': 0.8 }, 1000)
      })
      if (listeningActive == false) {
        $("#micButton").css('color', '#A9A9A9')
        listeningActive = true
        listenMusic()
      }
    }
  })
})

function checkAutoDetection() {
  if ($('#autoDetection').prop("checked") == true && $("iframe").length == 0) {
    listenMusic()
  }
}

function listenMusic() {
  clearTimeout(checkAutoDetectionLoop)
  $('iframe').remove()
  $('body').append('<div id="player"></div>')
  listenMusicTransition()
  if (mic.enabled) {
    recorder.record(soundFile)
    setTimeout(
      function () {
        recorder.stop()
        start_time = new Date().getTime()
        detectSong()
      }, 5000)
  }
  checkAutoDetectionLoop = setTimeout(
    function () {
      checkAutoDetection()
    }, 180000)
}

function detectSong() {
  var reader = new window.FileReader()
  reader.readAsDataURL(soundFile.getBlob())
  reader.onloadend = function () {
    base64 = reader.result
    base64 = base64.split(',')[1]
    $.ajax({
      url: 'https://qdojqyawe9.execute-api.eu-west-2.amazonaws.com/baseBeatPostApi',
      type: 'post',
      data: JSON.stringify({
        action: "detectSong",
        soundFile: base64
      }),
      dataType: 'json',
      success: (data) => {
        console.log(data)
        listeningActive = false
        if (data.youtubeId) {
          ytVideoSetup(data.youtubeId, data.currentTime, parseInt(data.songLength), start_time)
        } else {
          finishedListenMusicTransition()
          songDetectionErrorTransition()
        }
      }
    })
  }
}