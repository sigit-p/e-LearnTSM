/* ======================================================
   e-Learn TSM MUPA
   File        : helper.js
   Version     : 2.0.0
   Description : Helper Functions
====================================================== */

const Helper = {
  /* ==========================================
       DOM
    ========================================== */

  qs(selector) {
    return document.querySelector(selector);
  },

  qsa(selector) {
    return document.querySelectorAll(selector);
  },

  id(id) {
    return document.getElementById(id);
  },

  /* ==========================================
       HTML
    ========================================== */

  html(element, html) {
    element.innerHTML = html;
  },

  text(element, text) {
    element.textContent = text;
  },

  /* ==========================================
       SHOW / HIDE
    ========================================== */

  show(element) {
    element.classList.remove("d-none");
  },

  hide(element) {
    element.classList.add("d-none");
  },

  /* ==========================================
       LOADING
    ========================================== */

  loading(show = true) {
    const el = this.id("loading");

    if (!el) return;

    if (show) {
      el.classList.add("show");
    } else {
      el.classList.remove("show");
    }
  },

  /* ==========================================
       DELAY
    ========================================== */

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  /* ==========================================
       NUMBER
    ========================================== */

  number(value) {
    return Number(value).toLocaleString("id-ID");
  },

  /* ==========================================
       PERCENT
    ========================================== */

  percent(value, total) {
    if (total === 0) return 0;

    return Math.round((value / total) * 100);
  },

  /* ==========================================
       DATE
    ========================================== */

  date(value) {
    return new Date(value).toLocaleDateString("id-ID");
  },

  /* ==========================================
       DATE TIME
    ========================================== */

  datetime(value) {
    return new Date(value).toLocaleString("id-ID");
  },

  /* ==========================================
       RANDOM ID
    ========================================== */

  random(length = 8) {
    return Math.random()

      .toString(36)

      .substring(2, 2 + length);
  },

  /* ==========================================
       TOAST
    ========================================== */

  toast(message) {
    console.log(message);
  },
};

console.log("Helper Ready");
