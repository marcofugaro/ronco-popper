const audioContext = new AudioContext()

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
