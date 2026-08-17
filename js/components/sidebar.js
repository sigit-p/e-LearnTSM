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
    AppState.ui.sidebar = !AppState.ui.sidebar;
    this.applyState();
  },

  open() {
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

    if (!sidebar || !main) return;

    const canShowSidebar =
      !!AppState.user?.login || !!AppState.classAccess?.active;

    if (!canShowSidebar) {
      sidebar.style.display = "none";
      main.style.marginLeft = "0";
      sidebar.classList.remove("show");
      sidebar.classList.remove("collapsed");
      overlay?.classList.remove("show");
      return;
    }

    sidebar.style.display = "flex";

    if (window.innerWidth <= 992) {
      sidebar.classList.remove("collapsed");
      main.classList.remove("expand");
      sidebar.classList.toggle("show", AppState.ui.sidebar);
      overlay?.classList.toggle("show", AppState.ui.sidebar);
      return;
    }

    sidebar.classList.toggle("collapsed", !AppState.ui.sidebar);
    main.classList.toggle("expand", !AppState.ui.sidebar);
    sidebar.classList.remove("show");
    overlay?.classList.remove("show");
  },
};
