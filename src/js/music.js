/**
 * Persistent Background Music System
 * Manages audio playback across multiple pages using localStorage.
 */

class BackgroundMusic {
    constructor(audioSrc) {
        this.audio = new Audio(audioSrc);
        this.audio.loop = true;
        this.storageKey = 'bg_music_time';
        this.muteKey = 'bg_music_muted';
        
        // Load initial state
        const savedTime = localStorage.getItem(this.storageKey);
        if (savedTime) {
            this.audio.currentTime = parseFloat(savedTime);
        }

        const isMuted = localStorage.getItem(this.muteKey) === 'true';
        this.audio.muted = isMuted;

        // Auto-save time periodically
        setInterval(() => {
            if (!this.audio.paused) {
                localStorage.setItem(this.storageKey, this.audio.currentTime);
            }
        }, 1000);

        // Update storage before page unloads (refresh/navigate)
        window.addEventListener('beforeunload', () => {
            localStorage.setItem(this.storageKey, this.audio.currentTime);
        });
    }

    play() {
        // Start playing immediately if possible
        this.audio.play().catch(err => {
            console.log("Autoplay blocked, waiting for interaction:", err);
            
            // Browsers block auto-play without user interaction
            const startPlay = () => {
                this.audio.play().catch(err => console.log("Still prevented:", err));
                window.removeEventListener('click', startPlay);
                window.removeEventListener('touchstart', startPlay);
            };

            window.addEventListener('click', startPlay);
            window.addEventListener('touchstart', startPlay);
        });
    }

    toggleMute() {
        this.audio.muted = !this.audio.muted;
        localStorage.setItem(this.muteKey, this.audio.muted);
        return this.audio.muted;
    }

    isMuted() {
        return this.audio.muted;
    }
}

export const musicPlayer = new BackgroundMusic('src/music/backsound-angklung.mp3');
