/* ════════════════════════════════════════════════
   VIDEOS.JS - Video Player Controls
════════════════════════════════════════════════ */

function toggleFullscreen() {
  const video = document.getElementById('videoPlayer');
  if (!video) return;
  
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    video.msRequestFullscreen();
  }
}

function minimizeVideo() {
  // Exit fullscreen
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  // Optional: redirect to main page
  // window.location.href = 'index.html';
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  const videoPlayer = document.getElementById('videoPlayer');
  const noContent = document.getElementById('noContent');
  
  if (videoPlayer) {
    // Check if video fails to load
    videoPlayer.addEventListener('error', function() {
      videoPlayer.style.display = 'none';
      if (noContent) noContent.style.display = 'block';
    });

    // Also check when source fails
    const sources = videoPlayer.querySelectorAll('source');
    sources.forEach(function(source) {
      source.addEventListener('error', function() {
        videoPlayer.style.display = 'none';
        if (noContent) noContent.style.display = 'block';
      });
    });
  }

  // Attach button event listeners instead of onclick attributes
  const fullscreenBtn = document.querySelector('button:nth-of-type(1)');
  const minimizeBtn = document.querySelector('button:nth-of-type(2)');
  
  if (fullscreenBtn) {
    fullscreenBtn.removeAttribute('onclick');
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }
  
  if (minimizeBtn) {
    minimizeBtn.removeAttribute('onclick');
    minimizeBtn.addEventListener('click', minimizeVideo);
  }
});
