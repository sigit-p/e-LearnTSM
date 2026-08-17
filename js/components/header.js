const Header = {
  init() {
    const toggleButton = document.querySelector(".header button");

    if (!toggleButton) {
      console.warn("Toggle button header tidak ditemukan.");
      return;
    }

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

      if (!sidebar || !main) return;

      if (window.innerWidth <= 992) {
        sidebar.classList.toggle("show");
        overlay?.classList.toggle("show");
      } else {
        sidebar.classList.toggle("collapsed");
        main.classList.toggle("expand");
      }
    });

    console.log("Header Ready");
  },
};
