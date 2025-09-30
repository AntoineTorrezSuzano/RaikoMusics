import './manage.css';

document.addEventListener('DOMContentLoaded', () => {


    // --- Background Effects ---
    const barrierCanvas = document.getElementById("barrier-canvas");
    const btx = barrierCanvas.getContext("2d");
    let barrierLines = [];

    function resizeCanvas() {
        barrierCanvas.width = window.innerWidth;
        barrierCanvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class BarrierLine {
        constructor() {
            const colors = ['185, 28, 28', '194, 65, 12']; // Dark Red, Dark Orange
            this.y = Math.random() * window.innerHeight;
            this.speed = 0.2 + Math.random() * 0.5;
            this.opacity = 0.05 + Math.random() * 0.1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.y -= this.speed;
            if (this.y < 0) {
                this.y = window.innerHeight;
            }
        }
        draw(ctx) {
            ctx.strokeStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, this.y);
            ctx.lineTo(window.innerWidth, this.y);
            ctx.stroke();
        }
    }

    for (let i = 0; i < 50; i++) {
        barrierLines.push(new BarrierLine());
    }

    function animateBackground() {
        btx.clearRect(0, 0, barrierCanvas.width, barrierCanvas.height);
        barrierLines.forEach(line => {
            line.update();
            line.draw(btx);
        });
        requestAnimationFrame(animateBackground);
    }
    animateBackground();


    // --- Page Logic ---
    const musicListContainer = document.getElementById('music-list-container');
    const loadingMessage = document.getElementById('loading-message');
    const toast = document.getElementById('toast-notification');
    const deleteModal = document.getElementById('delete-modal');
    const deleteModalMessage = document.getElementById('delete-modal-message');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

    let musicLibrary = [];
    let songToDelete = null;

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    function openDeleteModal(song) {
        songToDelete = song;
        deleteModalMessage.textContent = `You are about to permanently delete "${song.title}". This action cannot be undone.`;
        deleteModal.classList.remove('hidden');
    }

    function closeDeleteModal() {
        songToDelete = null;
        deleteModal.classList.add('hidden');
    }

    async function deleteSong() {
        if (!songToDelete) return;

        try {
            const response = await fetch(`http://34.79.6.219/api/music/delete/${songToDelete.id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Failed to delete song.');
            }

            showToast(`"${songToDelete.title}" was deleted.`);

            // Remove from local list and re-render
            musicLibrary = musicLibrary.filter(s => s.id !== songToDelete.id);
            renderMusicList();

        } catch (error) {
            console.error('Error deleting song:', error);
            showToast(error.message || 'An error occurred.');
        } finally {
            closeDeleteModal();
        }
    }

    function renderMusicList() {
        musicListContainer.innerHTML = '';
        if (musicLibrary.length === 0) {
            musicListContainer.innerHTML = `<p class="text-center text-gray-400">Your music library is empty.</p>`;
            return;
        }

        musicLibrary.forEach(song => {
            const div = document.createElement('div');
            div.className = 'list-item flex items-center p-3 rounded-lg';
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
                        <div class="flex items-center space-x-2">
                            <button class="edit-btn text-gray-400 hover:text-white transition p-2 rounded-full hover:bg-white/10 **w-10 h-10 flex items-center justify-center**" title="Edit">
                                <span class="material-symbols-outlined">edit</span>
                            </button>

                            <button class="delete-btn text-gray-400 hover:text-red-400 transition p-2 rounded-full hover:bg-white/10 **w-10 h-10 flex items-center justify-center**" title="Delete">
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    `;

            const editBtn = div.querySelector('.edit-btn');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showToast('Edit functionality is coming soon!');
            });

            const deleteBtn = div.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openDeleteModal(song);
            });

            musicListContainer.appendChild(div);
        });
    }

    async function initialize() {
        try {
            const response = await fetch('http://34.79.6.219/api/music/get/list');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                musicLibrary = result.data.map(song => ({
                    id: song.id,
                    artist: song.artist || 'Unknown Artist',
                    title: song.title || 'Unknown Title',
                    coverUrl: `http://34.79.6.219/musicstream/${song.id}/cover.jpg`,
                }));
            } else {
                throw new Error('API did not return a successful response or data is not an array.');
            }
        } catch (error) {
            console.error("Could not fetch music library:", error);
            musicListContainer.innerHTML = `<p class="text-center text-red-400">Could not load music library. Please try again later.</p>`;
            musicLibrary = [];
        } finally {
            loadingMessage.remove();
            renderMusicList();
        }
    }

    // Modal event listeners
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    confirmDeleteBtn.addEventListener('click', deleteSong);
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });

    initialize();
});