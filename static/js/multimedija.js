/* ===============================
   MULTIMEDIJA - MAIN SCRIPT
================================ */

/* GLOBAL */
const menuItems = document.querySelectorAll(".multimedija-item");
const galleryContent = document.getElementById("galleryContent");
const videoLightbox = document.getElementById("videoLightbox");
const imageLightbox = document.getElementById("imageLightbox");
const lightboxVideo = document.getElementById("lightboxVideo");
const lightboxImage = document.getElementById("lightboxImage");
const videoClose = document.querySelector(".video-close");
const imageClose = document.querySelector(".image-close");
const imagePrev = document.querySelector(".image-prev");
const imageNext = document.querySelector(".image-next");
const imgCurrent = document.getElementById("imgCurrent");
const imgTotal = document.getElementById("imgTotal");
const purchaseButton = document.getElementById("purchaseButton");

let currentCategory = "prica";
let currentImageIndex = 0;
let currentImages = [];
let currentPurchaseUrl = null;

/* DATA */
const mediaData = {
  prica: {
    title: "PRIČA RE: REQUIEM",
    items: [
      {
        type: "story",
        title: "Resident Evil: Requiem",
        imageUrl: "/static/img/shop/ashly.jpg",
        text: "Resident Evil: Requiem predstavlja novi pogled na naslijeđe biološkog terorizma.\n\nRadnja se smešta nekoliko godina nakon Raccoon City incidenta, u svetu gde su ostatci Umbrelle Corporation još uvek aktivni, fragmentizirani i opasniјi nego ikada.\n\nOva priča istražuje krivicu, odgovornost i cijenu preživljavanja u svijetu koji nikada nije sanirao rane Raccoon Cityja."
      },
      {
        type: "story",
        title: "Leon & Grace",
        imageUrl: "/static/img/shop/leon.jpg",
        text: "Leon S. Kennedy i Grace Ashcroft moraju da se suoče sa novim čudovištima koje se kriju u ruševinama prošlosti.\n\nOni kreću u rizivu, odgovornost i cijenu preživljavanja kada nijedno saznanje nije sanirano rane Raccoon City.\n\nSvaki korak dalje u istini otkriva nove tajne i opasnosti koje su dugo bile skrivene."
      },
      {
        type: "story",
        title: "Evolucija Bića",
        imageUrl: "/static/img/shop/leon2.jpg",
        text: "Bio-oružja i čudovišta koja se pojavljuju nisu više samo rezultat virusa.\n\nNove forme života, kontrole uma i kolektivne osvesti predstavljaju prelaz sa klasičnog terorizma na nešto daleko strašnije.\n\nOno što je nekada bilo nepredvidivo i neobračunljivo, sada postaje realnost sa kojom se moraju suočiti preživeli."
      }
    ]
  },
  
  wallpaper: {
    title: "WALLPAPER",
    items: [
      {
        type: "image",
        title: "Resident Evil IX - 4K",
        imageUrl: "/static/img/wallpapers/1.jpg",
        downloadUrl: "/static/img/wallpapers/1.jpg"
      },
      {
        type: "image",
        title: "Leon S. Kennedy",
        imageUrl: "/static/img/wallpapers/2.jpg",
        downloadUrl: "/static/img/wallpapers/2.jpg"
      },
      {
        type: "image",
        title: "Raccoon City P.D.",
        imageUrl: "/static/img/wallpapers/3.jpg",
        downloadUrl: "/static/img/wallpapers/3.jpg"
      },
      {
        type: "image",
        title: "Raccoon City Ruins",
        imageUrl: "/static/img/wallpapers/4.jpg",
        downloadUrl: "/static/img/wallpapers/4.jpg"
      }
    ]
  },
  
  gameplay: {
    title: "GAMEPLAY",
    controller: {
      imageUrl: "/static/img/platforms/controls-dualsense.png",
      legendImageUrl: "/static/img/platforms/controls-legend.png",
      hotspots: [
        { id: 1, label: "Aim", top: "10%", left: "12%" },
        { id: 2, label: "Guard", top: "18%", left: "16%" },
        { id: 3, label: "Equip Slot weapons", top: "35%", left: "27%" },
        { id: 4, label: "Move", top: "62%", left: "37%" },
        { id: 5, label: "Run", top: "63%", left: "29%" },
        { id: 6, label: "Open Map / Journal", top: "32%", left: "48%" },
        { id: 7, label: "Open Pause Menu", top: "20%", left: "62%" },
        { id: 8, label: "Attack", top: "8%", left: "82%" },
        { id: 9, label: "Use recovery items", top: "16%", left: "79%" },
        { id: 10, label: "Open Inventory", top: "27%", left: "77%" },
        { id: 11, label: "Reload", top: "38%", left: "63%" },
        { id: 12, label: "Cancel", top: "41%", left: "82%" },
        { id: 13, label: "Interact / Confirm", top: "52%", left: "73%" },
        { id: 14, label: "Crouch / Stand", top: "65%", left: "62%" },
        { id: 15, label: "View", top: "66%", left: "54%" }
      ]
    },
    items: []
  },

  shop: {
    title: "SHOP",
    items: [
      {
        type: "product",
        title: "Resident Evil IX - Standard Edition",
        imageUrl: "/static/img/shop/standard.jpg",
        price: "$59.99",
        purchaseUrl: "https://www.bestbuy.com/product/resident-evil-requiem-steelbook-deluxe-edition-windows/J7CXZVJ5TG"
      },
      {
        type: "product",
        title: "Resident Evil IX - Deluxe Edition",
        imageUrl: "/static/img/shop/deluxe.jpg",
        price: "$79.99",
        purchaseUrl: "https://store.steampowered.com/app/3764200/Resident_Evil_Requiem/"
      },
      {
        type: "product",
        title: "Official Soundtrack",
        imageUrl: "/static/img/shop/soundtrack.jpg",
        price: "$19.99",
        purchaseUrl: "https://store.steampowered.com/app/1608280/Resident_Evil_Village_Original_Soundtrack/"
      },
      {
        type: "product",
        title: "Collector's Merchandise",
        imageUrl: "/static/img/shop/merch.jpg",
        price: "$49.99",
        purchaseUrl: "https://www.amazon.com/Resident-Evil-Village-Collectors-Edition/dp/B094PMFBXK"
      }
    ]
  }
};

/* CATEGORY SWITCH */
function switchCategory(category) {
  currentCategory = category;
  
  // Update menu
  menuItems.forEach(item => {
    const active = item.dataset.category === category;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", active);
  });
  
  // Load content
  loadGallery(category);
}

/* LOAD GALLERY */
function loadGallery(category) {
  const data = mediaData[category];
  if (!data) return;
  
  galleryContent.innerHTML = "";
  galleryContent.classList.remove("controls-mode");
  
  // Ako je PRIČA kategorija, prikaži kao spil karata sa tekstom
  if (category === "prica") {
    loadStoryCards(data.items);
    return;
  }

  // GAMEPLAY ima posebnu prezentaciju (kontroler + legenda)
  if (category === "gameplay") {
    galleryContent.classList.add("controls-mode");
    loadGameplayControls(data);
    return;
  }
  
  data.items.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "gallery-item";
    
    if (item.type === "video") {
      div.innerHTML = `
        <img src="${item.thumbnail}" alt="${item.title}">
        <div class="play-overlay">
          <span class="play-icon">▶</span>
        </div>
        <div class="item-title">${item.title}</div>
      `;
      div.addEventListener("click", () => openVideo(item.videoUrl));
    } else if (item.type === "product") {
      div.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.title}">
        <div class="item-title">${item.title}</div>
        <div class="item-price">${item.price}</div>
      `;
      div.addEventListener("click", () => {
        const products = data.items.filter(i => i.type === "product");
        const productIndex = products.indexOf(item);
        openImageGallery(products, productIndex);
      });
    } else {
      div.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.title}">
        <div class="item-title">${item.title}</div>
      `;
      div.addEventListener("click", () => {
        const images = data.items.filter(i => i.type === "image");
        const imageIndex = images.indexOf(item);
        openImageGallery(images, imageIndex);
      });
    }
    
    galleryContent.appendChild(div);
  });
}

/* GAMEPLAY CONTROLLER VIEW */
function loadGameplayControls(data) {
  const controlsWrapper = document.createElement("div");
  controlsWrapper.className = "controls-layout";

  const controllerCard = document.createElement("div");
  controllerCard.className = "controller-card";
  controllerCard.innerHTML = `
    <div class="controller-title">${data.title}</div>
    <div class="controller-image">
      <img src="${data.controller.imageUrl}" alt="DualSense kontroler">
      ${data.controller.hotspots.map(h => `
        <div class="hotspot" style="top:${h.top};left:${h.left};" title="${h.label}">
          <span class="hotspot-number">${h.id}</span>
          <div class="hotspot-tooltip">${h.label}</div>
        </div>
      `).join("")}
    </div>
  `;

  const legendCard = document.createElement("div");
  legendCard.className = "legend-card";
  legendCard.innerHTML = `
    <img src="${data.controller.legendImageUrl}" alt="Controls legenda">
  `;

  controlsWrapper.appendChild(controllerCard);
  controlsWrapper.appendChild(legendCard);
  galleryContent.appendChild(controlsWrapper);
}

/* STORY CARDS - PRIČA */
function loadStoryCards(items) {
  const storyWrapper = document.createElement("div");
  storyWrapper.className = "story-wrapper";
  
  // Cards deck - levo
  const cardsDeck = document.createElement("div");
  cardsDeck.className = "cards-deck";
  cardsDeck.id = "storyCardsDeck";
  
  items.forEach((item, idx) => {
    const card = document.createElement("div");
    card.className = "story-card";
    card.style.zIndex = items.length - idx;
    card.innerHTML = `<img src="${item.imageUrl}" alt="${item.title}">`;
    cardsDeck.appendChild(card);
  });
  
  // Text area - desno
  const textArea = document.createElement("div");
  textArea.className = "story-text-area";
  
  const textContent = document.createElement("div");
  textContent.className = "story-text-content";
  textContent.id = "storyTextContent";
  
  const title = document.createElement("h3");
  title.id = "storyTitle";
  title.textContent = items[0].title;
  
  const text = document.createElement("p");
  text.id = "storyText";
  text.textContent = items[0].text;
  
  textContent.appendChild(title);
  textContent.appendChild(text);
  textArea.appendChild(textContent);
  
  // Counter
  const counter = document.createElement("div");
  counter.className = "story-counter";
  counter.innerHTML = `<span id="storyCounter">1</span> / ${items.length}`;
  textArea.appendChild(counter);
  
  storyWrapper.appendChild(cardsDeck);
  storyWrapper.appendChild(textArea);
  
  galleryContent.appendChild(storyWrapper);
  
  // Start rotation
  startStoryRotation(items);
}

let storyRotationIndex = 0;
let storyRotationInterval = null;

function rotateStoryCards(items) {
  storyRotationIndex = (storyRotationIndex + 1) % items.length;
  
  // Update cards
  const cards = document.querySelectorAll(".story-card");
  cards.forEach((card, idx) => {
    card.style.opacity = idx === storyRotationIndex ? "1" : "0";
    card.style.transform = `translateY(${idx * 15}px)`;
  });
  
  // Update text
  const currentItem = items[storyRotationIndex];
  document.getElementById("storyTitle").textContent = currentItem.title;
  
  // Split text into paragraphs
  const paragraphs = currentItem.text.split('\n\n');
  const storyTextEl = document.getElementById("storyText");
  storyTextEl.innerHTML = '';
  paragraphs.forEach(para => {
    const p = document.createElement('p');
    p.textContent = para;
    storyTextEl.appendChild(p);
  });
  
  document.getElementById("storyCounter").textContent = storyRotationIndex + 1;
}

function startStoryRotation(items) {
  if (storyRotationInterval) clearInterval(storyRotationInterval);
  storyRotationIndex = 0;
  
  // Postavi početnu vrednost
  const cards = document.querySelectorAll(".story-card");
  cards.forEach((card, idx) => {
    card.style.opacity = idx === 0 ? "1" : "0";
    card.style.transition = "all 0.6s ease";
    card.style.transform = `translateY(${idx * 15}px)`;
  });
  
  // Set initial text with paragraphs
  const firstItem = items[0];
  const paragraphs = firstItem.text.split('\n\n');
  const storyTextEl = document.getElementById("storyText");
  storyTextEl.innerHTML = '';
  paragraphs.forEach(para => {
    const p = document.createElement('p');
    p.textContent = para;
    storyTextEl.appendChild(p);
  });
  
  storyRotationInterval = setInterval(() => rotateStoryCards(items), 4000);
}

/* VIDEO LIGHTBOX */
function openVideo(url) {
  lightboxVideo.src = url;
  videoLightbox.classList.add("show");
  videoLightbox.setAttribute("aria-hidden", "false");
}

function closeVideo() {
  videoLightbox.classList.remove("show");
  videoLightbox.setAttribute("aria-hidden", "true");
  lightboxVideo.src = "";
}

/* IMAGE LIGHTBOX */
function openImageGallery(images, index) {
  currentImages = images;
  currentImageIndex = index;
  updateImageLightbox();
  imageLightbox.classList.add("show");
  imageLightbox.setAttribute("aria-hidden", "false");
}

function updateImageLightbox() {
  if (currentImages.length === 0) return;
  
  const currentItem = currentImages[currentImageIndex];
  lightboxImage.src = currentItem.imageUrl;
  lightboxImage.alt = currentItem.title;
  imgCurrent.textContent = currentImageIndex + 1;
  imgTotal.textContent = currentImages.length;
  
  // Prikaži purchase button samo ako je proizvod
  if (currentItem.type === "product") {
    currentPurchaseUrl = currentItem.purchaseUrl;
    purchaseButton.style.display = "block";
  } else {
    purchaseButton.style.display = "none";
    currentPurchaseUrl = null;
  }
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % currentImages.length;
  updateImageLightbox();
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
  updateImageLightbox();
}

function closeImageGallery() {
  imageLightbox.classList.remove("show");
  imageLightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  currentImageIndex = 0;
  currentImages = [];
  currentPurchaseUrl = null;
}

function purchase() {
  if (currentPurchaseUrl) {
    window.open(currentPurchaseUrl, "_blank");
  }
}

/* EVENT LISTENERS */
menuItems.forEach(item => {
  const category = item.dataset.category;
  
  item.addEventListener("click", () => switchCategory(category));
  item.addEventListener("keydown", e => {
    if (e.key === "Enter") switchCategory(category);
  });
});

videoClose.addEventListener("click", closeVideo);
imageClose.addEventListener("click", closeImageGallery);
imagePrev.addEventListener("click", prevImage);
imageNext.addEventListener("click", nextImage);
purchaseButton.addEventListener("click", purchase);

videoLightbox.addEventListener("click", e => {
  if (e.target === videoLightbox) closeVideo();
});

imageLightbox.addEventListener("click", e => {
  if (e.target === imageLightbox) closeImageGallery();
});

// Keyboard navigation
document.addEventListener("keydown", e => {
  if (imageLightbox.classList.contains("show")) {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") closeImageGallery();
  }
  if (e.key === "Escape" && videoLightbox.classList.contains("show")) {
    closeVideo();
  }
});

/* BACK */
function goBack() {
  gsap.to(".multimedija-wrapper", {
    opacity: 0,
    duration: 0.4,
    ease: "power2.in",
    onComplete: () => {
      window.location.href = "/";
    }
  });
}

/* INIT */
loadGallery("prica");
document.querySelector(".multimedija-wrapper").style.opacity = "1";
