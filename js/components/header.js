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
   HAPUS TOMBOL LOGOUT LAMA
========================================== */

    document.getElementById("headerUserLogoutBtn")?.remove();
    document.getElementById("headerClassLogoutBtn")?.remove();
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

    /* ==========================================
       CARI / BUAT AREA KANAN HEADER
    ========================================== */

    let actions = header.querySelector(".header-actions");

    if (!actions) {
      actions = document.createElement("div");
      actions.className = "header-actions";

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
       SATU TOMBOL KELUAR
    ========================================== */

    let logoutBtn = document.getElementById("headerLogoutBtn");

    if (!logoutBtn) {
      logoutBtn = document.createElement("button");

      logoutBtn.id = "headerLogoutBtn";
      logoutBtn.type = "button";
      logoutBtn.className = "btn btn-outline-danger btn-sm d-none";

      logoutBtn.innerHTML = `
        <i class="bi bi-box-arrow-right"></i>
        Keluar
      `;

      logoutBtn.addEventListener("click", () => {
        console.log("Tombol Keluar diklik.");

        if (typeof logoutAllAccess === "function") {
          logoutAllAccess();
          return;
        }

        if (typeof logoutUser === "function") {
          logoutUser();
          return;
        }

        console.error("Fungsi logout tidak ditemukan.");
      });

      const avatar = actions.querySelector(".avatar");

      if (avatar) {
        actions.insertBefore(logoutBtn, avatar);
      } else {
        actions.appendChild(logoutBtn);
      }
    }

    /* ==========================================
       TENTUKAN STATUS AKTIF
    ========================================== */

    const isLoggedIn = !!AppState.user?.login;
    const classActive = !!AppState.classAccess?.active;

    /* ==========================================
       UPDATE ACCESS STATUS
    ========================================== */

    const accessMode = AppState.access?.mode || "public";
    const accessCode = AppState.access?.kode || "";

    const accessLabels = {
      public: "PUBLIC",
      kelas: accessCode || "KELAS",
      siswa: "SISWA",
      ortu: "ORTU",
      guru: "GURU",
      admin: "ADMIN",
    };

    const accessIcons = {
      public: "bi-globe2",
      kelas: "bi-mortarboard-fill",
      siswa: "bi-person-fill",
      ortu: "bi-people-fill",
      guru: "bi-person-badge-fill",
      admin: "bi-shield-lock-fill",
    };

    if (status) {
      status.innerHTML = `
        <i class="bi ${accessIcons[accessMode] || "bi-globe2"}"></i>
        ${accessLabels[accessMode] || "PUBLIC"}
      `;

      status.className =
        accessMode === "public"
          ? "badge bg-success-subtle text-success"
          : accessMode === "kelas"
            ? "badge bg-primary-subtle text-primary"
            : "badge bg-dark text-white";
    }

    /* ==========================================
       TAMPILKAN SATU TOMBOL KELUAR
    ========================================== */

    if (logoutBtn) {
      logoutBtn.classList.toggle("d-none", !(isLoggedIn || classActive));
    }
  },
};

/* ======================================================
   READY
====================================================== */

console.log("Header Component Loaded");
