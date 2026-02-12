document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.querySelector('.envelope');
    const btnOpen = document.getElementById('openBtn');
    const btnBack = document.getElementById('goBackBtn');
    
    // Pantallas
    const envelopeScreen = document.getElementById('envelopeScreen');
    const letterScreen = document.getElementById('letterScreen');
    
    // Medios
    const bgMusic = document.getElementById('bgMusic');
    const bgVideo = document.getElementById('bgVideo');

    // --- ABRIR CARTA ---
    btnOpen.addEventListener('click', () => {
        // 1. Animación del sobre
        envelope.classList.add('open');
        btnOpen.style.display = 'none';

        // 2. Intentar reproducir música (con manejo de error)
        if(bgMusic) {
            bgMusic.volume = 0.5;
            // Promesa de play para evitar que bloquee el código si falla
            let playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("El audio no pudo reproducirse automáticamente (posiblemente bloqueado por navegador):", error);
                    // No detenemos el resto del código
                });
            }
        }

        // 3. Confeti
        launchConfetti();

        // 4. Transición a la carta y video
        setTimeout(() => {
            // Desvanecer sobre
            envelopeScreen.style.opacity = '0';
            
            setTimeout(() => {
                // Ocultar pantalla sobre
                envelopeScreen.style.display = 'none';
                
                // Mostrar pantalla carta
                letterScreen.classList.remove('hidden');
                
                // Forzar un pequeño reflow para que la transición CSS funcione
                void letterScreen.offsetWidth; 
                
                // Hacer visible la carta (fade in)
                letterScreen.classList.add('show');
                
                // 5. Reproducir Video
                if (bgVideo) {
                    bgVideo.muted = true; // Asegurar silencio para autoplay
                    bgVideo.currentTime = 0;
                    bgVideo.play().catch(e => console.log("Error video:", e));
                }

            }, 1000); // Tiempo para que desaparezca el sobre
        }, 1500); // Tiempo de espera con el sobre abierto
    });

    // --- REGRESAR ---
    btnBack.addEventListener('click', () => {
        // 1. Ocultar carta
        letterScreen.classList.remove('show');
        
        // Esperar a que se desvanezca antes de ocultar
        setTimeout(() => {
            letterScreen.classList.add('hidden');
            
            // Pausar video
            if (bgVideo) bgVideo.pause();

            // 2. Mostrar sobre
            envelopeScreen.style.display = 'flex';
            // Pequeño delay para el fade in
            setTimeout(() => {
                envelopeScreen.style.opacity = '1';
            }, 50);

            // Resetear sobre
            envelope.classList.remove('open');
            btnOpen.style.display = 'block';

            // Pausar música
            if(bgMusic) {
                bgMusic.pause();
                bgMusic.currentTime = 0;
            }
        }, 500); // Tiempo igual a la transición CSS
    });
});

// Confeti
function launchConfetti() {
    var duration = 3000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
    }, 250);
}