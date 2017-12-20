// import 'gsap'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import lerp from './vendor/lerp'
import mouth from './mouth'


const IS_TOUCH = 'ontouchstart' in window

class Hand {
    el = document.querySelector('.hand')
    tip = document.querySelector('.just-the-tip')
    container = document.querySelector('.container')

    elX = 0
    startX = 0
    currentX = 0
    distanceX = 0
    savedDistanceX = 0
    rAF = null

    rotation = 0
    rotationMin = 8
    rotationMax = 20

    isDragging = false
    isLerping = false

    initialEaseStrength = 0.2
    easeStrength = this.initialEaseStrength

    popCheckInterval = null
    popCheckFactor = 40
    oldKeyframeX = 0
    keyframeX = 0

    constructor() {
        this.addEventListeners()

        this.assignContainerWidths()
    }

    addEventListeners() {
        document.addEventListener('touchstart', this.onStart.bind(this))
        document.addEventListener('touchmove', this.onMove.bind(this))
        document.addEventListener('touchend', this.onEnd.bind(this))

        document.addEventListener('mousedown', this.onStart.bind(this))
        document.addEventListener('mousemove', this.onMove.bind(this))
        document.addEventListener('mouseup', this.onEnd.bind(this))

        window.onresize = debounce(this.assignContainerWidths.bind(this), 300)
        window.onresize = debounce(this.resetPositions.bind(this), 300)
    }

    onStart(e) {
        if (!e.target.classList.contains('meat'))
            return

        this.isDragging = true

        var hint = document.querySelector('.hint')
        if(hint) {
            hint.parentNode.removeChild(hint)
        }

        this.startX = e.pageX || e.touches[0].pageX
        this.currentX = this.startX

        // we trigger the audio on user interaction event, so we can call it again in a callback later
        // http://stackoverflow.com/questions/15088638/playing-html5-audio-from-mobile-devices-from-callback
        mouth.popSound.play()
        mouth.popSound.pause()
        mouth.popSound.currentTime = 0
        mouth.gaggingSound.play()
        mouth.gaggingSound.pause()
        mouth.gaggingSound.currentTime = 0
        // TODO use audio apis

        this.rAF = requestAnimationFrame(this.update.bind(this))

        e.preventDefault()
    }

    onMove(e) {
        if(!this.isDragging)
            return

        this.currentX = e.pageX || e.touches[0].pageX
    }

    onEnd(e) {
        this.isDragging = false

        cancelAnimationFrame(this.rAF)

        this.savedDistanceX = this.savedDistanceX + this.distanceX

        // limit savedDistanceX between 0 and maximumX
        // 0 < savedDistanceX < maximumX
        this.savedDistanceX = Math.min(Math.max(this.savedDistanceX, 0), this.maximumX)

        //reset variables
        this.distanceX = 0

        // stop gagging
        if(!mouth.gaggingSound.paused) mouth.gaggingSound.pause()
    }

    update() {
        if(!this.isDragging)
            return

        requestAnimationFrame(this.update.bind(this))

        this.distanceX = this.currentX - this.startX
        this.totalDistanceX = this.savedDistanceX + this.distanceX

        // let's shake the hand, remove the tip and play gagging sound
        if(this.totalDistanceX > this.maximumX) {
            document.addEventListener('touchmove', this.shakeHand.bind(this))
            document.addEventListener('mousemove', this.shakeHand.bind(this))
            this.easeStrength = 0.03
            if(!this.tip.classList.contains('hide')) this.tip.classList.add('hide')
            if(mouth.gaggingSound.paused) mouth.gaggingSound.play()
        } else if(this.rotation !== 0) {
            document.removeEventListener('touchmove', this.shakeHand.bind(this))
            document.removeEventListener('mousemove', this.shakeHand.bind(this))
            this.easeStrength = this.initialEaseStrength
            this.rotation = 0
            if(this.tip.classList.contains('hide')) this.tip.classList.remove('hide')
            if(!mouth.gaggingSound.paused) mouth.gaggingSound.pause()
        }

        // let's pull the mouth
        if(mouth.isSucking && this.totalDistanceX < this.triggerX) {
            mouth.followFinger()

            if(IS_TOUCH) {
                this.totalDistanceX = this.triggerX - Math.pow(this.triggerX - this.totalDistanceX, 1/2.5) * 1.6
            } else {
                this.totalDistanceX = this.triggerX - Math.pow(this.triggerX - this.totalDistanceX, 1/2.5) * 2
            }
        }


        // limit totalDistanceX between 0 and maximumX
        // 0 < totalDistanceX < maximumX
        this.totalDistanceX = Math.min(Math.max(this.totalDistanceX, 0), this.maximumX)

        // let's LERP our transition just after we pop it and on desktop devices
        if(this.isLerping) {
            this.elX = lerp(this.elX , this.totalDistanceX)
        } else if (!IS_TOUCH) {
            this.elX = lerp(this.elX , this.totalDistanceX, 0.4)
        } else {
            this.elX = this.totalDistanceX
        }
        // and we set the transform
        this.el.style.transform = `translate3d(${this.elX}px, -50%, 0) rotate(${this.rotation}deg)`

        // or we could use TweenMax to LERP out transition, but we prefer not to call it inside a requestAnimationFrame for performance reasons
        // TweenMax.to(this.el, this.easeStrength, { x: this.totalDistanceX, rotation: this.rotation })

        // trigger the mouth to close
        if(this.totalDistanceX > this.triggerX && !mouth.isSucking) {
            mouth.startSucking()
        }

        //start the interval to pop it
        if(this.totalDistanceX < this.triggerX && !this.popCheckInterval && mouth.isSucking) {
            this.oldKeyframeX = this.keyframeX = this.triggerX
            this.popCheckInterval = setInterval(this.setPopKeyframes.bind(this), this.popCheckFactor)
        }

        //stop the interval to pop it
        if(this.totalDistanceX > this.triggerX && this.popCheckInterval && mouth.isSucking) {
            clearInterval(this.popCheckInterval)
            this.popCheckInterval = null
            this.oldKeyframeX = this.keyframeX = 0
        }

        // let's pop it if we pull fast
        if((this.oldKeyframeX - this.keyframeX) > this.popDisatanceFactor && mouth.isSucking) {
            mouth.stopSucking()
        }

        // let's pop it anyway if we reach the start of window
        // if(this.currentX < 15 && mouth.isSucking) {
        //  mouth.stopSucking()
        // }
    }

    // recalled on resize
    // TODO make this actually work well
    assignContainerWidths() {
        this.containerWidth = this.container.getBoundingClientRect().width
        this.triggerX = this.containerWidth * 0.505
        this.maximumX = this.containerWidth * 0.54

        if(IS_TOUCH) {
            this.popDisatanceFactor = this.containerWidth * 0.1
        } else {
            this.popDisatanceFactor = this.containerWidth * 0.17
        }
    }

    resetPositions() {
    this.currentX = this.startX = 0
        this.update()
    }

    shakeHand = throttle(() => {
        this.rotation = Math.floor(Math.random() * (this.rotationMax - this.rotationMin + 1)) + this.rotationMin
    }, 40)

    setPopKeyframes() {
        this.oldKeyframeX = this.keyframeX
        this.keyframeX = this.currentX
    }
}

export default new Hand()
