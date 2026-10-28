(function () {
  "use strict";

  // Mobile navigation
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("nav");
  function setNav(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  }
  toggle.addEventListener("click", function () {
    setNav(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setNav(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setNav(false);
  });

  // Header border once the page scrolls
  // and the floating WhatsApp button once the hero buttons are out of view
  var header = document.querySelector(".site-header");
  var wa = document.querySelector(".wa-float");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    wa.classList.toggle("is-visible", window.scrollY > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Il banco: a pretend scale that adds up micro portions
  var dishes = document.getElementById("dishes");
  var valueEl = document.getElementById("scale-value");
  var plateEl = document.getElementById("plate");
  var resetBtn = document.getElementById("scale-reset");
  var plate = {}; // name -> { grams, count }
  var order = [];

  function kg(grams) {
    return (grams / 1000).toFixed(3).replace(".", ",");
  }

  function render() {
    var total = 0;
    plateEl.innerHTML = "";
    order.forEach(function (name) {
      var item = plate[name];
      total += item.grams * item.count;
      var li = document.createElement("li");
      var label = document.createElement("span");
      label.textContent = (item.count > 1 ? item.count + " × " : "") + name;
      var w = document.createElement("span");
      w.textContent = item.grams * item.count + " g";
      li.appendChild(label);
      li.appendChild(w);
      plateEl.appendChild(li);
    });
    if (!order.length) {
      var empty = document.createElement("li");
      empty.className = "plate-empty";
      empty.textContent = "Il piatto è vuoto. Scegli qualcosa dal banco.";
      plateEl.appendChild(empty);
    }
    valueEl.textContent = kg(total);
    valueEl.classList.remove("bump");
    void valueEl.offsetWidth;
    valueEl.classList.add("bump");
    dishes.querySelectorAll(".dish").forEach(function (b) {
      var picked = !!plate[b.dataset.name];
      b.classList.toggle("is-picked", picked);
      b.setAttribute("aria-pressed", String(picked));
    });
  }

  dishes.addEventListener("click", function (e) {
    var btn = e.target.closest(".dish");
    if (!btn) return;
    var name = btn.dataset.name;
    if (!plate[name]) {
      plate[name] = { grams: Number(btn.dataset.g), count: 0 };
      order.push(name);
    }
    plate[name].count += 1;
    render();
  });

  resetBtn.addEventListener("click", function () {
    plate = {};
    order = [];
    render();
  });

  // Start with a sample plate so the scale shows what it does
  ["Parmigiana di melanzane", "Polpette al sugo", "Stracciatella", "Focaccia barese"].forEach(function (name) {
    var b = dishes.querySelector('[data-name="' + name + '"]');
    if (b) { plate[name] = { grams: Number(b.dataset.g), count: 1 }; order.push(name); }
  });
  render();

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
