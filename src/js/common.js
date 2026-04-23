import { musicPlayer } from './music.js';

/**
 * Common functionality for all pages.
 */

// Initialize Music Toggle
function initMusicToggle() {
    const audioBtn = document.createElement('button');
    audioBtn.className = 'audio-control';
    audioBtn.setAttribute('title', 'Toggle Music');
    audioBtn.setAttribute('aria-label', 'Toggle Background Music');

    const updateIcon = (isMuted) => {
        // Speaker icon or Muted icon
        audioBtn.innerHTML = isMuted ? 
            `<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>` :
            `<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
    };

    updateIcon(musicPlayer.isMuted());

    audioBtn.addEventListener('click', () => {
        const isMuted = musicPlayer.toggleMute();
        updateIcon(isMuted);
    });

    document.body.appendChild(audioBtn);

    // Initial play prompt (browsers limit autoplay)
    musicPlayer.play();
}

// Auto-init on script load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusicToggle);
} else {
    initMusicToggle();
}
