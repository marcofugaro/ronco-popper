class RoncoButton {
    el = document.querySelector('.ronco-button');
    roncoSound = document.getElementById('ronco-sound');
    
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        this.el.addEventListener('click', this.playRonco.bind(this));
        // this.el.addEventListener('touchstart', (e) => e.target.classList.add('clicked'));    
        // this.el.addEventListener('touchend', (e) => e.target.classList.remove('clicked'));    
    }

    playRonco() {
        this.roncoSound.currentTime = 0;
        this.roncoSound.play();
    }
}

export default new RoncoButton();