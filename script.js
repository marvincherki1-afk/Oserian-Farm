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
