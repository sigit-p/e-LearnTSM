/* ======================================================
   e-Learn TSM MUPA
   File        : header.js
   Version     : 2.0.0
   Description : Header Component
====================================================== */

const Header = {
  init() {
    const header = document.querySelector(".header");

    if (!header) {
      console.warn("Header tidak ditemukan.");
      return;
    }

    /* ==========================================
       TOGGLE SIDEBAR
    ========================================== */

    const toggleButton =
      header.querySelector("#sidebarToggle") || header.querySelector("button");

    if (toggleButton) {
      toggleButton.addEventListener("click", () => {
        if (
          typeof Sidebar !== "undefined" &&
          typeof Sidebar.toggle === "function"
        ) {
          Sidebar.toggle();

          return;
        }

        const sidebar = document.getElementById("sidebar");

        const overlay = document.getElementById("sidebarOverlay");

        const main = document.querySelector(".main");

        if (!sidebar || !main) {
          return;
        }

        if (window.innerWidth <= 992) {
          sidebar.classList.toggle("show");

          overlay?.classList.toggle("show");
        } else {
          sidebar.classList.toggle("collapsed");

          main.classList.toggle("expand");
        }
      });
    }

    /* ==========================================
       HEADER ACCESS AREA
    ========================================== */

    this.ensureAccessControls();

    /* ==========================================
       APPLY CURRENT ACCESS STATE
    ========================================== */

    if (typeof updateClassAccessUI === "function") {
      updateClassAccessUI();
    }

    console.log("Header Ready");
  },

  /* ==========================================
     ACCESS CONTROLS
  ========================================== */

  ensureAccessControls() {
    const header = document.querySelector(".header");

    if (!header) {
      return;
    }

    /*
     * Cari area kanan header.
     */

    let actions = header.querySelector(".header-actions");

    /*
     * Kalau belum ada, buat.
     */

    if (!actions) {
      actions = document.createElement("div");

      actions.className = "header-actions";

      /*
       * Cari avatar.
       */

      const avatar = header.querySelector(".avatar");

      if (avatar) {
        avatar.parentNode.insertBefore(actions, avatar);

        actions.appendChild(avatar);
      } else {
        header.appendChild(actions);
      }
    }

    /* ==========================================
       ACCESS STATUS
    ========================================== */

    let status = document.getElementById("accessStatus");

    if (!status) {
      status = document.createElement("span");

      status.id = "accessStatus";

      status.className = "badge bg-success-subtle text-success";

      status.innerHTML = `
        <i class="bi bi-globe2"></i>
        PUBLIC
      `;

      const avatar = actions.querySelector(".avatar");

      if (avatar) {
        actions.insertBefore(status, avatar);
      } else {
        actions.appendChild(status);
      }
    }

    /* ==========================================
       LOGOUT KELAS
    ========================================== */
    /* ==========================================
   LOGOUT AKUN
========================================== */

    let logoutUserBtn = document.getElementById("headerUserLogoutBtn");

    if (!logoutUserBtn) {
      logoutUserBtn = document.createElement("button");

      logoutUserBtn.id = "headerUserLogoutBtn";

      logoutUserBtn.type = "button";

      logoutUserBtn.className = "btn btn-outline-danger btn-sm d-none";

      logoutUserBtn.innerHTML = `
    <i class="bi bi-box-arrow-right"></i>
    Keluar Akun
  `;

      logoutUserBtn.addEventListener("click", () => {
        if (typeof logoutUser === "function") {
          logoutUser();
        }
      });

      const avatar = actions.querySelector(".avatar");

      if (avatar) {
        actions.insertBefore(logoutUserBtn, avatar);
      } else {
        actions.appendChild(logoutUserBtn);
      }
    }
    const userLogoutBtn = document.getElementById("headerUserLogoutBtn");

    const classLogoutBtn = document.getElementById("headerClassLogoutBtn");

    const isLoggedIn = !!AppState.user?.login;

    const classActive = !!AppState.classAccess?.active;

    /* Keluar Akun */

    if (userLogoutBtn) {
      userLogoutBtn.classList.toggle("d-none", !isLoggedIn);
    }

    /* Keluar Kelas */

    if (classLogoutBtn) {
      classLogoutBtn.classList.toggle("d-none", !classActive);
    }
  },
};

/* ======================================================
   READY
====================================================== */

console.log("Header Component Loaded");
