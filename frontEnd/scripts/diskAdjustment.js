var mic
var volumeList = []
var maxSize = 0
var rippleOpacity = 1

$(document).ready(function () {
  $("#confirmPrompt").click(function () {
    setupMic()
    $('#micPromptWrap').fadeOut("slow", function () {
      $('#micPromptWrap').remove()
      $('#player').remove()
    })

    function setupMic() {
      $('head').append('<script src="scripts/p5/p5.min.js"></script><script src="scripts/p5/addons/p5.sound.min.js"></script>')
      mic = new p5.AudioIn()
      mic.start()
      $("#defaultCanvas0").remove()
      if ($(document).width() > $(document).height()) {
        maxSize = $(document).height() * 0.75
      } else {
        maxSize = $(document).width() * 0.75
      }
      recordSetup(mic)
      micLevel()
    }

    function micLevel() {
      if (mic.enabled) {
        var vol = mic.getLevel() * 1000000000
        if (volumeList.length == 500) {
          volumeList.shift()
        }
        volumeList.push(vol)
        volBoundary = Math.max.apply(Math, volumeList)
        vol = ((maxSize - 200) * (vol / volBoundary) + 200)
      }
      animateSound(vol)
      setTimeout(micLevel, 150)
    }

    function animateSound(vol) {
      $("#diskframe").animate({ width: vol, height: vol }, 100, function () {
        if (vol >= maxSize * 0.8 && $('.ripple').length < 5) {
          $("body").append("<div class='ripple' style='opacity:" + rippleOpacity + "'></div>")
          $(".ripple").animate({ width: $(document).width() - 50, height: $(document).width() - 50, opacity: 0 }, 1000, "linear",
            function () {
              $(this).remove()
            })
        }
      })
    }
  })
})