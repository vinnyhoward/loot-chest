export function fadeOutAudio(track: HTMLAudioElement): void {
  const currentTrack = track;
  const maxVolume = 0.6;
  let currentVolume = 0.6;
  for (let i = 0; i < maxVolume; i += 1) {
    currentVolume -= 0.1;
    currentTrack.volume = currentVolume;
  }

  currentTrack.pause();
}

export function fadeInAudio(
  track: HTMLAudioElement,
  isLooped: boolean = false,
): void {
  const currentTrack = track;
  const maxVolume = 0.6;
  let currentVolume = 0.0;
  for (let i = 0; i < maxVolume; i += 1) {
    currentVolume += 0.1;
    currentTrack.volume = currentVolume;
  }
  currentTrack.loop = isLooped;
  currentTrack.play();
}
