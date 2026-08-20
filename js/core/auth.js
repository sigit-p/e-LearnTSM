/* ======================================================
   e-Learn TSM MUPA
   ------------------------------------------------------
   File        : auth.js
   Version     : 2.0.0
   Description : Authentication & User Session
====================================================== */

const Auth = {
  /* ======================================================
     LOGIN
  ====================================================== */

  async login(username, password, role = "") {
    const user = await API.login(username, password, role);

    /* ------------------------------------------
     Validasi
  ------------------------------------------ */

    if (!user) {
      throw new Error("Username atau password salah.");
    }

    /* ------------------------------------------
     Simpan session user
  ------------------------------------------ */

    Storage.set("user", user);

    AppState.user = {
      ...AppState.user,

      ...user,

      login: true,
    };

    /* ------------------------------------------
     Tentukan mode berdasarkan role
  ------------------------------------------ */

    const userRole = String(user.role || "")
      .trim()
      .toLowerCase();

    if (["siswa", "ortu", "guru", "admin"].includes(userRole)) {
      AppState.setUserMode(userRole);
    }

    /* ------------------------------------------
     Terapkan layout
  ------------------------------------------ */

    if (typeof applyApplicationLayout === "function") {
      applyApplicationLayout();
    }

    return user;
  },
  /* ======================================================
     LOGOUT
  ====================================================== */

  logout() {
    /* ------------------------------------------
       Hapus session user
    ------------------------------------------ */

    Storage.remove("user");

    /* ------------------------------------------
       Reset user
    ------------------------------------------ */

    AppState.user = {
      login: false,

      username: "",

      nama: "",

      role: CONFIG.DEFAULT_ROLE,
    };

    /* ------------------------------------------
       Tentukan kembali mode
       
       Jika masih ada classAccess:
       → KELAS

       Jika tidak:
       → PUBLIC
    ------------------------------------------ */

    if (AppState.classAccess && AppState.classAccess.active) {
      AppState.setKelas(AppState.classAccess.kode);
    } else {
      AppState.setPublic();
    }

    /* ------------------------------------------
       Terapkan layout
    ------------------------------------------ */

    if (typeof applyApplicationLayout === "function") {
      applyApplicationLayout();
    }

    /* ------------------------------------------
       Kembali ke Dashboard
    ------------------------------------------ */

    window.location.hash = "#dashboard";
  },

  /* ======================================================
     CURRENT USER
  ====================================================== */

  user() {
    return Storage.get("user");
  },

  /* ======================================================
     CHECK LOGIN
  ====================================================== */
  /* ======================================================
   CHECK LOGIN
====================================================== */

  check() {
    const user = Storage.get("user");

    /* ------------------------------------------
     TIDAK ADA SESSION
  ------------------------------------------ */

    if (!user) {
      AppState.user = {
        login: false,

        username: "",

        nama: "",

        role: CONFIG.DEFAULT_ROLE,
      };

      /*
       * Pastikan mode kembali Public/Kelas
       */

      if (AppState.classAccess && AppState.classAccess.active) {
        AppState.setKelas(AppState.classAccess.kode);
      } else {
        AppState.setPublic();
      }

      /*
       * Refresh seluruh layout
       */

      if (typeof applyApplicationLayout === "function") {
        applyApplicationLayout();
      }

      if (
        typeof Sidebar !== "undefined" &&
        typeof Sidebar.applyState === "function"
      ) {
        Sidebar.applyState();
      }

      if (
        typeof Header !== "undefined" &&
        typeof Header.ensureAccessControls === "function"
      ) {
        Header.ensureAccessControls();
      }

      return false;
    }

    /* ------------------------------------------
     RESTORE SESSION
  ------------------------------------------ */

    AppState.user = {
      ...AppState.user,

      ...user,

      login: true,
    };

    /* ------------------------------------------
     RESTORE ROLE
  ------------------------------------------ */

    const role = String(user.role || "")
      .trim()
      .toLowerCase();

    if (["siswa", "ortu", "guru", "admin"].includes(role)) {
      AppState.setUserMode(role);
    }

    /* ------------------------------------------
     REFRESH LAYOUT
  ------------------------------------------ */

    if (typeof applyApplicationLayout === "function") {
      applyApplicationLayout();
    }

    /*
     * Paksa sidebar mengikuti mode terbaru
     */

    AppState.ui.sidebar = true;

    if (
      typeof Sidebar !== "undefined" &&
      typeof Sidebar.applyState === "function"
    ) {
      Sidebar.applyState();
    }

    /*
     * Refresh tombol header
     */

    if (
      typeof Header !== "undefined" &&
      typeof Header.ensureAccessControls === "function"
    ) {
      Header.ensureAccessControls();
    }

    return true;
  },
  /* ======================================================
     ROLE
  ====================================================== */

  role() {
    return AppState.user.login ? AppState.user.role : null;
  },

  /* ======================================================
     ADMIN
  ====================================================== */

  isAdmin() {
    return this.role() === "admin";
  },

  /* ======================================================
     GURU
  ====================================================== */

  isGuru() {
    return this.role() === "guru";
  },

  /* ======================================================
     ORTU
  ====================================================== */

  isOrtu() {
    return this.role() === "ortu";
  },

  /* ======================================================
     SISWA
  ====================================================== */

  isSiswa() {
    return this.role() === "siswa";
  },

  /* ======================================================
     AUTHENTICATED
  ====================================================== */

  isAuthenticated() {
    return AppState.user.login === true;
  },
};

/* ======================================================
   READY
====================================================== */

console.log("Auth Ready");
