/* ======================================================
   e-Learn TSM MUPA
   File        : admin.js
   Description : Administrator Login
====================================================== */

function updateAdminFooterVisibility() {
  const adminButton = document.querySelector(".admin-footer-btn");

  if (!adminButton) return;

  const user = AppState.user || {};

  const isLoggedIn = user.login === true || !!user.username;

  const role = String(user.role || "").toLowerCase();

  if (isLoggedIn && role !== "public") {
    adminButton.style.display = "none";
    return;
  }

  adminButton.style.display = "";
}

function showAdminLogin() {
  const loginForm = document.getElementById("adminLoginForm");

  const appContent = document.getElementById("app-content");

  if (!loginForm) {
    console.error("Form Administrator tidak ditemukan.");
    return;
  }

  /* Sembunyikan Dashboard */
  if (appContent) {
    appContent.style.display = "none";
  }

  /* Tampilkan Login Administrator */
  loginForm.classList.remove("d-none");
  loginForm.style.display = "block";

  /* Kembali ke atas */
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  const usernameInput = document.getElementById("adminUsername");

  if (usernameInput) {
    setTimeout(() => {
      usernameInput.focus();
    }, 100);
  }
}

function hideAdminLogin() {
  const loginForm = document.getElementById("adminLoginForm");

  const appContent = document.getElementById("app-content");

  /* Sembunyikan form Admin */
  if (loginForm) {
    loginForm.classList.add("d-none");
    loginForm.style.display = "none";
  }

  /* Kembalikan Dashboard */
  if (appContent) {
    appContent.style.display = "";
  }

  /* Bersihkan input */
  const usernameInput = document.getElementById("adminUsername");

  const passwordInput = document.getElementById("adminPassword");

  if (usernameInput) {
    usernameInput.value = "";
  }

  if (passwordInput) {
    passwordInput.value = "";
  }

  /* Kembali ke atas */
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

async function loginAdministrator() {
  const usernameInput = document.getElementById("adminUsername");

  const passwordInput = document.getElementById("adminPassword");

  if (!usernameInput || !passwordInput) {
    console.error("Form login administrator tidak ditemukan.");
    return;
  }

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Username dan password wajib diisi.");
    return;
  }

  try {
    showLoading();

    const user = await Auth.login(username, password, "admin");

    if (!user || user.role !== "admin") {
      throw new Error("Akun bukan Administrator.");
    }

    console.log("Login Administrator berhasil:", user);

    window.location.hash = "#admin";
  } catch (err) {
    console.error("Login Administrator Error:", err);

    alert(err.message || "Login Administrator gagal.");
  } finally {
    hideLoading();
  }
}
