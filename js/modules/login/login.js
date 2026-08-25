/* ======================================================
   e-Learn TSM MUPA
   ------------------------------------------------------
   File        : login.js
   Version     : 2.0.0
   Description : Login Module
====================================================== */

/* ======================================================
   ROLE CONFIG
====================================================== */

const LOGIN_ROLES = {
  siswa: {
    label: "Siswa",
    userPlaceholder: "Username Siswa",
    passPlaceholder: "Password Siswa",
    buttonText: "Masuk sebagai Siswa",
  },

  ortu: {
    label: "Orang Tua",
    userPlaceholder: "Username Orang Tua",
    passPlaceholder: "Password Orang Tua",
    buttonText: "Masuk sebagai Orang Tua",
  },

  guru: {
    label: "Guru",
    userPlaceholder: "Username Guru",
    passPlaceholder: "Password Guru",
    buttonText: "Masuk sebagai Guru",
  },
};

/* ======================================================
   PILIH ROLE LOGIN
====================================================== */

function setClassAccessRole(role) {
  role = String(role || "public")
    .trim()
    .toLowerCase();

  if (AppState.classAccess?.active || AppState.user?.login) {
    showClassAccessMessage(
      "Silakan Keluar Kelas/Akun terlebih dahulu untuk mengganti akses.",
      "muted",
    );
    return;
  }

  AppState.classAccess = {
    ...AppState.classAccess,
    role: role,
  };

  /* ------------------------------------------
     Update tombol role
  ------------------------------------------ */

  document.querySelectorAll("[data-class-role]").forEach((button) => {
    const active = button.dataset.classRole === role;

    button.classList.toggle("active", active);

    button.classList.toggle("btn-primary", active);

    button.classList.toggle("btn-outline-primary", !active);
  });

  updateClassAccessFormVisibility();

  updateLoginFormLabels();
}

/* ======================================================
   UPDATE LABEL LOGIN
====================================================== */

function updateLoginFormLabels() {
  const role = AppState.classAccess?.role || "siswa";

  const config = LOGIN_ROLES[role] || LOGIN_ROLES.siswa;

  const usernameInput = document.getElementById("classAccessUsername");

  const passwordInput = document.getElementById("classAccessPassword");

  const loginButton = document.getElementById("classAccessLoginBtn");

  const roleLabel = document.getElementById("classAccessRoleLabel");

  if (roleLabel) {
    roleLabel.textContent = `Login sebagai ${config.label}`;
  }

  if (usernameInput) {
    usernameInput.placeholder = config.userPlaceholder;
  }

  if (passwordInput) {
    passwordInput.placeholder = config.passPlaceholder;
  }

  if (loginButton) {
    loginButton.textContent = config.buttonText;
  }
}

/* ======================================================
   LOGIN USER
====================================================== */

async function loginClassAccess() {
  const usernameInput = document.getElementById("classAccessUsername");

  const passwordInput = document.getElementById("classAccessPassword");

  if (!usernameInput || !passwordInput) {
    return;
  }

  const username = usernameInput.value.trim();

  const password = passwordInput.value.trim();

  /* ------------------------------------------
     VALIDASI
  ------------------------------------------ */

  if (!username || !password) {
    showClassAccessMessage("Username dan password wajib diisi.", "danger");

    return;
  }

  try {
    showLoading();

    showClassAccessMessage("Melakukan login...", "muted");

    /* ------------------------------------------
       AUTHENTICATION
    ------------------------------------------ */

    const selectedRole = String(AppState.classAccess?.role || "")
      .trim()
      .toLowerCase();

    const user = await Auth.login(username, password, selectedRole);

    console.log("Login berhasil:", user);

    /* ------------------------------------------
   PERTAHANKAN CLASS ACCESS
------------------------------------------ */

    const savedClassAccess = Storage.get("classAccess");

    if (savedClassAccess && savedClassAccess.active && savedClassAccess.kode) {
      AppState.classAccess = {
        ...savedClassAccess,
        active: true,
        kode: String(savedClassAccess.kode).trim().toUpperCase(),
        role: user?.role || selectedRole || "public",
      };

      AppState.setKelas(AppState.classAccess.kode);

      Storage.set("classAccess", AppState.classAccess);
    }

    /* ------------------------------------------
   CEK ROLE
------------------------------------------ */

    const userRole = String(user?.role || "")
      .trim()
      .toLowerCase();

    if (!["siswa", "ortu", "guru", "admin"].includes(userRole)) {
      throw new Error("Role akun tidak dikenali.");
    }

    /* ------------------------------------------
   PASTIKAN MODE LMS
------------------------------------------ */

    AppState.setUserMode(userRole);

    /* ------------------------------------------
       BERSIHKAN INPUT
    ------------------------------------------ */

    usernameInput.value = "";

    passwordInput.value = "";

    /* ------------------------------------------
       UPDATE LAYOUT
    ------------------------------------------ */

    if (typeof applyApplicationLayout === "function") {
      applyApplicationLayout();
    }

    /* ------------------------------------------
       UPDATE FORM
    ------------------------------------------ */

    updateClassAccessFormVisibility();

    updateLoginFormLabels();

    /* ------------------------------------------
       UPDATE HEADER
    ------------------------------------------ */

    if (
      typeof Header !== "undefined" &&
      typeof Header.ensureAccessControls === "function"
    ) {
      Header.ensureAccessControls();
    }

    /* ------------------------------------------
       PESAN
    ------------------------------------------ */

    showClassAccessMessage(`Login berhasil sebagai ${userRole}.`, "success");

    console.log("Access Mode:", AppState.access.mode);

    /* ------------------------------------------
       DASHBOARD
    ------------------------------------------ */

    window.location.hash = "#dashboard";

    // Sinkronkan ulang UI setelah dashboard selesai dirender
    setTimeout(() => {
      const loggedRole = String(AppState.user?.role || "")
        .trim()
        .toLowerCase();

      if (["siswa", "ortu", "guru"].includes(loggedRole)) {
        AppState.classAccess.role = loggedRole;

        if (AppState.classAccess.active) {
          Storage.set("classAccess", AppState.classAccess);
        }
      }

      updateClassAccessUI();
      updateClassAccessFormVisibility();
      updateLoginFormLabels();

      if (
        typeof Header !== "undefined" &&
        typeof Header.ensureAccessControls === "function"
      ) {
        Header.ensureAccessControls();
      }

      if (
        typeof Sidebar !== "undefined" &&
        typeof Sidebar.applyState === "function"
      ) {
        Sidebar.applyState();
      }

      if (typeof updateAdminFooterVisibility === "function") {
        updateAdminFooterVisibility();
      }
    }, 0);
  } catch (err) {
    console.error("Login Error:", err);

    showClassAccessMessage(
      err.message || "Login gagal. Periksa username dan password.",
      "danger",
    );
  } finally {
    hideLoading();
  }
}

/* ======================================================
   LOGOUT AKUN
====================================================== */
function logoutUser() {
  /* ======================================================
   LOGOUT SEMUA AKSES
====================================================== */

  function logoutAllAccess() {
    /* Logout akun jika sedang login */
    if (AppState.user?.login) {
      Auth.logout();
    }

    /* Keluar dari kelas */
    Storage.remove("classAccess");

    AppState.classAccess = {
      active: false,
      role: "public",
      kode: "",
      kelas: [],
    };

    /* Kembali ke PUBLIC */
    AppState.setPublic();

    /* Update layout */
    if (typeof applyApplicationLayout === "function") {
      applyApplicationLayout();
    }

    /* Update UI */
    if (typeof updateClassAccessUI === "function") {
      updateClassAccessUI();
    }

    if (typeof updateClassAccessFormVisibility === "function") {
      updateClassAccessFormVisibility();
    }

    if (typeof updateLoginFormLabels === "function") {
      updateLoginFormLabels();
    }

    if (
      typeof Header !== "undefined" &&
      typeof Header.ensureAccessControls === "function"
    ) {
      Header.ensureAccessControls();
    }

    if (
      typeof Sidebar !== "undefined" &&
      typeof Sidebar.applyState === "function"
    ) {
      Sidebar.applyState();
    }

    if (typeof updateAdminFooterVisibility === "function") {
      updateAdminFooterVisibility();
    }

    /* Bersihkan pesan login */
    const loginMessage = document.getElementById("classAccessMessage");

    if (loginMessage) {
      loginMessage.textContent = "";
      loginMessage.className = "small text-center mt-3 d-none";
    }

    console.log("Logout semua akses berhasil.");

    window.location.hash = "#dashboard";
  }

  /* ==========================================
     LOGOUT SESSION
  ========================================== */

  Auth.logout();

  /* ==========================================
     KEMBALIKAN ROLE FORM KE PUBLIC
  ========================================== */

  if (
    !AppState.classAccess?.active &&
    typeof setClassAccessRole === "function"
  ) {
    setClassAccessRole("public");
  }

  /* ==========================================
     UPDATE FORM LOGIN
  ========================================== */

  if (typeof updateClassAccessFormVisibility === "function") {
    updateClassAccessFormVisibility();
  }

  if (typeof updateLoginFormLabels === "function") {
    updateLoginFormLabels();
  }

  /* ==========================================
     UPDATE STATUS DASHBOARD
  ========================================== */

  if (typeof updateClassAccessUI === "function") {
    updateClassAccessUI();
  }

  /* ==========================================
   BERSIHKAN PESAN LOGIN LAMA
========================================== */

  const loginMessage = document.getElementById("classAccessMessage");

  if (loginMessage) {
    loginMessage.textContent = "";

    loginMessage.className = "small text-center mt-3 d-none";
  }

  /* ==========================================
     UPDATE HEADER
  ========================================== */

  if (
    typeof Header !== "undefined" &&
    typeof Header.ensureAccessControls === "function"
  ) {
    Header.ensureAccessControls();
  }

  /* ==========================================
     UPDATE SIDEBAR
  ========================================== */

  if (
    typeof Sidebar !== "undefined" &&
    typeof Sidebar.applyState === "function"
  ) {
    Sidebar.applyState();
  }

  /* ==========================================
     HILANGKAN TOMBOL KELUAR AKUN
  ========================================== */

  const headerLogout = document.getElementById("headerUserLogoutBtn");

  if (headerLogout) {
    headerLogout.classList.add("d-none");

    headerLogout.style.display = "none";
  }

  const sidebarLogout = document.getElementById("sidebarUserLogoutWrap");

  if (sidebarLogout) {
    sidebarLogout.style.display = "none";
  }

  console.log("Logout UI berhasil disinkronkan.");
}

/* ======================================================
   LOGOUT SEMUA AKSES
====================================================== */

function logoutAllAccess() {
  console.log("Logout semua akses...");

  /* Logout akun */
  if (AppState.user?.login) {
    Auth.logout();
  }

  /* Keluar kelas */
  if (typeof logoutClassAccess === "function") {
    logoutClassAccess();
  } else {
    Storage.remove("classAccess");

    AppState.classAccess = {
      active: false,
      role: "public",
      kode: "",
      kelas: [],
    };
  }

  /* Kembali PUBLIC */
  if (typeof AppState.setPublic === "function") {
    AppState.setPublic();
  }

  /* Sinkronkan UI */
  if (typeof updateClassAccessUI === "function") {
    updateClassAccessUI();
  }

  if (typeof updateClassAccessFormVisibility === "function") {
    updateClassAccessFormVisibility();
  }

  if (typeof updateLoginFormLabels === "function") {
    updateLoginFormLabels();
  }

  if (
    typeof Header !== "undefined" &&
    typeof Header.ensureAccessControls === "function"
  ) {
    Header.ensureAccessControls();
  }

  if (
    typeof Sidebar !== "undefined" &&
    typeof Sidebar.applyState === "function"
  ) {
    Sidebar.applyState();
  }

  console.log("Logout semua akses berhasil.");
}

/* ======================================================
   INIT LOGIN MODULE
====================================================== */

function initLoginModule() {
  updateClassAccessFormVisibility();

  updateLoginFormLabels();

  console.log("Login Module Ready");
}

console.log("Login Module Loaded");
