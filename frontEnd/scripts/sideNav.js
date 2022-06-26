/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
var sideNavOpen = false

$(document).ready(function () {
  $("#autoDetection").click(function () {
    checkAutoDetection()
  })

  $("#settingsCog").click(function () {
    if (sideNavOpen == false && $("#micPrompt").length == 0) {
      openSideNav()
      sideNavOpen = true
    } else {
      closeSideNav()
      sideNavOpen = false
    }
  })

  function fullScreenChecker() {
    if (window.innerHeight == screen.height) {
      $("#fullScreen").prop("checked", true)
    } else {
      $("#fullScreen").prop("checked", false)
    }
  }

  $("#fullScreen").click(function (evt) {
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
      if (document.body.requestFullScreen) {
        document.body.requestFullScreen()
      } else if (document.body.mozRequestFullScreen) {
        document.body.mozRequestFullScreen()
      } else if (document.body.webkitRequestFullScreen) {
        document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
      } else if (document.body.msRequestFullscreen) {
        document.body.msRequestFullscreen()
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
  })

  $(window).on('resize', function () {
    fullScreenChecker()
  })

  $("#closeVideo").click(function () {
    closeVideoTransition()
  })
})