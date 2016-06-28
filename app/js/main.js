import hand from './hand';
import mouth from './mouth';
import roncoButton from './roncoButton';

setTimeout(() => {
    if(document.querySelector('.hint'))
        document.querySelector('.hint').className += ' visible';
}, 3000);

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