import 'babel-polyfill'
import hand from './hand'
import mouth from './mouth'

// show the hint after a few second
setTimeout(() => {
  if (document.querySelector('.hint'))
    document.querySelector('.hint').classList.add('visible')
}, 3000)

// play the sound of the ronco button
const roncoSound = document.getElementById('ronco-sound')
document.querySelector('.ronco-button').addEventListener('click', () => {
  roncoSound.currentTime = 0
  roncoSound.play()
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: './' })
    .then((reg) => {
      console.log('Service Worker registration successful: ', reg)
    })
    .catch((err) => {
      console.error('Service Worker registration failed: ', err)
    })

  navigator.serviceWorker.ready.then((reg) => {
    console.log('Service Worker ready: ', reg)
  })
}
