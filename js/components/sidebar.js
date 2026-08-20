/* ======================================================
   e-Learn TSM MUPA
   sidebar.js
====================================================== */

const Sidebar = {
  init() {
    const overlay = document.getElementById("sidebarOverlay");

    overlay?.addEventListener("click", () => {
      this.close();
    });

    window.addEventListener("resize", () => this.applyState());

    this.applyState();

    console.log("Sidebar Ready");
  },

  toggle() {
    /*
     * Sidebar hanya boleh digunakan
     * pada LMS Layout.
     */

    if (!AppState.isLMS()) {
      return;
    }

    AppState.ui.sidebar = !AppState.ui.sidebar;

    this.applyState();
  },

  open() {
    if (!AppState.isLMS()) {
      return;
    }

    AppState.ui.sidebar = true;

    this.applyState();
  },

  close() {
    AppState.ui.sidebar = false;

    this.applyState();
  },

  applyState() {
    const sidebar = document.getElementById("sidebar");

    const overlay = document.getElementById("sidebarOverlay");

    const main = document.querySelector(".main");

    if (!sidebar || !main) {
      return;
    }

    /* ==========================================
       TENTUKAN LAYOUT
       
       PUBLIC / KELAS
       → WEB
       
       SISWA / ORTU / GURU / ADMIN
       → LMS
    ========================================== */

    const isLMS = AppState.isLMS();

    /* ==========================================
       WEB LAYOUT
    ========================================== */

    if (!isLMS) {
      sidebar.style.display = "none";

      main.style.marginLeft = "0";

      main.classList.remove("expand");

      sidebar.classList.remove("show");

      sidebar.classList.remove("collapsed");

      overlay?.classList.remove("show");

      return;
    }

    /* ==========================================
       LMS LAYOUT
    ========================================== */

    sidebar.style.display = "flex";

    /* ==========================================
       MOBILE / TABLET
    ========================================== */

    if (window.innerWidth <= 992) {
      sidebar.classList.remove("collapsed");

      main.classList.remove("expand");

      main.style.marginLeft = "";

      sidebar.classList.toggle("show", AppState.ui.sidebar);

      overlay?.classList.toggle("show", AppState.ui.sidebar);

      return;
    }

    /* ==========================================
       DESKTOP
    ========================================== */

    sidebar.classList.toggle("collapsed", !AppState.ui.sidebar);

    main.classList.toggle("expand", !AppState.ui.sidebar);

    main.style.marginLeft = AppState.ui.sidebar ? "260px" : "80px";

    sidebar.classList.remove("show");

    overlay?.classList.remove("show");
  },
};
