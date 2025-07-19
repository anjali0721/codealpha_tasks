const songs = [
  {
    title: "Acoustic Breeze",
    artist: "Bensound",
    file: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3"
  },
  {
    title: "Creative Minds",
    artist: "Bensound",
    file: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3"
  },
  {
    title: "Sunny",
    artist: "Bensound",
    file: "https://www.bensound.com/bensound-music/bensound-sunny.mp3"
  },
  {
    title: "Energy",
    artist: "Bensound",
    file: "https://www.bensound.com/bensound-music/bensound-energy.mp3"
  },
  {
    title: "Jazzy Frenchy",
    artist: "Bensound",
    file: "https://www.bensound.com/bensound-music/bensound-jazzyfrenchy.mp3"
  },
  {
    title: "Going Higher",
    artist: "Bensound",
    file: "https://www.bensound.com/bensound-music/bensound-goinghigher.mp3"
  }
];

let currentSong = 0;
let isShuffling = false;
let isLooping = false;

const audio = document.getElementById('audio');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const playPauseBtn = document.getElementById('playPause');
const currentTimeDisplay = document.getElementById('currentTime');
const totalDurationDisplay = document.getElementById('totalDuration');
const playlistEl = document.getElementById('playlist');
const progressBar = document.getElementById('progressBar');
const volumeSlider = document.getElementById('volumeSlider');

function loadSong(index) {
  const song = songs[index];
  audio.src = song.file;
  title.textContent = song.title;
  artist.textContent = song.artist;

  document.querySelectorAll('.playlist li').forEach((li, i) => {
    li.classList.toggle('active', i === index);
  });
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = "⏸️";
  } else {
    audio.pause();
    playPauseBtn.textContent = "▶️";
  }
}

function nextSong() {
  if (isShuffling) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * songs.length);
    } while (newIndex === currentSong);
    currentSong = newIndex;
  } else {
    currentSong = (currentSong + 1) % songs.length;
  }
  loadSong(currentSong);
  audio.play();
  playPauseBtn.textContent = "⏸️";
}

function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  audio.play();
  playPauseBtn.textContent = "⏸️";
}

audio.addEventListener('timeupdate', () => {
  const current = audio.currentTime;
  const total = audio.duration;
  progressBar.value = (current / total) * 100 || 0;

  currentTimeDisplay.textContent = formatTime(current);
  totalDurationDisplay.textContent = formatTime(total);
});

progressBar.addEventListener('input', () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

audio.addEventListener('ended', () => {
  if (isLooping) {
    audio.currentTime = 0;
    audio.play();
  } else {
    nextSong();
  }
});

function setupPlaylist() {
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = `${song.title} — ${song.artist}`;
    li.onclick = () => {
      currentSong = index;
      loadSong(index);
      audio.play();
      playPauseBtn.textContent = "⏸️";
    };
    playlistEl.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupPlaylist();
  loadSong(currentSong);
  audio.volume = volumeSlider.value;

  // Add shuffle and loop buttons dynamically
  const controlPanel = document.querySelector('.controls');
  const shuffleBtn = document.createElement('button');
  const loopBtn = document.createElement('button');
  shuffleBtn.innerText = '🔀';
  loopBtn.innerText = '🔁';

  shuffleBtn.onclick = () => {
    isShuffling = !isShuffling;
    shuffleBtn.style.opacity = isShuffling ? 1 : 0.5;
  };

  loopBtn.onclick = () => {
    isLooping = !isLooping;
    loopBtn.style.opacity = isLooping ? 1 : 0.5;
  };

  controlPanel.appendChild(shuffleBtn);
  controlPanel.appendChild(loopBtn);
});
