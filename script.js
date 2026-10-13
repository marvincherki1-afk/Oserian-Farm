// 1. WhatsApp number (country code, no plus, no spaces) and business name
const whatsappNumber = "254789509623";
const brand = "Oserian Farm";

// 2. Mobile menu
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", function () { nav.classList.toggle("open"); });
nav.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () { nav.classList.remove("open"); });
});

// 3. Date field (if the form has one): no days in the past
const dateInput = document.getElementById("date");
if (dateInput) { dateInput.min = new Date().toISOString().split("T")[0]; }

// 4. Form: collect the answers, build a WhatsApp message and open it
const bookForm = document.getElementById("bookForm");
const formMsg = document.getElementById("formMsg");
bookForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const parts = [];
  bookForm.querySelectorAll(".q").forEach(function (field) {
    if (field.value) { parts.push(field.dataset.label + ": " + field.value); }
  });
  const message = "Hello " + brand + ", my name is " + name + ". " + parts.join(". ") + ".";
  formMsg.textContent = "Opening WhatsApp...";
  window.open("https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message), "_blank");
});
