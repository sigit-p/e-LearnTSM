/**
 * ======================================================
 * e-Learn TSM MUPA
 * ------------------------------------------------------
 * File        : app.js
 * Version     : 2.0.0
 * Description : Application Bootstrap & Access Manager
 * ======================================================
 */

document.addEventListener("DOMContentLoaded", initApp);

/* ======================================================
   INITIALIZE APPLICATION
====================================================== */

async function initApp() {
  console.log("====================================");
  console.log(CONFIG.APP_NAME);
  console.log("Version :", CONFIG.APP_VERSION);
  console.log("====================================");

  try {
    /* ==========================================
       RESTORE USER
    ========================================== */

    refreshUser();

    /* ==========================================
       RESTORE CLASS ACCESS
    ========================================== */

    restoreClassAccess();

    /* ==========================================
       DETERMINE ACCESS MODE
    ========================================== */

    determineAccessMode();

    /* ==========================================
       INITIALIZE COMPONENTS
    ========================================== */

    if (typeof Header !== "undefined" && typeof Header.init === "function") {
      Header.init();
    }

    if (typeof Sidebar !== "undefined" && typeof Sidebar.init === "function") {
      Sidebar.init();
    }

    /* ==========================================
       START ROUTER
    ========================================== */

    Router.start();

    /* ==========================================
       APPLY LAYOUT
    ========================================== */

    applyApplicationLayout();

    console.log("Access Mode :", AppState.access.mode);

    console.log("Application Ready");
  } catch (err) {
    console.error("Application Error :", err);
  }
}

/* ======================================================
   USER SESSION
====================================================== */

/**
 * Restore User
 */
function refreshUser() {
  const user = Storage.get("user");

  /* ------------------------------------------
     Tidak ada user
  ------------------------------------------ */

  if (!user) {
    AppState.user = {
      login: false,

      username: "",

      nama: "",

      role: CONFIG.DEFAULT_ROLE,
    };

    return;
  }

  /* ------------------------------------------
     User ditemukan
  ------------------------------------------ */

  AppState.user = {
    ...AppState.user,

    ...user,

    login: true,
  };
}

/* ======================================================
   CLASS ACCESS
====================================================== */

/**
 * Restore Class Access
 */
function restoreClassAccess() {
  const classAccess = Storage.get("classAccess");

  /* ------------------------------------------
     Tidak ada class access
  ------------------------------------------ */

  if (!classAccess) {
    AppState.classAccess = {
      active: false,

      role: "public",

      kode: "",

      kelas: [],
    };

    if (typeof updateClassAccessUI === "function") {
      updateClassAccessUI();
    }
    return;
  }

  /* ------------------------------------------
     Validasi
  ------------------------------------------ */

  if (!classAccess.kode || !Array.isArray(classAccess.kelas)) {
    Storage.remove("classAccess");

    AppState.classAccess = {
      active: false,

      role: "public",

      kode: "",

      kelas: [],
    };

    if (typeof updateClassAccessUI === "function") {
      updateClassAccessUI();
    }

    return;
  }

  /* ------------------------------------------
     Restore
  ------------------------------------------ */

  AppState.classAccess = {
    active: true,

    role: "kelas",

    kode: String(classAccess.kode).trim().toUpperCase(),

    kelas: classAccess.kelas,
  };

  if (typeof updateClassAccessUI === "function") {
    updateClassAccessUI();
  }
}

/* ======================================================
   DETERMINE ACCESS MODE
====================================================== */

/**
 * Menentukan mode aplikasi berdasarkan session.
 *
 * Prioritas:
 *
 * 1. Admin/Guru/Ortu/Siswa yang login
 * 2. Class Access
 * 3. Public
 */
function determineAccessMode() {
  /* ==========================================
     USER LOGIN
  ========================================== */

  if (AppState.user.login) {
    const role = String(AppState.user.role || "")
      .trim()
      .toLowerCase();

    if (["siswa", "ortu", "guru", "admin"].includes(role)) {
      AppState.setUserMode(role);

      return;
    }
  }

  /* ==========================================
     CLASS ACCESS
  ========================================== */

  if (AppState.classAccess && AppState.classAccess.active) {
    AppState.setKelas(AppState.classAccess.kode);

    return;
  }

  /* ==========================================
     PUBLIC
  ========================================== */

  AppState.setPublic();
}

/* ======================================================
   APPLICATION LAYOUT
====================================================== */

/**
 * Terapkan layout berdasarkan access mode.
 *
 * PUBLIC / KELAS
 * → Web Layout
 *
 * SISWA / ORTU / GURU / ADMIN
 * → LMS Layout
 */
function applyApplicationLayout() {
  const mode = AppState.access.mode;

  const isLMS = ["siswa", "ortu", "guru", "admin"].includes(mode);

  const isWeb = ["public", "kelas"].includes(mode);

  /* ==========================================
     BODY CLASS
  ========================================== */

  document.body.classList.toggle("layout-web", isWeb);

  document.body.classList.toggle("layout-lms", isLMS);

  /* ==========================================
     SIDEBAR
  ========================================== */

  const sidebar = document.getElementById("sidebar");

  if (sidebar) {
    sidebar.style.display = isLMS ? "" : "none";
  }

  /* ==========================================
     SIDEBAR OVERLAY
  ========================================== */

  const overlay = document.getElementById("sidebarOverlay");

  if (overlay) {
    overlay.style.display = isLMS ? "" : "none";
  }

  /* ==========================================
     MAIN
  ========================================== */

  const main = document.querySelector(".main");

  if (main) {
    main.classList.toggle("web-layout", isWeb);

    main.classList.toggle("lms-layout", isLMS);
  }

  /* ==========================================
     ACCESS STATUS
  ========================================== */

  updateAccessStatus();
}

/* ======================================================
   ACCESS STATUS
====================================================== */

/**
 * Update badge/status di header.
 */
function updateAccessStatus() {
  const element = document.getElementById("accessStatus");

  if (!element) {
    return;
  }

  const mode = AppState.access.mode;

  const labels = {
    public: "PUBLIC",

    kelas: AppState.access.kode ? AppState.access.kode : "KELAS",

    siswa: "SISWA",

    ortu: "ORTU",

    guru: "GURU",

    admin: "ADMIN",
  };

  const icons = {
    public: "bi-globe2",

    kelas: "bi-mortarboard-fill",

    siswa: "bi-person-fill",

    ortu: "bi-people-fill",

    guru: "bi-person-badge-fill",

    admin: "bi-shield-lock-fill",
  };

  element.innerHTML = `

    <i class="bi ${icons[mode] || "bi-globe2"}"></i>

    ${escapeHtml(labels[mode] || "PUBLIC")}

  `;

  element.className =
    mode === "public"
      ? "badge bg-success-subtle text-success"
      : mode === "kelas"
        ? "badge bg-primary-subtle text-primary"
        : "badge bg-dark text-white";
}

/* ======================================================
   LOGOUT CLASS
====================================================== */

/**
 * Keluar dari akses kelas.
 *
 * Tidak mengganggu akun user.
 */
function logoutClassAccess() {
  Storage.remove("classAccess");

  AppState.classAccess = {
    active: false,

    role: "public",

    kode: "",

    kelas: [],
  };

  /*
   * Jika sedang login sebagai user,
   * jangan ubah mode user.
   */

  if (AppState.user.login) {
    determineAccessMode();
  } else {
    AppState.setPublic();
  }

  applyApplicationLayout();

  /*
   * Kembali ke Dashboard.
   */

  if (typeof Router !== "undefined") {
    window.location.hash = "#dashboard";
  }
}

window.logoutClassAccess = logoutClassAccess;

/* ======================================================
   LOADING
====================================================== */

/**
 * Show Loading
 */
function showLoading() {
  AppState.ui.loading = true;

  const loading = document.getElementById("loading");

  if (loading) {
    loading.style.display = "flex";
  }
}

/**
 * Hide Loading
 */
function hideLoading() {
  AppState.ui.loading = false;

  const loading = document.getElementById("loading");

  if (loading) {
    loading.style.display = "none";
  }
}

/* ======================================================
   LOGIN STATUS HELPERS
====================================================== */

function isLogin() {
  return AppState.user.login === true;
}

function currentUser() {
  return AppState.user;
}

function currentRole() {
  return AppState.user.login ? AppState.user.role : null;
}

function isAdmin() {
  return currentRole() === "admin";
}

function isGuru() {
  return currentRole() === "guru";
}

function isOrtu() {
  return currentRole() === "ortu";
}

function isSiswa() {
  return currentRole() === "siswa";
}

/* ======================================================
   PUBLIC / CLASS / LMS HELPERS
====================================================== */

function isPublicMode() {
  return AppState.access.mode === "public";
}

function isClassMode() {
  return AppState.access.mode === "kelas";
}

function isLMSMode() {
  return AppState.isLMS();
}

function currentAccessMode() {
  return AppState.access.mode;
}

/* ======================================================
   HTML ESCAPE
====================================================== */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");
}

/* ======================================================
   READY
====================================================== */

console.log("Application Core Loaded");
