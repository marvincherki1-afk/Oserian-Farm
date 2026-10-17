// 1. WhatsApp number (country code, no plus, no spaces) and business name
const whatsappNumber = "254789509623";
const brand = "Oserian Farm";

// 2. A small helper that builds a WhatsApp link from a message
function waLink(message) {
  return "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message);
}

// 3. Mobile menu (aria-expanded tells screen readers if the menu is open)
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", function () {
  const isOpen = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", isOpen);
});
nav.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// 4. Order buttons: each button has data-item="Roses" in the HTML.
//    We build the WhatsApp message here, so the HTML stays short.
document.querySelectorAll("[data-item]").forEach(function (button) {
  button.href = waLink("Hello " + brand + ", I would like to order " + button.dataset.item + ".");
});
document.querySelectorAll("[data-ask]").forEach(function (button) {
  button.href = waLink("Hello " + brand + ", I would like to ask a question.");
});

// 5. Date field: no days in the past (uses the phone's own local date)
const dateInput = document.getElementById("date");
if (dateInput) {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  dateInput.min = local.toISOString().split("T")[0];
}

// 6. Form: collect the answers, build a WhatsApp message and open it
const bookForm = document.getElementById("bookForm");
const formMsg = document.getElementById("formMsg");
bookForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const parts = [];
  bookForm.querySelectorAll(".q").forEach(function (field) {
    if (field.value.trim()) { parts.push(field.dataset.label + ": " + field.value.trim()); }
  });
  const message = "Hello " + brand + ", my name is " + name + ". " + parts.join(". ") + ".";
  formMsg.textContent = "Opening WhatsApp...";
  window.open(waLink(message), "_blank");
});

// 7. Gallery: show the first 12 photos, then show all when the button is clicked
const galleryGrid = document.getElementById("galleryGrid");
const moreBtn = document.getElementById("moreBtn");
if (galleryGrid && moreBtn) {
  const total = galleryGrid.querySelectorAll("img").length;
  moreBtn.addEventListener("click", function () {
    const open = galleryGrid.classList.toggle("open");
    moreBtn.textContent = open ? "Show fewer photos" : "Show all " + total + " photos";
    moreBtn.setAttribute("aria-expanded", open);
  });
}

// 8. Photo viewer (lightbox): click a photo to see it bigger, use arrows or Esc
const lb = document.createElement("div");
lb.className = "lightbox"; lb.hidden = true;
lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Photo viewer");
lb.innerHTML = '<button class="lb-close" aria-label="Close">&times;</button><button class="lb-prev" aria-label="Previous photo">&#8249;</button><img alt=""><button class="lb-next" aria-label="Next photo">&#8250;</button><p class="lb-cap"></p>';
document.body.appendChild(lb);
const lbImg = lb.querySelector("img"), lbCap = lb.querySelector(".lb-cap");
let lbList = [], lbIndex = 0;
function lbShow(i) {
  lbIndex = (i + lbList.length) % lbList.length;
  const el = lbList[lbIndex];
  lbImg.src = el.dataset.full; lbImg.alt = el.alt;
  lbCap.textContent = el.alt + " (" + (lbIndex + 1) + " of " + lbList.length + ")";
}
function lbOpen(el) {
  lbList = Array.from(document.querySelectorAll("[data-full]")).filter(function (x) { return x.offsetParent !== null; });
  lbShow(lbList.indexOf(el));
  lb.hidden = false; document.body.style.overflow = "hidden";
  lb.querySelector(".lb-close").focus();
}
function lbClose() { lb.hidden = true; document.body.style.overflow = ""; lbImg.removeAttribute("src"); }
document.querySelectorAll("[data-full]").forEach(function (img) {
  img.tabIndex = 0;
  img.addEventListener("keydown", function (e) { if (e.key === "Enter") { lbOpen(img); } });
});
document.addEventListener("click", function (e) {
  const el = e.target.closest("[data-full]");
  if (el) { lbOpen(el); }
});
lb.addEventListener("click", function (e) {
  if (e.target === lb || e.target.classList.contains("lb-close")) { lbClose(); }
  if (e.target.classList.contains("lb-prev")) { lbShow(lbIndex - 1); }
  if (e.target.classList.contains("lb-next")) { lbShow(lbIndex + 1); }
});
document.addEventListener("keydown", function (e) {
  if (lb.hidden) { return; }
  if (e.key === "Escape") { lbClose(); }
  if (e.key === "ArrowLeft") { lbShow(lbIndex - 1); }
  if (e.key === "ArrowRight") { lbShow(lbIndex + 1); }
});

// 9. Occasion cards: fill in the "Occasion" box of the form
document.querySelectorAll("[data-occasion]").forEach(function (card) {
  card.addEventListener("click", function () {
    const select = document.getElementById("occasion");
    if (select) { select.value = card.dataset.occasion; }
  });
});

// 10. Header shadow and back-to-top button
const header = document.querySelector(".site-header");
const toTop = document.getElementById("toTop");
function onScroll() {
  header.classList.toggle("scrolled", window.scrollY > 10);
  toTop.hidden = window.scrollY < 600;
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

// 11. Fade-in when a section scrolls into view (skipped if the person prefers less motion)
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("js");
  const seen = new IntersectionObserver(function (items) {
    items.forEach(function (item) {
      if (item.isIntersecting) { item.target.classList.add("in"); seen.unobserve(item.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".section > h2, .card, .occ, .farm-grid figure, .steps li, blockquote, .faq details").forEach(function (el) {
    el.classList.add("reveal"); seen.observe(el);
  });
}
