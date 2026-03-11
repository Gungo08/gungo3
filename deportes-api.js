/* ========================================================
   MOTOR API YOUTUBE - GUNGO DEPORTES (Nivel Staff Blindado)
   ======================================================== */
(function() { // <-- APERTURA DEL ESCUDO DE SEGURIDAD

    // 1. INICIALIZACIÓN DE FIREBASE (Esencial para que funcione la base de datos)
    var firebaseConfig = {
        apiKey: "AIzaSyBv849w6NNk_4QhOnaY3x7LOE38apvc6o4",
        authDomain: "gungo-tv.firebaseapp.com",
        projectId: "gungo-tv",
        storageBucket: "gungo-tv.firebasestorage.app",
        messagingSenderId: "132166094948",
        appId: "1:132166094948:web:0ca391d2dc20306e85cf71",
        measurementId: "G-MFNZH83Y1X"
    };

    if (typeof firebase !== 'undefined' && !firebase.apps.length) { 
        firebase.initializeApp(firebaseConfig); 
    }

    // 2. ACTIVAR VALIDACIÓN DE IDENTIDAD ANÓNIMA
    if (typeof firebase !== 'undefined') {
        firebase.auth().signInAnonymously()
          .then((userCredential) => {
            console.log("✅ Conexión segura establecida en Deportes con ID:", userCredential.user.uid);
          })
          .catch((error) => console.error("Error de acceso:", error.message));
    }

    // 3. DECLARACIÓN ÚNICA DE LA BASE DE DATOS
    const db = (typeof firebase !== 'undefined') ? firebase.firestore() : null;

    // ========================================================
    // ☁️ MOTOR DE INTERACCIONES SEGURAS EN LA NUBE (PÚBLICO)
    // ========================================================
    window.registrarInteraccionSegura = async function(coleccion, documentoId, campo) {
        if (!db) return;
        
        const user = firebase.auth().currentUser;
        if (!user) {
            if(window.showToast) window.showToast("⏳ Validando conexión... intenta de nuevo");
            return;
        }

        const docRef = db.collection(coleccion).doc(documentoId);

        try {
            await db.runTransaction(async (transaction) => {
                const doc = await transaction.get(docRef);
                const data = doc.data() || { usuarios: [] };

                // ESTA LÍNEA ES LA MAGIA: Bloquea si el ID del usuario ya está en la lista
                if (data.usuarios && data.usuarios.includes(user.uid)) {
                    if(window.showToast) window.showToast("⚠️ Ya hemos registrado tu reacción aquí");
                    return;
                }

                transaction.set(docRef, {
                    [campo]: (data[campo] || 0) + 1,
                    usuarios: firebase.firestore.FieldValue.arrayUnion(user.uid)
                }, { merge: true });

                if(window.showToast) window.showToast("✅ ¡Like real registrado!");
            });
        } catch (e) {
            console.error("Fallo de red al registrar interacción:", e);
        }
    };

    // ========================================================
    // 📺 LÓGICA DE YOUTUBE API PARA DEPORTES
    // ========================================================
    const YOUTUBE_API_KEY = "AIzaSyDkp3j998hkGt6eHawy3P0cxePG82r8CUY"; // Llave de Google

    const CANALES_OFICIALES = {
        nfl: "UCDVYQ4Zhbm3S2dlz7P1GBDg",      
        mlb: "UC08mnbiC4FykqpHqbEWgFcg",      
        nba: "UCWJ2lWNubArHWmf3FIHbfcQ",      
        futbol: "UC08mnbiC4FykqpHqbEWgFcg",  // <-- CORREGIDO: Se eliminó el espacio en blanco que causaba el Error 400
        nhl: "UCe1MWsy0RHgxEM4kbsjLtbA",      
        voleibol: "UCGP7V-7K1xVb1eE3b2iNXXg", 
        tenis: "UC-2hhqBG5Su7s91_HmhaODQ",    
        golf: "UCU8C1n7XmH00mQG84H0s1GA",      
        boxeo: "UC518BHmSjZ2R1UanxO9nHmg",    
        lacrosse: "UCvP1PWePZc24l_n4sX_R0Kw"  
    };

    async function obtenerHighlights(deporteKey, channelId) {
        const cacheKey = `gungo_deportes_${deporteKey}`;
        const cacheActivo = sessionStorage.getItem(cacheKey);

        if (cacheActivo) return JSON.parse(cacheActivo);

        try {
            const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=4`;
            const response = await fetch(url);
            
            if (!response.ok) {
                console.error("Fallo de Google:", response.status, response.statusText);
                throw new Error(`Google rechazó la conexión (Código ${response.status})`);
            }
            
            const data = await response.json();
            const videos = data.items.filter(item => item.id && item.id.videoId).map(item => ({
                id: item.id.videoId,
                title: item.snippet.title,
                channel: item.snippet.channelTitle,
                date: new Date(item.snippet.publishedAt).toLocaleDateString(),
                thumbnail: item.snippet.thumbnails.high.url
            }));

            sessionStorage.setItem(cacheKey, JSON.stringify(videos));
            return videos;

        } catch (error) {
            console.error(`Error en API ${deporteKey}:`, error);
            return { error: true, mensaje: error.message };
        }
    }

    async function renderizarDeportes() {
        const grid = document.getElementById('deportes-grid');
        if(!grid) return;
        
        grid.innerHTML = '<div style="color:#FFEB3B; text-align:center; width:100%; font-weight:bold; grid-column: 1 / -1;">Conectando al satélite Gungo... 📡</div>';
        
        let htmlFinal = '';
        let huboError = false;

        for (const [deporte, channelId] of Object.entries(CANALES_OFICIALES)) {
            const videos = await obtenerHighlights(deporte, channelId);
            
            if (videos.error) {
                huboError = true;
                continue; 
            }

            videos.forEach(vid => {
                // Se ha inyectado el botón de "Fuego / Like" conectado al motor de seguridad en la nube
                htmlFinal += `
                <div class="deportes-card" data-deporte="${deporte}">
                    <div class="card-image">
                        <img src="${vid.thumbnail}" alt="${deporte}">
                        <span class="live-badge">NUEVO</span>
                    </div>
                    <div class="card-content">
                        <span class="sport-tag">${deporte.toUpperCase()}</span>
                        <h3 style="color:white; margin:10px 0; font-size:1.1rem;">${vid.title.substring(0, 50)}...</h3>
                        <p class="summary">${vid.channel} • ${vid.date}</p>
                        <div class="card-meta" style="display:flex; justify-content:space-between; align-items:center;">
                            <button onclick="reproducirVideoAPI('${vid.id}', '${vid.title.replace(/'/g, "\\'")}')" class="watch-btn">Ver video ▶</button>
                            <button onclick="registrarInteraccionSegura('interacciones_deportes', '${vid.id}', 'likes')" style="background:transparent; border:1px solid #FFEB3B; color:#FFEB3B; border-radius:50%; width:35px; height:35px; cursor:pointer; transition:0.3s;" onmouseover="this.style.background='#FFEB3B'; this.style.color='#000';" onmouseout="this.style.background='transparent'; this.style.color='#FFEB3B';"><i class="fas fa-fire"></i></button>
                        </div>
                    </div>
                </div>`;
            });
        }

        if (htmlFinal === '' || huboError) {
            grid.innerHTML = `
            <div style="background: #2a0000; color: #ff4444; padding: 20px; border-radius: 10px; text-align: center; grid-column: 1 / -1; border: 1px solid red;">
                <h3>❌ Conexión Bloqueada por Google</h3>
                <p>1. Asegúrate de no abrir el archivo con doble clic (file://). Sube la página a GitHub o usa Live Server.</p>
                <p>2. Presiona <b>F12</b> y ve a la pestaña <b>Console</b> para leer el error exacto.</p>
            </div>`;
            return;
        }

        grid.innerHTML = htmlFinal;
        if (typeof safeFilter === 'function') safeFilter('all'); 
    }

    window.reproducirVideoAPI = function(videoId, titulo) {
        document.getElementById('modal-deporte-title').textContent = titulo;
        document.getElementById('modal-deporte-desc').textContent = "Transmitiendo desde servidores oficiales de YouTube.";
        
        const container = document.getElementById('modal-video-container');
        container.innerHTML = `
            <iframe width="100%" height="450" 
                    src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&amp;rel=0&amp;modestbranding=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
        `;

        const modal = document.getElementById('deporte-modal');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    // Al cargar la página, esperamos 1 segundo y dibujamos los videos
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(renderizarDeportes, 1000); 
    });

    // ... aquí termina todo tu código anterior (muro viral, etc.)

    // ========================================================
    // 🛡️ BLOQUE FINAL: PRIVACIDAD Y SEGURIDAD (AÑADIR AQUÍ)
    // ========================================================
    window.checkCookieConsent = function() {
        const consent = localStorage.getItem('gungo_cookies_accepted');
        const shield = document.getElementById('cookie-shield');
        if (!consent && shield) {
            setTimeout(() => {
                shield.style.display = 'block';
            }, 2000);
        }
    };

    window.aceptarCookiesGungo = function() {
        localStorage.setItem('gungo_cookies_accepted', 'true');
        const shield = document.getElementById('cookie-shield');
        if (shield) shield.style.display = 'none';
        window.showToast("✅ Preferencias de privacidad guardadas");
    };

    // Esto activa la revisión apenas cargue la página
    document.addEventListener("DOMContentLoaded", () => {
        window.checkCookieConsent();
    });

})(); // <-- CIERRE DEL ESCUDO DE SEGURIDAD