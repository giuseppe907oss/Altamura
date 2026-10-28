(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("js");

  // ---------- Time in Varese (Europe/Rome), whatever the visitor's clock ----------
  function romeNow() {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Rome", hour: "numeric", minute: "numeric", weekday: "short", hourCycle: "h23"
    }).formatToParts(new Date());
    var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: days[get("weekday")], h: Number(get("hour")), m: Number(get("minute")) };
  }

  var OPEN = 7 * 60, CLOSE = 22 * 60;

  function updateStatus() {
    var now = romeNow();
    var mins = now.h * 60 + now.m;
    var open = mins >= OPEN && mins < CLOSE;
    var text, sub;
    if (open) {
      var left = CLOSE - mins;
      text = left <= 60 ? "Aperto · chiude tra " + left + " min" : "Aperto ora";
      sub = "Oggi fino alle 22:00";
    } else {
      text = "Chiuso ora";
      sub = mins < OPEN ? "Apre oggi alle 07:00" : "Apre domani alle 07:00";
    }
    document.querySelectorAll("[data-status]").forEach(function (el) {
      el.classList.toggle("is-open", open);
      el.classList.toggle("is-closed", !open);
      var t = el.querySelector("[data-status-text]");
      if (t) t.textContent = el.classList.contains("status-lg") ? text + " · " + sub.toLowerCase() : text;
    });
    document.querySelectorAll("[data-status-sub]").forEach(function (el) { el.textContent = sub; });

    document.querySelectorAll("#hours li").forEach(function (li) {
      li.classList.toggle("is-today", Number(li.dataset.day) === now.day);
    });

    var nowCard = null;
    document.querySelectorAll(".moment").forEach(function (m) {
      var on = open && now.h >= Number(m.dataset.from) && now.h < Number(m.dataset.to);
      m.classList.toggle("is-now", on);
      if (on) nowCard = m;
    });
    return nowCard;
  }

  var nowCard = updateStatus();
  setInterval(updateStatus, 60 * 1000);

  // On phones the day cards scroll sideways: start from the current moment
  var rail = document.getElementById("day-rail");
  if (nowCard && rail && rail.scrollWidth > rail.clientWidth) {
    rail.scrollLeft = nowCard.offsetLeft - rail.firstElementChild.offsetLeft;
  }

  // ---------- Header: solid after the hero, hides while scrolling down ----------
  var hdr = document.getElementById("hdr");
  var bar = document.querySelector(".actionbar");
  var hero = document.querySelector(".hero");
  var lastY = window.scrollY;
  var drawerOpen = false;

  function onScroll() {
    var y = window.scrollY;
    hdr.classList.toggle("is-solid", y > 40);
    if (!drawerOpen) hdr.classList.toggle("is-hidden", y > lastY && y > 500);
    bar.classList.toggle("is-visible", y > hero.offsetHeight * 0.6);
    lastY = y;
  }

  // ---------- Parallax on the hero and the cellar photo ----------
  var hImg = document.querySelector(".hero-media img");
  var pImg = document.querySelector("[data-parallax]");
  var ticking = false;

  function parallax() {
    ticking = false;
    if (reduceMotion) return;
    var y = window.scrollY;
    if (y < window.innerHeight * 1.2) hImg.style.translate = "0 " + (y * 0.25).toFixed(1) + "px";
    if (pImg) {
      var r = pImg.parentElement.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        var p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        pImg.style.translate = "0 " + (p * -90).toFixed(1) + "px";
      }
    }
  }

  window.addEventListener("scroll", function () {
    onScroll();
    if (!ticking) { ticking = true; requestAnimationFrame(parallax); }
  }, { passive: true });
  onScroll();
  parallax();

  // ---------- Mobile drawer ----------
  var burger = document.getElementById("burger");
  var drawer = document.getElementById("drawer");

  function setDrawer(open) {
    drawerOpen = open;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
    if (open) {
      drawer.hidden = false;
      hdr.classList.remove("is-hidden");
      requestAnimationFrame(function () { drawer.classList.add("is-open"); });
      document.body.style.overflow = "hidden";
    } else {
      drawer.classList.remove("is-open");
      document.body.style.overflow = "";
      setTimeout(function () { if (!drawerOpen) drawer.hidden = true; }, reduceMotion ? 0 : 600);
    }
  }
  burger.addEventListener("click", function () { setDrawer(!drawerOpen); });
  drawer.addEventListener("click", function (e) { if (e.target.closest("a")) setDrawer(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawerOpen) setDrawer(false); });

  // ---------- Scroll reveal ----------
  var revealables = document.querySelectorAll(".reveal, .how-media");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var sibs = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains("reveal"); }) : [];
        var i = Math.max(0, sibs.indexOf(el));
        el.style.transitionDelay = Math.min(i, 5) * 80 + "ms";
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("in"); });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
