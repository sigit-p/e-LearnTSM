/**
 * ======================================================
 * e-Learn TSM MUPA
 * ------------------------------------------------------
 * File        : app.js
 * Version     : 2.0.0
 * Description : Frontend Application
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
    // Refresh Session
    refreshUser();
    restoreClassAccess();

    Header.init();
    Sidebar.init();

    // Start Router
    Router.start();

    console.log("Application Ready");
  } catch (error) {
    console.error(error);
  }
}

/* ======================================================
   SESSION
====================================================== */

/**
 * Refresh User Session
 */
function refreshUser() {
  const user = Storage.get("user");

  if (user) {
    AppState.user = {
      ...AppState.user,
      ...user,
      login: true,
    };
  } else {
    AppState.user = {
      login: false,
      username: "",
      nama: "",
      role: CONFIG.DEFAULT_ROLE,
    };
  }
}

/**
 * Check Login
 */
function isLogin() {
  return AppState.user.login;
}

/**
 * Current User
 */
function currentUser() {
  return AppState.user;
}

/**
 * Current Role
 */
function currentRole() {
  return AppState.user.role;
}

/**
 * Restore Class Access
 */
function restoreClassAccess() {
  const classAccess = Storage.get("classAccess");

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

  if (!classAccess.kode || !Array.isArray(classAccess.kelas)) {
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

  AppState.classAccess = {
    active: true,
    role: classAccess.role || "siswa",
    kode: classAccess.kode,
    kelas: classAccess.kelas,
  };

  if (typeof updateClassAccessUI === "function") {
    updateClassAccessUI();
  }
}

/**
 * Logout Class Access
 */
function logoutClassAccess() {
  AppState.classAccess = {
    active: false,
    role: "public",
    kode: "",
    kelas: [],
  };

  Storage.remove("classAccess");

  if (typeof updateClassAccessUI === "function") {
    updateClassAccessUI();
  }
}

window.logoutClassAccess = logoutClassAccess;

/**
 * Is Admin
 */
function isAdmin() {
  return currentRole() === "admin";
}

/**
 * Is Guru
 */
function isGuru() {
  return currentRole() === "guru";
}

/**
 * Is Siswa
 */
function isSiswa() {
  return currentRole() === "siswa";
}

/* ======================================================
   LOADING
====================================================== */

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
   ALERT
====================================================== */

function success(message) {
  console.log("SUCCESS :", message);

  if (window.Toast && Toast.success) {
    Toast.success(message);
  } else {
    alert(message);
  }
}

function error(message) {
  console.error("ERROR :", message);

  if (window.Toast && Toast.error) {
    Toast.error(message);
  } else {
    alert(message);
  }
}
