document.addEventListener('DOMContentLoaded', () => {

    // ---------- DOM Element Declarations ----------
    const spotifyIframe = document.getElementById('spotify-iframe');
    const spotifyUrlInput = document.getElementById('spotify-url');
    const loadSpotifyBtn = document.getElementById('load-spotify');
    const toggleSpotifyBtn = document.getElementById('toggle-spotify'); 
    const endModal = document.getElementById('end-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const endSound = document.getElementById('end-sound');
    const timeDisplay = document.getElementById('time');
    const startBtn = document.getElementById('start');
    const pauseBtn = document.getElementById('pause');
    const resetBtn = document.getElementById('reset');
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const timerContainer = document.querySelector('.time-container');
    const muteBtn = document.getElementById('mute-btn');
    const themeSelector = document.getElementById('theme-selector');
    const allButtons = [startBtn, pauseBtn, resetBtn];
    const bgVideo = document.getElementById('bg-video');
    const videoSource = document.getElementById('video-source');
    const bgGif = document.getElementById('bg-gif');
    const modeTimerBtn = document.getElementById('mode-timer');
    const modeGifBtn = document.getElementById('mode-gif');
    const modeVideoBtn = document.getElementById('mode-video');
    const spotifyContainer = document.getElementById('spotify-container'); 

    
    //functions
    let timerId = null;
    let timeLeft = 25 * 60;
    let isRunning = false;

    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function updateDisplay() {
        timeDisplay.textContent = formatTime(timeLeft);
        document.title = `${formatTime(timeLeft)} • Study Timer`;
    }

    function getTotalSeconds() {
        const hours = parseInt(hoursInput.value, 10) || 0;
        const minutes = parseInt(minutesInput.value, 10) || 0;
        return (hours * 3600) + (minutes * 60);
    }

    function tick() {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            stopInterval();
            onTimeEnd();
        }
    }

    function startInterval() {
        if (!isRunning) {
            timerId = setInterval(tick, 1000);
            isRunning = true;
        }
    }

    function stopInterval() {
        clearInterval(timerId);
        timerId = null;
        isRunning = false;
    }

    function startTimer() {
        if (!isRunning && timeLeft > 0) {
            startInterval();
        }
    }

    function pauseTimer() {
        stopInterval();
    }

    function resetTimer() {
        stopInterval();
        const totalSeconds = getTotalSeconds();
        timeLeft = totalSeconds > 0 ? totalSeconds : 25 * 60;
        updateDisplay();
    }

    function onTimeEnd() {
        playBell();
        timeDisplay.classList.add('glow');
        setTimeout(() => timeDisplay.classList.remove('glow'), 1000);
        endModal.classList.remove('hidden');
    }

    function playBell() {
        endSound.play().catch(e => console.error("Error playing sound:", e));
    }

    function handleThemeChange() {
        const selectedOption = themeSelector.options[themeSelector.selectedIndex];
        const videoFile = selectedOption.dataset.video;
        const gifFile = selectedOption.dataset.gif;
        const theme = selectedOption.value;

        videoSource.src = videoFile;
        bgVideo.load();
        bgVideo.play().catch(error => console.log("Autoplay was prevented:", error));
        bgGif.src = gifFile;

        const allThemes = ['morning', 'rain', 'sunset', 'village', 'night'];
        allButtons.forEach(button => {
            if (button) {
                button.classList.remove(...allThemes);
                button.classList.add(theme);
            }
        });
    }

    function setMode(mode) {
        if (mode === 'timer') {
            bgVideo.style.display = 'none';
            bgGif.style.display = 'none';
        } else if (mode === 'gif') {
            bgVideo.style.display = 'none';
            bgGif.style.display = 'block';
        } else if (mode === 'video') {
            bgVideo.style.display = 'block';
            bgGif.style.display = 'none';
        }
    }

    function loadPlaylist(playlistUrl) {
        try {
            const playlistId = playlistUrl.split('playlist/')[1].split('?')[0];
            if (playlistId) {
                const newEmbedUrl = `https://open.spotify.com/embed/playlist/${playlistId}`;
                spotifyIframe.src = newEmbedUrl;
                localStorage.setItem('spotifyPlaylistId', playlistId);
                console.log("Spotify playlist saved!");
            }
        } catch (error) {
            console.error("Invalid Spotify URL:", error);
            alert("Please paste a valid Spotify playlist URL.");
        }
    }

    // ---------- Event listeners ----------
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    hoursInput.addEventListener('change', resetTimer);
    minutesInput.addEventListener('change', resetTimer);
    themeSelector.addEventListener('change', handleThemeChange);
    modeTimerBtn.addEventListener('click', () => setMode('timer'));
    modeGifBtn.addEventListener('click', () => setMode('gif'));
    modeVideoBtn.addEventListener('click', () => setMode('video'));

    muteBtn.addEventListener('click', () => {
        if (bgVideo.muted) {
            bgVideo.muted = false;
            muteBtn.textContent = '🔊';
        } else {
            bgVideo.muted = true;
            muteBtn.textContent = '🔇';
        }
    });
    
    closeModalBtn.addEventListener('click', () => {
        endModal.classList.add('hidden');
    });

    loadSpotifyBtn.addEventListener('click', () => {
        const userUrl = spotifyUrlInput.value;
        if (userUrl) {
            loadPlaylist(userUrl);
        }
    });

  
    toggleSpotifyBtn.addEventListener('click', () => { 
        spotifyContainer.classList.toggle('hidden');
    });

    // ---------- Initialize ----------
    resetTimer();
    setMode('video');
    handleThemeChange();

    const savedPlaylistId = localStorage.getItem('spotifyPlaylistId');
    if (savedPlaylistId) {
        const savedEmbedUrl = `https://open.spotify.com/embed/playlist/${savedPlaylistId}`;
        spotifyIframe.src = savedEmbedUrl;
    }
    
});