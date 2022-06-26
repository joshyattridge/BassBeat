function listenMusicTransition() {
  $('#listeningSpinner').show()
  $('#disk').animate({ opacity: 1 }, 1000)
}

function finishedListenMusicTransition() {
  $('#listeningSpinner').hide()
  $("#micButton").css('color', '#FFFFFF')
}

function songDetectionErrorTransition() {
  $('#songDetectionError').show()
  setTimeout(
    function () {
      $('#songDetectionError').hide()
    }, 2000)
}

function loadVideoTransition() {
  $('iframe').show()
  $('#disk').animate({ opacity: 0.1 }, 1000)
  rippleOpacity = 0.2
  $(".icons").each(function (index) {
    $(this).animate({ 'top': 72, 'opacity': 0.2 }, 1000)
  })
  $('#closeVideoButton').show()
}

function closeVideoTransition() {
  $('iframe').remove()
  $('body').append('<div id="player"></div>')
  $('#closeVideoButton').hide()
  $('#disk').animate({ opacity: 1 }, 1000)
  $(".icons").each(function (index) {
    $(this).animate({ 'top': 24, 'opacity': 0.8 }, 1000)
  })
  rippleOpacity = 1
}

function openSideNav() {
  $("#settingsCog").css('color', '#A9A9A9')
  $("#settingsCog i").removeClass("fa-cog")
  $("#settingsCog i").addClass("fa-arrow-right")
  $('#mySidenav').animate({ width: "250px" }, 500)
  $('#settingsCog, #playlistCode').animate({ right: "274px" }, 500)
}

function closeSideNav() {
  $("#settingsCog").css('color', '#FFFFFF')
  $("#settingsCog i").removeClass("fa-arrow-right")
  $("#settingsCog i").addClass("fa-cog")
  $('#mySidenav').animate({ width: "0px" }, 500)
  $('#settingsCog, #playlistCode ').animate({ right: "24px" }, 500)
}
