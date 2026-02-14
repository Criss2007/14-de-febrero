document.addEventListener("DOMContentLoaded", function() {
    
    // --- ELEMENTOS ---
    const envelopeScreen = document.getElementById('envelopeScreen');
    const letterScreen = document.getElementById('letterScreen');
    const openBtn = document.getElementById('openBtn');
    const goBackBtn = document.getElementById('goBackBtn');
    
    // Elemento del sobre para animarlo
    const envelope = document.querySelector('.envelope');

    // VIDEOS
    const bgVideo = document.getElementById('bgVideo');         
    const videoEnvelope = document.getElementById('videoEnvelope'); 
    
    // --- AUDIOS ---
    const audioSobre = document.getElementById('audioSobre'); 
    const audioCarta = document.getElementById('audioCarta'); 

    // Variables confeti
    let confetiInterval = null; 
    let stopConfetiTimeout = null; 

    // Configuración inicial
    audioSobre.volume = 0.5;
    audioCarta.volume = 1.0;

    // Reproducción inicial segura
    if (videoEnvelope) videoEnvelope.play().catch(e => console.log("Auto-play video prevent", e));

    let playPromise = audioSobre.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            console.log("Esperando interacción.");
        });
    }

    document.body.addEventListener('click', function() {
        if (!envelopeScreen.classList.contains('hidden')) {
            if (audioSobre.paused) audioSobre.play();
            if (videoEnvelope.paused) videoEnvelope.play();
        }
    }, { once: true });


    // --- BOTÓN: ABRIR EL SOBRE (CON ANIMACIÓN PREVIA) ---
    openBtn.addEventListener('click', () => {
        
        // 1. PRIMERO: Activamos la animación visual del sobre
        envelope.classList.add('open'); 
        openBtn.classList.add('fade-out'); // Desaparecemos el botón suavemente

        // 2. SEGUNDO: Esperamos 1.5 segundos para ver la animación
        setTimeout(() => {
            
            // --- AQUI EMPIEZA LA TRANSICIÓN DE PANTALLA ---
            
            // A) LANZAR CONFETI
            lanzarConfeti(); 

            // B) CAMBIO DE PANTALLA
            envelopeScreen.classList.add('hidden');
            letterScreen.classList.remove('hidden');

            // C) EFECTO PANTALLA NEGRA (CINEMA)
            let overlay = document.createElement('div');
            overlay.classList.add('cinema-fade'); 
            document.body.appendChild(overlay);
            setTimeout(() => { overlay.remove(); }, 3000);

            // D) CAMBIO DE AUDIO
            audioSobre.pause();
            audioSobre.currentTime = 0; 
            
            audioCarta.currentTime = 0;
            audioCarta.play().catch(e => console.log("Error audio carta:", e));

            // E) GESTIÓN DE VIDEOS
            if (videoEnvelope) videoEnvelope.pause();
            if (bgVideo) bgVideo.play();

        }, 1500); // <--- ESTOS SON LOS 1.5 SEGUNDOS DE ESPERA
    });


    // --- BOTÓN: VOLVER AL SOBRE ---
    goBackBtn.addEventListener('click', () => {
        // RESETEAR ANIMACIÓN DEL SOBRE
        envelope.classList.remove('open');
        openBtn.classList.remove('fade-out');

        // AUDIO
        audioCarta.pause();
        audioSobre.play().catch(e => console.log("Error audio sobre:", e));

        // VISUAL
        limpiarConfeti();
        letterScreen.classList.add('hidden');
        envelopeScreen.classList.remove('hidden');

        // VIDEOS
        if (bgVideo) {
            bgVideo.pause();
            bgVideo.currentTime = 0;
        }
        if (videoEnvelope) {
            videoEnvelope.play();
        }
    });

    // --- FUNCIONES DE CONFETI (IGUAL QUE ANTES) ---
    function limpiarConfeti() {
        if (confetiInterval) {
            clearInterval(confetiInterval);
            confetiInterval = null;
        }
        if (stopConfetiTimeout) {
            clearTimeout(stopConfetiTimeout);
            stopConfetiTimeout = null;
        }
        if (typeof confetti !== 'undefined') {
            confetti.reset();
        }
    }

    function lanzarConfeti() {
        if (typeof confetti === 'undefined') return;
        limpiarConfeti();
        
        confetti({
            particleCount: 100,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#ff69b4', '#ff0000', '#ffffff'],
            zIndex: 10001
        });

        confetiInterval = setInterval(function() {
            confetti({
                particleCount: 6, 
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.8 },
                colors: ['#ff69b4', '#ffc0cb'],
                zIndex: 10001
            });
            confetti({
                particleCount: 6, 
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.8 },
                colors: ['#ff69b4', '#ffc0cb'],
                zIndex: 10001
            });

            if(Math.random() > 0.8) { 
                confetti({
                    particleCount: 1,
                    shapes: ['text'],
                    shapeOptions: { text: { value: '🌹' } },
                    origin: { x: Math.random(), y: -0.1 }, 
                    gravity: 0.7,
                    scalar: 2, 
                    zIndex: 10001
                });
            }
        }, 600); 

        stopConfetiTimeout = setTimeout(() => {
            if (confetiInterval) {
                clearInterval(confetiInterval);
                confetiInterval = null;
            }
        }, 24000); 
    }
});