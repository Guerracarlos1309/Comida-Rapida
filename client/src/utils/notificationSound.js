let sharedAudioCtx = null;

/**
 * Plays a clear two-tone chime using Web Audio API so admin alerts work offline
 * without relying on external MP3 URLs.
 */
export function playOrderAlertSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }

    const now = sharedAudioCtx.currentTime;
    const notes = [
      { freq: 880, start: 0, duration: 0.16 },
      { freq: 1174.66, start: 0.14, duration: 0.28 },
    ];

    notes.forEach(({ freq, start, duration }) => {
      const osc = sharedAudioCtx.createOscillator();
      const gain = sharedAudioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0.001, now + start);
      gain.gain.exponentialRampToValueAtTime(0.22, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

      osc.connect(gain);
      gain.connect(sharedAudioCtx.destination);
      osc.start(now + start);
      osc.stop(now + start + duration);
    });
  } catch (err) {
    console.warn('No se pudo reproducir el sonido de notificación:', err);
  }
}
