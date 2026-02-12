document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.querySelector('.envelope');
    const btnOpen = document.getElementById('openBtn');
    const btnBack = document.getElementById('goBackBtn'); // Nuevo botón
    const envelopeScreen = document.getElementById('envelopeScreen');
    const letterScreen = document.getElementById('letterScreen');
    const bgMusic = document.getElementById('bgMusic');

    // --- ACCIÓN DE ABRIR ---
    btnOpen.addEventListener('click', () => {
        // 1. Abrir el sobre
        envelope.classList.add('open');
        
        // 2. Reproducir música
        if(bgMusic) {
            bgMusic.currentTime = 0; // Reinicia la canción
            bgMusic.volume = 0.5;
            bgMusic.play().catch(error => console.log("Audio requiere interacción"));
        }

        // 3. Lanzar confeti
        launchConfetti();

        // 4. Animaciones de pantalla
        btnOpen.style.display = 'none';

        setTimeout(() => {
            envelopeScreen.style.opacity = '0';
            setTimeout(() => {
                envelopeScreen.style.display = 'none';
                letterScreen.classList.remove('hidden');
                letterScreen.style.opacity = '1'; 
            }, 1000);
        }, 1500);
    });

    // --- ACCIÓN DE REGRESAR (NUEVO) ---
    btnBack.addEventListener('click', () => {
        // 1. Ocultar la carta
        letterScreen.classList.add('hidden');
        letterScreen.style.opacity = '0';

        // 2. Mostrar pantalla del sobre
        envelopeScreen.style.display = 'flex';
        // Pequeño delay para permitir que el display flex aplique antes de la opacidad
        setTimeout(() => {
            envelopeScreen.style.opacity = '1';
        }, 10);

        // 3. Cerrar el sobre visualmente (quitar clase open)
        envelope.classList.remove('open');
        
        // 4. Mostrar botón de abrir nuevamente
        btnOpen.style.display = 'block';

        // 5. Detener la música
        if(bgMusic) {
            bgMusic.pause();
            bgMusic.currentTime = 0; // Rebobinar al inicio
        }
    });
});

// Función de Confeti
function launchConfetti() {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInOut(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInOut(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#ff0000', '#ff69b4', '#ffc0cb'],
            shapes: ['heart'] 
        }));
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInOut(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#ff0000', '#ff69b4', '#ffc0cb'],
            shapes: ['heart'] 
        }));
    }, 250);
}

// Corazones flotantes fondo (CSS dinámico)
const style = document.createElement('style');
style.innerHTML = `
    @keyframes floatUp { to { transform: translateY(-110vh) rotate(360deg); } }
`;
document.head.appendChild(style);

function startFloatingHearts() {
    // Esta función la dejamos opcional o la llamamos si queremos que sigan saliendo corazones
    // De momento el CSS 'floating-hearts' ya hace el trabajo si agregamos elementos.
}