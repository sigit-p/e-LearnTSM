const Loading = {
  show() {
    document.getElementById("loading")?.classList.add("show");
  },

  hide() {
    document.getElementById("loading")?.classList.remove("show");
  },
};
