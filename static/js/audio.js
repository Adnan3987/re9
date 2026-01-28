document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("bg-audio");
    const toggle = document.getElementById("sound-toggle");

    if (!audio) return;

    audio.volume = 0.25;

    // Provjeri da li je muzika već pokrenuta (cross-page)
    const musicStarted = sessionStorage.getItem("musicStarted");
    const savedMuted = localStorage.getItem("muted");
    const savedTimeStr = sessionStorage.getItem("audioTime");
    const savedTime = savedTimeStr ? parseFloat(savedTimeStr) : 0;

    // Ako je muzika već pokrenuta, nastavi da svira od zadnje pozicije
    if (musicStarted === "true") {
        audio.muted = savedMuted === "true";

        const startPlayback = () => {
            try {
                // Postavi currentTime samo ako ima validna vrijednost
                if (!Number.isNaN(savedTime) && savedTime > 0 && savedTime < (audio.duration || Infinity)) {
                    audio.currentTime = savedTime;
                }
            } catch (_) {}
            audio.play().catch(() => {});
        };

        if (audio.readyState >= 1) {
            startPlayback();
        } else {
            audio.addEventListener("loadedmetadata", startPlayback, { once: true });
        }
    } else {
        // Inače, muted dok korisnik ne klikne ENTER
        audio.muted = true;
    }

    if (toggle) {
        toggle.innerText = audio.muted ? "🔇" : "🔊";

        toggle.addEventListener("click", () => {
            audio.muted = !audio.muted;
            localStorage.setItem("muted", audio.muted);
            toggle.innerText = audio.muted ? "🔇" : "🔊";
        });
    }

    // Spašavaj poziciju reprodukcije kroz sesiju
    const saveTime = () => {
        try {
            sessionStorage.setItem("audioTime", String(audio.currentTime || 0));
        } catch (_) {}
    };

    audio.addEventListener("timeupdate", saveTime);
    window.addEventListener("beforeunload", saveTime);
});
