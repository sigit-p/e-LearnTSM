/* ======================================================
   e-Learn TSM MUPA
   File        : config.js
   Version     : 2.0.0
   Description : Global Configuration
====================================================== */

const CONFIG = {
  /* ==========================================
       APPLICATION
    ========================================== */

  APP_NAME: "e-Learn TSM MUPA",

  APP_VERSION: "2.0.0",

  SCHOOL_NAME: "SMK Muhammadiyah Pakem",

  JURUSAN: "Teknik Sepeda Motor",

  COPYRIGHT: "© 2026 e-Learn TSM MUPA",

  /* ==========================================
       API
    ========================================== */

  API_URL:
    "https://script.google.com/macros/s/AKfycbxwo4ngi4UKRuJygS83DP5-eqwe2UXXmCQKvGBK5ngBHnJucyQhL4RB3AhAGM_YyhDkeQ/exec",

  /* ==========================================
       LOGIN
    ========================================== */

  LOGIN_REQUIRED: false,

  SESSION_NAME: "elearn_session",

  /* ==========================================
       DEFAULT
    ========================================== */

  DEFAULT_PAGE: "dashboard",

  DEFAULT_THEME: "light",

  DEFAULT_ROLE: "guest",

  /* ==========================================
       FEATURE FLAG
    ========================================== */

  FEATURE: {
    dashboard: true,

    materi: true,

    jobsheet: true,

    input: true,

    rekap: true,

    siswa: true,

    setting: true,

    login: true,

    upload: false,

    cbt: false,

    presensi: false,

    rapor: false,

    multiJurusan: false,
  },
};

Object.freeze(CONFIG);

console.log(CONFIG.APP_NAME, CONFIG.APP_VERSION);
