import hand from './hand';
import mouth from './mouth';


setTimeout(() => {
    if(document.querySelector('.hint'))
        document.querySelector('.hint').className += ' visible';
}, 3000);

// TODO refactor thi bit
const roncoSound = document.getElementById('ronco-sound');
['mousedown', 'touchstart'].forEach((el) => {
    document.querySelector('.ronco-button').addEventListener(el, function() {
        this.classList.add('clicked');
        roncoSound.pause();
        roncoSound.currentTime = 0;
        roncoSound.play();
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 50);
    });
})

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: './' })
        .then(function(reg) {
            console.log('Service Worker registration successful: ', reg);
        })
        .catch(function(err) {
            console.error('Service Worker registration failed: ', err);
        });

    navigator.serviceWorker.ready.then(function(reg) { 
       console.log('Service Worker ready: ', reg);
    });
}