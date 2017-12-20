import 'gsap'
import './vendor/MorphSVGPlugin.min'
import hand from './hand'
import { downloadAudio, playAudio } from './vendor/audio-utils'

class Mouth {
  el = document.querySelectorAll('.mouth-up, .mouth-down')

  tl = null
  isSucking = false
  mouthX = 0
  lipProgress = 0

  gaggingSound = null
  popSound = null

  constructor() {
    const duration = 0.4
    const ease = Power3.easeOut

    downloadAudio('sounds/pop.mp3')
      .then((audioBuffer) => {
        this.popSound = audioBuffer
      })

    downloadAudio('sounds/gagging.mp3')
      .then((audioBuffer) => {
        this.gaggingSound = audioBuffer
      })

    this.tl = new TimelineMax({ paused: true })
      .add('open')
      .to('.mouth-open .lip-black-lower', duration, { morphSVG: '.mouth-gagging .lip-black-lower', ease: ease }, 'open')
      .to('.mouth-open .lip-black-upper', duration, { morphSVG: '.mouth-gagging .lip-black-upper', ease: ease }, 'open')
      .to('.mouth-open .lip-red-lower', duration, { morphSVG: '.mouth-gagging .lip-red-lower', ease: ease }, 'open')
      .to('.mouth-open .lip-red-upper', duration, { morphSVG: '.mouth-gagging .lip-red-upper', ease: ease }, 'open')
      .to('.mouth-open .outline', duration, { morphSVG: '.mouth-gagging .outline', ease: ease }, 'open')
      .to('.mouth-open .teeth', duration, { morphSVG: '.mouth-gagging .teeth', ease: ease }, 'open')
      .add('gagging')
      .to('.mouth-open .lip-black-lower', duration, { morphSVG: '.mouth-sucking .lip-black-lower' }, 'gagging')
      .to('.mouth-open .lip-black-upper', duration, { morphSVG: '.mouth-sucking .lip-black-upper' }, 'gagging')
      .to('.mouth-open .lip-red-lower', duration, { morphSVG: '.mouth-sucking .lip-red-lower' }, 'gagging')
      .to('.mouth-open .lip-red-upper', duration, { morphSVG: '.mouth-sucking .lip-red-upper' }, 'gagging')
      .to('.mouth-open .teeth', duration, { morphSVG: '.mouth-sucking .teeth' }, 'gagging')
      .add('sucking')
  }

  startSucking() {
    this.isSucking = true

    this.tl.timeScale(1).tweenTo('gagging')
  }

  stopSucking() {
    this.isSucking = false

    playAudio(this.popSound)

    this.tl.timeScale(2).tweenTo('open')

    clearInterval(hand.popCheckInterval)
    hand.popCheckInterval = null
    hand.oldKeyframeX = hand.keyframeX = 0

    hand.isLerping = true
    setTimeout(() => { hand.isLerping = false }, 500)

    TweenMax.to(this.el, hand.easeStrength, { x: 0 })
  }

  followFinger() {
    // let's move th mouth
    this.mouthX = - Math.pow(hand.triggerX - hand.totalDistanceX, 1/2.5) * 1.2
    TweenMax.to(this.el, hand.easeStrength, { x: this.mouthX })

    // let's close the mouth more
    this.lipProgress = Math.pow(hand.triggerX - hand.totalDistanceX, 1/2.5) * 2
    this.tl.progress(0.5 + this.lipProgress / 100)
  }
}

export default new Mouth()
