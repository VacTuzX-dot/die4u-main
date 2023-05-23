document.addEventListener("DOMContentLoaded", function () {
  var video = document.querySelector("video");
  video.volume = 0.8;

  var lyricElement = document.querySelector(".lyrics");

  fetch("lyric.lrc")
    .then((response) => response.text())
    .then((lyrics) => {
      // Split the lyrics by line breaks
      var lines = lyrics.split("\n");

      // Create an array to store the time and lyric pairs
      var lyricData = [];

      // Parse the lines of the LRC file
      lines.forEach((line) => {
        // Extract the timestamp and lyric from each line
        var matches = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.+)/);
        if (matches) {
          var minutes = parseInt(matches[1]);
          var seconds = parseInt(matches[2]);
          var milliseconds = parseInt(matches[3]);
          var timestamp = (minutes * 60 + seconds) * 1000 + milliseconds;
          var lyric = matches[4];

          // Add the timestamp and lyric pair to the array
          lyricData.push({ timestamp, lyric });
        }
      });

      function updateLyrics() {
        var currentTime = video.currentTime * 1000;

        // Find the current lyric based on the current time
        var currentLyric = lyricData.find(
          (data) => data.timestamp >= currentTime
        );

        if (currentLyric) {
          lyricElement.innerText = currentLyric.lyric;
        } else {
          lyricElement.innerText = "";
        }

        // Check if the current time is at or after 15 seconds (15000 milliseconds)
        var targetTime = 15000;
        if (currentTime >= targetTime) {
          video.autoplay;
        }
      }

      // Update the lyrics when the video time updates
      video.addEventListener("timeupdate", updateLyrics);

      // Update the lyrics when the video is seeked
      video.addEventListener("seeked", updateLyrics);
    })
    .catch((error) => {
      console.error("Failed to load lyrics:", error);
    });
});
