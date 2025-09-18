/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
console.log(
  '👋 This message is being logged by "renderer.js", included via webpack',
);

document.addEventListener('DOMContentLoaded', () => {
  // --- Background Effects (omitted for brevity) ---
  const effectsCanvas = document.getElementById("effects-canvas"), etx = effectsCanvas.getContext("2d"), barrierCanvas = document.getElementById("barrier-canvas"), btx = barrierCanvas.getContext("2d"); let particles = [], barrierLines = []; function resizeAll() { effectsCanvas.width = barrierCanvas.width = window.innerWidth, effectsCanvas.height = barrierCanvas.height = window.innerHeight } window.addEventListener("resize", resizeAll), resizeAll(); class Particle { constructor(t, e, i, s, n, a, h, l = 0) { this.x = t, this.y = e, this.color = i, this.size = s, this.life = n, this.initialLife = n, this.vx = a, this.vy = h, this.gravity = l } update() { this.vy += this.gravity, this.x += this.vx, this.y += this.vy, this.life-- } draw(t) { const e = this.life / this.initialLife; t.globalAlpha = e, t.fillStyle = this.color, t.beginPath(), t.arc(this.x, this.y, this.size, 0, 2 * Math.PI), t.fill(), t.globalAlpha = 1 } } class BarrierLine { constructor() { this.y = Math.random() * window.innerHeight, this.speed = .2 + Math.random() * .5, this.opacity = .05 + Math.random() * .1 } update() { this.y -= this.speed, this.y < 0 && (this.y = window.innerHeight) } draw(t) { t.strokeStyle = `rgba(248, 113, 113, ${this.opacity})`, t.lineWidth = 1, t.beginPath(), t.moveTo(0, this.y), t.lineTo(window.innerWidth, this.y), t.stroke() } } for (let t = 0; t < 50; t++)barrierLines.push(new BarrierLine); let weatherState = 1; setInterval(() => { weatherState = (weatherState + 1) % 3 }, 2e4); function animate() { etx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height), btx.clearRect(0, 0, barrierCanvas.width, barrierCanvas.height), barrierLines.forEach(t => { t.update(), t.draw(btx) }), 1 === weatherState && Math.random() > .3 ? particles.push(new Particle(Math.random() * window.innerWidth, -10, "#bfdbfe", 1, 100, 0, 10, .1)) : 2 === weatherState && Math.random() > .3 && particles.push(new Particle(Math.random() * window.innerWidth, -10, "#e2e8f0", 2 * Math.random() + 1, 200, Math.random() - .5, .8, 0)); for (let t = particles.length - 1; t >= 0; t--)particles[t].update(), particles[t].draw(etx), particles[t].life <= 0 && particles.splice(t, 1); requestAnimationFrame(animate) } animate();

  // --- Music Player Logic ---
  const audioPlayer = document.getElementById('audio-player');
  const coverArt = document.getElementById('player-cover-art');
  const titleEl = document.getElementById('player-title');
  const artistEl = document.getElementById('player-artist');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const playlistEl = document.getElementById('playlist');
  const libraryListEl = document.getElementById('library-list');

  let libraryMusic = [
    { id: 1, title: '幻想のサテライト', artist: 'Butaotome', coverUrl: 'http://34.79.6.219/musicstream/002/cover.jpg', audioUrl: 'http://34.79.6.219/musicstream/002/song.mp3' },
    { id: 2, title: 'The fear is oneself', artist: 'Butaotome', coverUrl: 'http://34.79.6.219/musicstream/001/cover.jpg', audioUrl: 'http://34.79.6.219/musicstream/001/song.mp3' },
    { id: 3, title: '青いミレン、蒼いナミダ', artist: 'Butaotome', coverUrl: 'http://34.79.6.219/musicstream/003/cover.jpg', audioUrl: 'http://34.79.6.219/musicstream/003/song.mp3' },
    { id: 4, title: '少女救世論', artist: 'Akatsuki Records', coverUrl: 'http://34.79.6.219/musicstream/004/cover.jpg', audioUrl: 'http://34.79.6.219/musicstream/004/song.mp3' },

  ];
  let playlistMusic = [libraryMusic[0], libraryMusic[1], libraryMusic[2]]; // Start with a default playlist

  let currentTrackIndex = 0;
  let isPlaying = false;

  function formatTime(seconds) { /* Omitted for brevity */ const m = Math.floor(seconds / 60), s = Math.floor(seconds % 60); return `${m}:${s.toString().padStart(2, "0")}` }

  function loadTrack(index) {
    if (playlistMusic.length === 0) return;
    const track = playlistMusic[index];
    coverArt.src = track.coverUrl;
    titleEl.textContent = track.title;
    artistEl.textContent = track.artist;
    audioPlayer.src = track.audioUrl;

    audioPlayer.onloadedmetadata = () => { durationEl.textContent = formatTime(audioPlayer.duration); };

    document.querySelectorAll('.playlist-item').forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
    currentTrackIndex = index;
  }

  function playTrack() {
    if (playlistMusic.length === 0) return;
    isPlaying = true;
    audioPlayer.play().catch(e => console.error("Audio play failed:", e));
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    coverArt.classList.add('playing');
  }

  function pauseTrack() {
    isPlaying = false;
    audioPlayer.pause();
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    coverArt.classList.remove('playing');
  }

  function renderPlaylist() {
    playlistEl.innerHTML = '';
    if (playlistMusic.length === 0) {
      playlistEl.innerHTML = `<p class="text-gray-400 text-center p-4">Playlist is empty. Add songs from the Library.</p>`;
      titleEl.textContent = "Playlist Empty";
      artistEl.textContent = "...";
      coverArt.src = "https://placehold.co/400x400/0f172a/f8fafc?text=Hakurei+Shrine";
      return;
    }
    playlistMusic.forEach((song, index) => {
      const div = document.createElement('div');
      div.className = 'playlist-item list-item flex items-center p-3 cursor-pointer';
      div.dataset.index = index;
      div.innerHTML = `
                    <div class="flex-grow flex items_baseline gap-2">
                        <div class="flex-shrink-0">
                            <img src="${song.coverUrl}" alt="${song.title}" class="w-12 h-12 rounded-md mr-4">
                        </div>
                        <div class="flex-grow">
                            <p class="font-bold text-white">${song.title}</p>
                            <p class="text-sm text-gray-400">${song.artist}</p>
                        </div>
                        <div class="flex-shrink-0">
                            <button class="add-to-playlist-btn text-2xl text-gray-400 hover:text-[var(--accent-red)] transition p-2">
                                <span class="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>
                    </div>
                    `;
      div.addEventListener('click', () => { loadTrack(index); playTrack(); });
      playlistEl.appendChild(div);
    });
  }

  function renderLibrary() {
    libraryListEl.innerHTML = '';
    libraryMusic.forEach((song, index) => {
      const div = document.createElement('div');
      div.className = 'list-item flex items-center p-3';
      div.dataset.id = song.id;
      div.innerHTML = `
                    <div class="flex-grow flex items_baseline gap-2">
                        <div class="flex-shrink-0">
                            <img src="${song.coverUrl}" alt="${song.title}" class="w-12 h-12 rounded-md mr-4">
                        </div>
                        <div class="flex-grow">
                            <p class="font-bold text-white">${song.title}</p>
                            <p class="text-sm text-gray-400">${song.artist}</p>
                        </div>
                        <div class="flex-shrink-0">
                            <button class="add-to-playlist-btn text-2xl text-gray-400 hover:text-[var(--accent-red)] transition p-2">+</button>
                        </div>
                        </div>
                            `;

      const addButton = div.querySelector('.add-to-playlist-btn');
      addButton.addEventListener('click', () => {
        const songExists = playlistMusic.some(pSong => pSong.id === song.id);
        if (!songExists) {
          playlistMusic.push(song);
          renderPlaylist();
          if (playlistMusic.length === 1) loadTrack(0);
          addButton.textContent = '✓';
          addButton.classList.add('text-green-400');
          setTimeout(() => {
            addButton.textContent = '+';
            addButton.classList.remove('text-green-400');
          }, 1500);
        }
      });
      libraryListEl.appendChild(div);
    });
  }

  playPauseBtn.addEventListener('click', () => { if (isPlaying) pauseTrack(); else playTrack(); });

  nextBtn.addEventListener('click', () => {
    if (playlistMusic.length === 0) return;
    currentTrackIndex = (currentTrackIndex + 1) % playlistMusic.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playTrack();
  });

  prevBtn.addEventListener('click', () => {
    if (playlistMusic.length === 0) return;
    currentTrackIndex = (currentTrackIndex - 1 + playlistMusic.length) % playlistMusic.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playTrack();
  });

  audioPlayer.addEventListener('timeupdate', () => { /* Omitted for brevity */ const p = (audioPlayer.currentTime / audioPlayer.duration) * 100; progressBar.style.width = `${p}%`, currentTimeEl.textContent = formatTime(audioPlayer.currentTime) });
  progressContainer.addEventListener('click', (e) => { /* Omitted for brevity */ const t = progressContainer.clientWidth, i = e.offsetX; audioPlayer.duration && (audioPlayer.currentTime = i / t * audioPlayer.duration) });
  audioPlayer.addEventListener('ended', () => { nextBtn.click(); });

  // --- Overlay Logic ---
  const uploadOverlay = document.getElementById('upload-overlay');
  const libraryOverlay = document.getElementById('library-overlay');
  const libraryBtn = document.getElementById('library-btn');
  const closeLibraryBtn = document.getElementById('close-library-btn');
  const openUploadBtn = document.getElementById('open-upload-btn');
  const cancelUploadBtn = document.getElementById('cancel-upload');
  const addSongForm = document.getElementById('add-song-form');

  libraryBtn.addEventListener('click', () => libraryOverlay.classList.remove('hidden'));
  closeLibraryBtn.addEventListener('click', () => libraryOverlay.classList.add('hidden'));
  openUploadBtn.addEventListener('click', () => {
    libraryOverlay.classList.add('hidden');
    uploadOverlay.classList.remove('hidden');
  });
  cancelUploadBtn.addEventListener('click', () => uploadOverlay.classList.add('hidden'));

  [libraryOverlay, uploadOverlay].forEach(overlay => {
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.add('hidden'); });
  });

  addSongForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newSong = {
      id: libraryMusic.length > 0 ? Math.max(...libraryMusic.map(s => s.id)) + 1 : 1,
      title: document.getElementById('song-title').value,
      artist: document.getElementById('song-artist').value,
      coverUrl: document.getElementById('cover-url').value,
      audioUrl: document.getElementById('audio-url').value,
    };
    libraryMusic.push(newSong);
    renderLibrary();
    addSongForm.reset();
    uploadOverlay.classList.add('hidden');
  });

  // Initial Load
  renderPlaylist();
  renderLibrary();
  loadTrack(0);
});
