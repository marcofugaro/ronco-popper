const audioContext = new AudioContext()

// TODO unlock the Web Audio APIs on iOS?
// https://paulbakaus.com/tutorials/html5/web-audio-on-ios/
// https://github.com/pavle-goloskokovic/web-audio-touch-unlock

export function downloadAudio(url) {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
}

export function playAudio(audioBuffer, { looping = false } = {}) {
  const source = audioContext.createBufferSource()
  source.buffer = audioBuffer
  source.connect(audioContext.destination)
  if (looping) {
    source.loop = true
  }
  source.start()
  audioBuffer.isPlaying = true
  audioBuffer.activeSource = source
  source.onended = () => {
    audioBuffer.isPlaying = false
    audioBuffer.activeSource = null
  }
}

export function stopAudio(audioBuffer) {
  if (!audioBuffer.activeSource)
    return

  audioBuffer.activeSource.stop()
}
