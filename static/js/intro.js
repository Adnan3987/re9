// ===============================
// ELEMENTI
// ===============================
const enterScreen = document.getElementById("enterScreen");
const enterBtn = document.getElementById("enterBtn");
const audio = document.getElementById("bg-audio");
const mainMenu = document.getElementById("mainMenu");
const gameLogoImg = document.getElementById("gameLogoImg");

// ===============================
// LOAD GAME LOGO
// ===============================
function loadGameLogo(logoUrl) {
    if (!gameLogoImg || !logoUrl) return;
    
    gameLogoImg.src = logoUrl;
    gameLogoImg.style.display = "block";
    
    // Ako je .title prvi element, preskoči ga
    const titleElement = document.querySelector(".title");
    if (titleElement) {
        titleElement.style.display = "none";
    }
}

// Primjer: Evo kako učitati logo kada je spreman
// loadGameLogo("{{ url_for('static', filename='img/logo.png') }}")

// ===============================
// ENTER → START GAME
// ===============================
function goNext() {
    if (!audio) return;

    // 🔊 UNLOCK AUDIO i označi da je muzika pokrenuta
    audio.muted = false;
    audio.volume = 0.25;
    audio.play().catch(() => {});
    
    // Sačuvaj da je muzika pokrenuta (za sve stranice)
    sessionStorage.setItem("musicStarted", "true");
    localStorage.setItem("muted", "false");

    // 🎬 FADE OUT INTRO
    if (enterScreen) {
        enterScreen.classList.add("fade-out");
    }

    // 🎮 SHOW GAME MENU (CINEMATIC)
    setTimeout(() => {
        if (!mainMenu) return;

        // ukloni hidden stanje
        mainMenu.classList.remove("hidden");

        // prikaži meni kontejner
        gsap.to(mainMenu, {
            opacity: 1,
            visibility: "visible",
            duration: 0.3,
            ease: "power1.out"
        });

        // početno stanje stavki
        gsap.set(".menu-list li", {
            opacity: 0,
            x: -25
        });

        // animacija stavki (glatko)
        gsap.to(".menu-list li", {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.12,
            delay: 0.1,
            ease: "power2.out"
        });

    }, 900);
}

// ===============================
// INPUT HANDLING
// ===============================
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        goNext();
    }
});

if (enterBtn) {
    enterBtn.addEventListener("click", goNext);
}

// ===============================
// MENU CLICK → SCENE CHANGE
// ===============================
document.querySelectorAll(".menu-list li").forEach(item => {
    item.addEventListener("click", () => {
        const link = item.dataset.link;

        gsap.to("#content", {
            opacity: 0,
            y: -20,
            duration: 0.45,
            ease: "power2.in",
            onComplete: () => {
                window.location.href = link;
            }
        });
    });
});


// ===============================
// MENU HOVER EFFECT (RE STYLE)
// ===============================
document.querySelectorAll(".menu-list li").forEach(item => {

    item.addEventListener("mouseenter", () => {
        gsap.to(item, {
            x: 18,
            opacity: 1,
            duration: 0.25,
            ease: "power2.out"
        });
    });

    item.addEventListener("mouseleave", () => {
        gsap.to(item, {
            x: 0,
            opacity: 0.65,
            duration: 0.25,
            ease: "power2.out"
        });
    });

});


