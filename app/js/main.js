import hand from './hand';
import mouth from './mouth';


setTimeout(() => {
    if(document.querySelector('.hint'))
        document.querySelector('.hint').className += ' visible';
}, 3000);


['mousedown', 'touchstart'].forEach((el) => {
    document.querySelector('.ronco-button').addEventListener(el, function() {
        this.classList.add('clicked');
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 50);
    });
})

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/ronco/sw.js', { scope: './' })
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