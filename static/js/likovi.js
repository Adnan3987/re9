/* ======================================================
   LIKOVI – MAIN SCRIPT (IMPROVED VERSION)
   Bolja navigacija slika, video popup i fullscreen
====================================================== */

/* ======================
   GLOBAL
====================== */
const menuItems = document.querySelectorAll(".likovi-item");
let currentChar;
let currentGalleryIndex = 0;
let currentGalleryImages = [];

/* ======================
   SCENA
====================== */
const renderImgs = {
  leon: document.querySelector(".char.render.leon"),
  ashley: document.querySelector(".char.render.ashley"),
  alyssa: document.querySelector(".char.render.alyssa"),
};

const silImgs = {
  leon: document.querySelector(".char.sil.leon"),
  ashley: document.querySelector(".char.sil.ashley"),
  alyssa: document.querySelector(".char.sil.alyssa"),
};

/* ======================
   MODAL ELEMENTI
====================== */
const modal = document.getElementById("likModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalImg = document.getElementById("modalImg");
const modalGallery = document.getElementById("modalGallery");
const playBtn = document.getElementById("playBtn");
const closeBtn = document.querySelector(".close");

const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".modal-section");

/* ======================
   LIGHTBOX ELEMENTI
====================== */
const imgLightbox = document.getElementById("imgLightbox");
const videoLightbox = document.getElementById("videoLightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxVideo = document.getElementById("lightboxVideo");
const imgClose = document.querySelector(".img-close");
const imgPrev = document.querySelector(".img-prev");
const imgNext = document.querySelector(".img-next");
const imgCurrent = document.getElementById("imgCurrent");
const imgTotal = document.getElementById("imgTotal");
const videoClose = document.querySelector(".video-close");
const videoFullscreenBtn = document.getElementById("videoFullscreenBtn");
const data = {
  leon: {
    img: "/static/img/characters/leon.png",
    bg: "/static/img/bg/raccoon_city.jpg",
    title: "Leon S. Kennedy",
    text: `Leon Scott Kennedy, veteran Raccoon City incidenta iz 1998. godine, jedan je od najiskusnijih operativaca protiv bio-terorizma na svijetu. Nakon što je preživio apokalipsu u zaraženom gradu, Leon je proveo godine radeći u sjeni za različite agencije, boreći se protiv korporativnih zavjera i mutiranih prijetnji.

Njegova karijera kulminira u novoj krizi gdje se suočava s duhovima prošlosti. Leonova odlučnost i vještine s vatrenim oružjem čine ga ključnim igračem u borbi protiv nadolazeće katastrofe. Iako je emocionalno ožiljak, njegova predanost spašavanju života ostaje nepokolebljiva, čineći ga simbolom nade u najmračnijim vremenima.`,
    gallery: [
      "/static/img/leon/1.jpg",
      "/static/img/leon/2.jpg",
      "/static/img/leon/3.jpg",
      "/static/img/leon/4.jpg",
      "/static/img/leon/5.jpg",
      "/static/img/leon/6.jpg",
    
    ],
    trailer: "https://www.youtube.com/embed/qLuAT-njhIA?autoplay=1",  // official Leon video
    trailerThumb: "https://img.youtube.com/vi/qLuAT-njhIA/hqdefault.jpg"
  },

  ashley: {
    img: "/static/img/characters/ashley.png",
    bg: "/static/img/bg/hotel_interior.jpg",
    title: "Grace Ashcroft",
    text: `Grace Ashcroft, mlada FBI analitičarka i civilna perspektiva u svijetu horora, donosi svježu dimenziju priči. Kao sestra Alyssa Ashcroft, Grace se suočava s traumama iz prošlosti dok istražuje misteriozne događaje u ruševinama Raccoon Cityja.

Njena uloga kao istraživačice otkriva skrivene istine o korporativnim eksperimentima i biološkom oružju. Graceina inteligencija i hrabrost čine je nezamjenjivom u timu, pružajući uvid u ljudsku stranu katastrofe. Njena potraga za pravdom vodi je kroz opasne terene, gdje svaki korak otkriva nove slojeve zavjere.`,
    gallery: [
      "/static/img/grace/1.jpg",
      "/static/img/grace/2.jpg",
      "/static/img/grace/3.jpg",
      "/static/img/grace/4.jpg",
      "/static/img/grace/5.jpg",
      "/static/img/grace/6.jpg",
   
    ],
    trailer: "https://www.youtube.com/embed/T54OWinnymM?autoplay=1",
    trailerThumb: "https://img.youtube.com/vi/T54OWinnymM/hqdefault.jpg"
  },

  alyssa: {
    img: "/static/img/characters/alyssa.png",
    bg: "/static/img/bg/documents_ruins.jpg",
    title: "Alyssa Ashcroft",
    text: `Alyssa Ashcroft, istraživač i hroničar istine, dokumentuje događaje koje drugi pokušavaju zaboraviti. Njena uloga u priči fokusira se na otkrivanje skrivenih dokumenata i svjedočanstava o raspadu društva.

Kao sestra Grace, Alyssa dodaje dubinu priči kroz svoje zapise i analize. Njena predanost istini čini je ključnom u razotkrivanju zavjera, pružajući kontekst za Leonove akcije. U svijetu punom laži, Alyssa je glas razuma i dokumentacije.`,
    gallery: [
      "/static/img/alyssa/1.jpg",
      "/static/img/alyssa/2.jpg",
      "/static/img/alyssa/3.jpg",
      "/static/img/alyssa/4.jpg",
      "/static/img/alyssa/5.jpg",
      "/static/img/alyssa/6.jpg",
    
    ],
    trailer: "https://www.youtube.com/embed/0wFNN1f6hF8?autoplay=1",
    trailerThumb: "https://img.youtube.com/vi/0wFNN1f6hF8/hqdefault.jpg"
  }
};

/* ======================
   SCENA LOGIKA
====================== */
function setActiveChar(char) {
  menuItems.forEach(li => {
    const active = li.dataset.char === char;
    li.classList.toggle("active", active);
    li.setAttribute("aria-selected", active);
  });

  Object.values(renderImgs).forEach(img => img.classList.remove("active"));
  Object.values(silImgs).forEach(img => img.classList.remove("warm"));

  renderImgs[char].classList.add("active");
  silImgs[char].classList.add("warm");
}

/* ======================
   TAB LOGIKA
====================== */
function switchTab(tab) {
  tabButtons.forEach(btn =>
    btn.classList.toggle("active", btn.dataset.tab === tab)
  );

  tabPanels.forEach(panel =>
    panel.classList.toggle("active", panel.id === `tab-${tab}`)
  );
}

/* ======================
   MODAL
====================== */
function openModal(char) {
  currentChar = char;
  const item = data[char];
  const infoTab = document.getElementById("tab-info");
  const modalTrailer = document.querySelector(".modal-trailer");

  infoTab.style.backgroundImage = item.bg
    ? `url(${item.bg})`
    : "none";

  modalTitle.textContent = item.title;
  modalText.textContent = item.text;
  modalImg.src = item.img;
  modalImg.alt = item.title;

  modalGallery.innerHTML = "";
  item.gallery.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = item.title;
    img.addEventListener("click", () => openImageLightbox(item.gallery, index));
    modalGallery.appendChild(img);
  });

  switchTab("info");

  // Set video thumbnail background if available
  if (modalTrailer) {
    if (item.trailerThumb) {
      modalTrailer.style.backgroundImage = `url(${item.trailerThumb})`;
    } else {
      modalTrailer.style.backgroundImage = "none";
    }
  }

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

/* ======================
   EVENTI
====================== */
menuItems.forEach(item => {
  const char = item.dataset.char;

  item.addEventListener("mouseenter", () => setActiveChar(char));
  item.addEventListener("focus", () => setActiveChar(char));
  item.addEventListener("click", () => openModal(char));

  item.addEventListener("keydown", e => {
    if (e.key === "Enter") openModal(char);
  });
});

tabButtons.forEach(btn =>
  btn.addEventListener("click", () => switchTab(btn.dataset.tab))
);

playBtn.addEventListener("click", () => {
  const item = data[currentChar];
  if (item.trailer) {
    lightboxVideo.src = item.trailer;
    videoLightbox.classList.add("show");
    videoLightbox.setAttribute("aria-hidden", "false");
  }
});

closeBtn.addEventListener("click", closeModal);

modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

/* ======================
   IMAGE LIGHTBOX
====================== */
function openImageLightbox(images, index) {
  currentGalleryImages = images;
  currentGalleryIndex = index;
  updateImageLightbox();
  imgLightbox.classList.add("show");
  imgLightbox.setAttribute("aria-hidden", "false");
}

function updateImageLightbox() {
  lightboxImg.src = currentGalleryImages[currentGalleryIndex];
  imgCurrent.textContent = currentGalleryIndex + 1;
  imgTotal.textContent = currentGalleryImages.length;
}

function nextImage() {
  currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryImages.length;
  updateImageLightbox();
}

function prevImage() {
  currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
  updateImageLightbox();
}

function closeImageLightbox() {
  imgLightbox.classList.remove("show");
  imgLightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
  currentGalleryIndex = 0;
  currentGalleryImages = [];
}

/* ======================
   VIDEO LIGHTBOX
====================== */
function closeVideoLightbox() {
  videoLightbox.classList.remove("show");
  videoLightbox.setAttribute("aria-hidden", "true");
  lightboxVideo.src = "";
}

function requestVideoFullscreen() {
  const videoContainer = document.querySelector(".video-container");
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }
}

/* ======================
   LIGHTBOX EVENT LISTENERS
====================== */
imgClose.addEventListener("click", closeImageLightbox);
imgPrev.addEventListener("click", prevImage);
imgNext.addEventListener("click", nextImage);
videoClose.addEventListener("click", closeVideoLightbox);
videoFullscreenBtn.addEventListener("click", requestVideoFullscreen);

imgLightbox.addEventListener("click", e => {
  if (e.target === imgLightbox) closeImageLightbox();
});

videoLightbox.addEventListener("click", e => {
  if (e.target === videoLightbox) closeVideoLightbox();
});

// Keyboard navigation
document.addEventListener("keydown", e => {
  if (imgLightbox.classList.contains("show")) {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") closeImageLightbox();
  }
  if (e.key === "Escape" && modal.classList.contains("show")) {
    closeModal();
  }
  if (e.key === "Escape" && videoLightbox.classList.contains("show")) {
    closeVideoLightbox();
  }
});

/* ======================
   INIT
====================== */
setActiveChar("leon");
document.querySelector(".likovi-wrapper").style.opacity = "1";

/* ======================
   BACK
====================== */
function goBack() {
  gsap.to(".likovi-wrapper", {
    opacity: 0,
    duration: 0.4,
    ease: "power2.in",
    onComplete: () => {
      window.location.href = "/";
    }
  });
}