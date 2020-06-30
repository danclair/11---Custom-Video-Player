const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]");
const ranges = player.querySelectorAll(".player__slider");
const fullscreen = player.querySelector(".fullscreen");
const grayscalefilter = player.querySelector(".grayscalefilter");
const sepiafilter = player.querySelector(".sepiafilter");
const invertfilter = player.querySelector(".invertfilter");

function togglePlay() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

function updateButton() {
  const icon = this.paused ? "►" : "❚ ❚";
  toggle.textContent = icon;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function toggleFullscreen() {
  console.log("fullscreen time!");
  video.requestFullscreen();
}

function toggleGrayscale() {
  if (video.style.filter != "grayscale(100%)") {
    video.style.filter = "grayscale(100%)";
  } else {
    video.style.filter = "none";
  }
}

function toggleSepia() {
  if (video.style.filter != "sepia(75%)") {
    video.style.filter = "sepia(75%)";
  } else {
    video.style.filter = "none";
  }
}

function toggleInvert() {
  if (video.style.filter != "hue-rotate(180deg)") {
    video.style.filter = "hue-rotate(180deg)";
  } else {
    video.style.filter = "none";
  }
}

// start voice recognition section

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

let p = document.createElement("p");
const words = document.querySelector(".words");
words.appendChild(p);

recognition.addEventListener("result", (e) => {
  const transcript = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");

  p.textContent = transcript;
  if (e.results[0].isFinal) {
    p = document.createElement("p");
    words.appendChild(p);
  }
  if (transcript.includes("play video") && e.results[0].isFinal && video.paused) {
    togglePlay();
  }
  if (transcript.includes("pause video") && e.results[0].isFinal && !video.paused) {
    togglePlay();
  }
  if (transcript.includes("skip forward") && e.results[0].isFinal) {
    video.currentTime += parseFloat(10);
  }
  if (transcript.includes("skip backward") && e.results[0].isFinal) {
    video.currentTime -= parseFloat(10);
  }
  console.log(transcript);
});

recognition.addEventListener("end", recognition.start);

recognition.start();

// Hook up event listeners
video.addEventListener("click", togglePlay);
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
video.addEventListener("timeupdate", handleProgress);

toggle.addEventListener("click", togglePlay);
skipButtons.forEach((button) => button.addEventListener("click", skip));
ranges.forEach((range) => range.addEventListener("change", handleRangeUpdate));
ranges.forEach((range) => range.addEventListener("mousemove", handleRangeUpdate));

let mousedown = false;
progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", (e) => mousedown && scrub(e));
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));

fullscreen.addEventListener("click", toggleFullscreen);
grayscalefilter.addEventListener("click", toggleGrayscale);
sepiafilter.addEventListener("click", toggleSepia);
invertfilter.addEventListener("click", toggleInvert);
