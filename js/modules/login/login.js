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
   FORM VISIBILITY
====================================================== */

function updateClassAccessFormVisibility() {
  const role = AppState.classAccess?.role || "public";

  const loginForm = document.getElementById("classAccessLoginForm");

  const codeForm = document.getElementById("classAccessCodeForm");

  const loginStatus = document.getElementById("classAccessLoginStatus");

  const loginStatusUsername = document.getElementById(
    "classAccessLoginStatusUsername",
  );

  const isLoggedIn = !!AppState.user?.login;

  /* ------------------------------------------
     Reset
  ------------------------------------------ */

  if (loginForm) {
    loginForm.style.display = "none";

    loginForm.classList.add("d-none");
  }

  if (codeForm) {
    codeForm.style.display = "none";

    codeForm.classList.add("d-none");
  }

  if (loginStatus) {
    loginStatus.style.display = "none";

    loginStatus.classList.add("d-none");
  }

  /* ------------------------------------------
     PUBLIC
  ------------------------------------------ */

  if (role === "public") {
    if (codeForm) {
      codeForm.style.display = "block";

      codeForm.classList.remove("d-none");
    }

    return;
  }

  /* ------------------------------------------
     SUDAH LOGIN
  ------------------------------------------ */

  if (isLoggedIn) {
    if (loginStatus) {
      loginStatus.style.display = "block";

      loginStatus.classList.remove("d-none");
    }

    if (loginStatusUsername) {
      const username =
        AppState.user?.username ||
        AppState.user?.name ||
        AppState.user?.nama ||
        "Pengguna";

      loginStatusUsername.textContent = username;
    }

    return;
  }

  /* ------------------------------------------
     BELUM LOGIN
  ------------------------------------------ */

  if (loginForm) {
    loginForm.style.display = "block";

    loginForm.classList.remove("d-none");
  }
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
  Auth.logout();
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
