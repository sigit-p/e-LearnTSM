/* ======================================================
   e-Learn TSM MUPA
   File        : state.js
   Version     : 2.0.0
   Description : Global Application State
====================================================== */

const AppState = {
  /* ==========================================
       USER
    ========================================== */

  user: {
    login: false,

    username: "",

    nama: "",

    role: CONFIG.DEFAULT_ROLE,
  },

  /* ==========================================
       PAGE
    ========================================== */

  page: CONFIG.DEFAULT_PAGE,

  /* ==========================================
       UI
    ========================================== */

  ui: {
    sidebar: true,

    loading: false,

    darkMode: false,
  },

  /* ==========================================
       MASTER DATA
    ========================================== */

  data: {
    setting: [],

    kelas: [],

    mapel: [],

    siswa: [],

    materi: [],

    jobsheet: [],

    nilai: [],

    guru: [],
  },

  /* ==========================================
     CLASS ACCESS
  ========================================== */

  classAccess: {
    active: false,

    role: "public",

    kode: "",

    kelas: [],
  },

  /* ==========================================
       CACHE
    ========================================== */

  cache: {
    dashboard: null,

    terakhirUpdate: null,
  },
};

console.log("AppState Ready");
