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
     ACCESS / LAYOUT MODE
     
     PUBLIC → landing website
     KELAS  → website pembelajaran
     SISWA  → LMS siswa
     ORTU   → LMS orang tua
     GURU   → LMS guru
     ADMIN  → LMS admin
  ========================================== */

  access: {
    mode: "public",

    kode: "",
  },

  /* ==========================================
     PAGE
  ========================================== */

  page: CONFIG.DEFAULT_PAGE,

  /* ==========================================
     UI
  ========================================== */

  ui: {
    /*
     * Sidebar hanya digunakan pada
     * layout LMS.
     */

    sidebar: false,

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
     
     Tetap dipertahankan karena modul
     Dashboard saat ini masih menggunakannya.
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

/* ======================================================
   ACCESS HELPER
====================================================== */

/**
 * Mode yang menggunakan LMS Layout
 */
AppState.isLMS = function () {
  return ["siswa", "ortu", "guru", "admin"].includes(this.access.mode);
};

/**
 * Mode yang menggunakan Web Layout
 */
AppState.isWeb = function () {
  return ["public", "kelas"].includes(this.access.mode);
};

/**
 * Set mode PUBLIC
 */
AppState.setPublic = function () {
  this.access = {
    mode: "public",

    kode: "",
  };

  this.ui.sidebar = false;
};

/**
 * Set mode KELAS
 */
AppState.setKelas = function (kode) {
  this.access = {
    mode: "kelas",

    kode: String(kode || "")
      .trim()
      .toUpperCase(),
  };

  /*
   * KELAS masih menggunakan Web Layout.
   */

  this.ui.sidebar = false;
};

/**
 * Set mode akun
 */
AppState.setUserMode = function (role) {
  const mode = String(role || "")
    .trim()
    .toLowerCase();

  const allowed = ["siswa", "ortu", "guru", "admin"];

  if (!allowed.includes(mode)) {
    console.warn("Mode user tidak valid:", role);

    return false;
  }

  this.access = {
    mode: mode,

    kode: "",
  };

  this.ui.sidebar = true;

  return true;
};

/**
 * Reset access
 */
AppState.resetAccess = function () {
  this.access = {
    mode: "public",

    kode: "",
  };

  this.ui.sidebar = false;
};

/* ======================================================
   READY
====================================================== */

console.log("AppState Ready");
