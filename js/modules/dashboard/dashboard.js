/**
 * ======================================================
 * e-Learn TSM MUPA
 * ------------------------------------------------------
 * File        : dashboard.js
 * Version     : 2.0.0
 * Description : Dashboard Module
 * ======================================================
 */

Router.register("dashboard", loadDashboard);

/* ======================================================
   LOAD DASHBOARD
====================================================== */

async function loadDashboard() {
  try {
    showLoading();

    const data = await API.dashboard();

    console.log("Dashboard Data :", data);

    renderDashboard(data);
  } catch (err) {
    console.error("Dashboard Error :", err);

    error(err.message || "Gagal memuat dashboard.");
  } finally {
    hideLoading();
  }
}

/* ======================================================
   CLASS ACCESS
====================================================== */

async function enterClass() {
  const input = document.getElementById("classCodeInput");
  const role = AppState.classAccess?.role || "public";
  const isLoggedIn = !!AppState.user?.login;

  if (!input) {
    return;
  }

  if (role !== "public" && !isLoggedIn) {
    showClassAccessMessage("Anda harus login terlebih dahulu.", "danger");
    return;
  }

  const kode = input.value.trim().toUpperCase();

  if (!kode) {
    showClassAccessMessage("Kode kelas wajib diisi.", "danger");
    input.focus();
    return;
  }

  try {
    showLoading();
    showClassAccessMessage("Memeriksa kode kelas...", "muted");

    const result = await API.kelasByAkses(kode);

    console.log("Class Access :", result);

    if (!Array.isArray(result) || result.length === 0) {
      showClassAccessMessage("Kode kelas tidak ditemukan.", "danger");
      return;
    }

    const selectedRole =
      document.querySelector("[data-class-role].active")?.dataset.classRole ||
      AppState.classAccess?.role ||
      "siswa";

    AppState.classAccess = {
      active: true,
      role: selectedRole,
      kode: kode,
      kelas: result,
    };

    Storage.set("classAccess", AppState.classAccess);
    updateClassAccessUI();
    Sidebar.applyState();

    showClassAccessMessage(
      `Berhasil masuk ke ${kode} sebagai ${selectedRole}.`,
      "success",
    );
    console.log("Kelas Aktif :", AppState.classAccess);
  } catch (err) {
    console.error("Class Access Error :", err);
    showClassAccessMessage(
      err.message || "Gagal memeriksa kode kelas.",
      "danger",
    );
  } finally {
    hideLoading();
  }
}

/* ======================================================
   LOGOUT CLASS ACCESS
====================================================== */

function setClassAccessRole(role) {
  AppState.classAccess = {
    ...AppState.classAccess,
    role: role || "public",
  };

  document.querySelectorAll("[data-class-role]").forEach((button) => {
    const isActive = button.dataset.classRole === role;
    button.classList.toggle("active", isActive);
    button.classList.toggle("btn-primary", isActive);
    button.classList.toggle("btn-outline-primary", !isActive);
  });
  updateClassAccessFormVisibility();
  updateLoginFormLabels();
}

function updateClassAccessFormVisibility() {
  const role = AppState.classAccess?.role || "public";
  const loginForm = document.getElementById("classAccessLoginForm");
  const codeForm = document.getElementById("classAccessCodeForm");
  const isLoggedIn = !!AppState.user?.login;

  if (role === "public") {
    if (loginForm) loginForm.classList.add("d-none");
    if (codeForm) codeForm.classList.remove("d-none");
  } else {
    if (isLoggedIn) {
      if (loginForm) loginForm.classList.add("d-none");
      if (codeForm) codeForm.classList.remove("d-none");
    } else {
      if (loginForm) loginForm.classList.remove("d-none");
      if (codeForm) codeForm.classList.add("d-none");
    }
  }
}

function updateLoginFormLabels() {
  const role = AppState.classAccess?.role || "siswa";
  const usernameInput = document.getElementById("classAccessUsername");
  const passwordInput = document.getElementById("classAccessPassword");
  const loginButton = document.getElementById("classAccessLoginBtn");
  const roleLabel = document.getElementById("classAccessRoleLabel");

  const roleLabels = {
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

  const config = roleLabels[role] || roleLabels.siswa;

  if (roleLabel) roleLabel.textContent = `Login sebagai ${config.label}`;
  if (usernameInput) usernameInput.placeholder = config.userPlaceholder;
  if (passwordInput) passwordInput.placeholder = config.passPlaceholder;
  if (loginButton) loginButton.textContent = config.buttonText;
}

async function loginClassAccess() {
  const username = document.getElementById("classAccessUsername");
  const password = document.getElementById("classAccessPassword");

  if (!username || !password) return;

  const user = username.value.trim();
  const pass = password.value.trim();

  if (!user || !pass) {
    showClassAccessMessage("Username dan password wajib diisi.", "danger");
    return;
  }

  try {
    showLoading();
    showClassAccessMessage("Melakukan login...", "muted");

    const result = await API.login(user, pass);

    AppState.user = {
      ...AppState.user,
      ...result,
      login: true,
    };

    Storage.set("user", AppState.user);
    username.value = "";
    password.value = "";

    updateClassAccessFormVisibility();
    showClassAccessMessage(
      "Login berhasil. Silakan masukkan kode kelas.",
      "success",
    );
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

function logoutClassAccessButton() {
  logoutClassAccess();
  showClassAccessMessage("Kembali ke mode publik.", "muted");
  setClassAccessRole("public");
}

/* ======================================================
   CLASS ACCESS MESSAGE
====================================================== */

function showClassAccessMessage(message, type = "muted") {
  const element = document.getElementById("classAccessMessage");

  if (!element) {
    return;
  }

  element.className = `small text-center mt-3 text-${type}`;
  element.textContent = message;
}

/* ======================================================
   UPDATE ACCESS STATUS
====================================================== */

function updateClassAccessUI() {
  const status = document.getElementById("accessStatus");
  const sidebarBadge = document.getElementById("sidebarAccessBadge");
  const sidebarText = document.getElementById("sidebarAccessText");
  const sidebarWrap = document.querySelector(".sidebar-access-wrap");
  const classLogoutBtn = document.getElementById("classAccessLogoutBtn");
  const sidebarClassLogoutBtn = document.getElementById(
    "sidebarClassLogoutBtn",
  );
  const headerClassLogoutBtn = document.getElementById("headerClassLogoutBtn");
  const roleButtons = document.querySelectorAll("[data-class-role]");

  const active = AppState.classAccess?.active && !!AppState.classAccess?.kode;
  const showSidebarAccess = active || !!AppState.user?.login;

  if (roleButtons.length) {
    const selectedRole = AppState.classAccess?.role || "public";

    roleButtons.forEach((button) => {
      const isActive = button.dataset.classRole === selectedRole;
      button.classList.toggle("active", isActive);
      button.classList.toggle("btn-primary", isActive);
      button.classList.toggle("btn-outline-primary", !isActive);
    });
  }

  if (sidebarWrap) {
    sidebarWrap.style.display = showSidebarAccess ? "block" : "none";
  }

  if (classLogoutBtn) {
    classLogoutBtn.classList.toggle("d-none", !active);
  }

  if (sidebarClassLogoutBtn) {
    sidebarClassLogoutBtn.classList.toggle("d-none", !active);
  }

  if (headerClassLogoutBtn) {
    headerClassLogoutBtn.classList.toggle("d-none", !active);
  }

  if (status) {
    if (active) {
      status.className = "badge bg-primary-subtle text-primary";
      status.innerHTML = `
        <i class="bi bi-mortarboard-fill"></i>
        ${escapeHtml(AppState.classAccess.kode)}
      `;
    } else {
      status.className = "badge bg-success-subtle text-success";
      status.innerHTML = `
        <i class="bi bi-globe2"></i>
        PUBLIC
      `;
    }
  }

  if (sidebarBadge) {
    if (active) {
      sidebarBadge.className = "badge bg-primary-subtle text-primary px-3 py-2";
      sidebarBadge.innerHTML = `
        <i class="bi bi-mortarboard-fill"></i>
        <span class="sidebar-badge-label">${escapeHtml(AppState.classAccess.kode)}</span>
      `;
    } else if (AppState.user?.login) {
      sidebarBadge.className = "badge bg-info-subtle text-info px-3 py-2";
      sidebarBadge.innerHTML = `
        <i class="bi bi-shield-lock"></i>
        <span class="sidebar-badge-label">PENGELOLA</span>
      `;
    } else {
      sidebarBadge.className = "badge bg-success-subtle text-success px-3 py-2";
      sidebarBadge.innerHTML = `
        <i class="bi bi-globe2"></i>
        <span class="sidebar-badge-label">PUBLIC</span>
      `;
    }
  }

  if (sidebarText) {
    if (active) {
      sidebarText.textContent = "Kelas aktif";
    } else if (AppState.user?.login) {
      sidebarText.textContent = "Pengelola";
    } else {
      sidebarText.textContent = "Akses tanpa login";
    }
  }
}

/* ======================================================
   RENDER DASHBOARD
====================================================== */

function renderDashboard(data) {
  const container = document.getElementById("app-content");

  if (!container) {
    console.error("Element #app-content tidak ditemukan.");
    return;
  }

  const welcome = data?.welcome || {};
  const statistik = data?.statistik || {};
  const progress = data?.progress || {};

  const pengumuman = Array.isArray(data?.pengumuman) ? data.pengumuman : [];

  const aktivitas = Array.isArray(data?.aktivitas) ? data.aktivitas : [];

  const cbt = Array.isArray(data?.cbt) ? data.cbt : [];

  container.innerHTML = `

    <!-- ==========================================
         WELCOME
    =========================================== -->

<section class="dashboard-hero mb-4">

  <div class="row align-items-center">

    <div class="col-lg-7">

      <span class="badge bg-light text-primary mb-3">
        🚀 DIGITAL LEARNING PLATFORM
      </span>

      <h1 class="display-5 fw-bold mb-3">
        Selamat Datang di
        <span>e-Learn TSM MUPA</span>
      </h1>

      <p class="lead mb-4">
        Platform pembelajaran digital Teknik Sepeda Motor
        SMK Muhammadiyah Pakem.
      </p>

      <div class="d-flex flex-wrap gap-2">

        <button
          class="btn btn-light btn-lg"
          onclick="openClassAccess()"
        >
          <i class="bi bi-book"></i>
          Masuk Pembelajaran
        </button>

        <button
          class="btn btn-outline-light btn-lg"
          onclick="openNilaiAccess()"
        >
          <i class="bi bi-award"></i>
          Cek Nilai
        </button>

      </div>

    </div>


    <div class="col-lg-5 mt-4 mt-lg-0">

      <div class="class-access-card">

        <div class="text-center mb-3">

          <div class="access-icon">
            <i class="bi bi-mortarboard-fill"></i>
          </div>

          <h4 class="fw-bold">
            Masuk ke Kelas
          </h4>

          <p class="text-muted small mb-0">
            Masukkan kode kelas Anda
          </p>

        </div>

        <div class="d-flex flex-wrap gap-2 mt-3 mb-3">
          <button
            type="button"
            class="btn btn-sm btn-primary active"
            data-class-role="public"
            onclick="setClassAccessRole('public')"
          >
            Public
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-primary"
            data-class-role="siswa"
            onclick="setClassAccessRole('siswa')"
          >
            Siswa
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-primary"
            data-class-role="ortu"
            onclick="setClassAccessRole('ortu')"
          >
            Ortu
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-primary"
            data-class-role="guru"
            onclick="setClassAccessRole('guru')"
          >
            Guru
          </button>
        </div>

        <!-- Login Form (for non-public roles) -->
        <div id="classAccessLoginForm" class="d-none mt-3">
          <div class="text-center mb-2">
            <small id="classAccessRoleLabel" class="text-muted">
              Login sebagai Siswa
            </small>
          </div>
          <input
            type="text"
            id="classAccessUsername"
            class="form-control form-control-sm mb-2"
            placeholder="Username Siswa"
          >
          <input
            type="password"
            id="classAccessPassword"
            class="form-control form-control-sm mb-2"
            placeholder="Password Siswa"
          >
          <button
            id="classAccessLoginBtn"
            class="btn btn-secondary w-100 btn-sm"
            onclick="loginClassAccess()"
          >
            Masuk sebagai Siswa
          </button>
        </div>

        <!-- Class Code Form -->
        <div id="classAccessCodeForm">
          <input
            type="text"
            id="classCodeInput"
            class="form-control form-control-lg text-uppercase"
            placeholder="Contoh: XTSM"
            maxlength="10"
          >

          <button
            class="btn btn-primary w-100 mt-3"
            onclick="enterClass()"
          >
            Masuk Pembelajaran
            <i class="bi bi-arrow-right"></i>
          </button>
        </div>

        <div
          id="classAccessMessage"
          class="small text-center mt-3"
        ></div>

        <button
          id="classAccessLogoutBtn"
          class="btn btn-outline-secondary btn-sm w-100 mt-3 d-none"
          onclick="logoutClassAccessButton()"
        >
          Keluar Kelas
        </button>

      </div>

    </div>

  </div>

</section>

    <!-- ==========================================
         PENGUMUMAN + AKTIVITAS
    =========================================== -->

    <div class="row g-4 mt-1">


      <!-- PENGUMUMAN -->

      <div class="col-lg-6">

        <section class="card h-100">

          <div class="card-body">

            <div class="d-flex align-items-center mb-3">

              <div class="stat-icon me-3">
                <i class="bi bi-megaphone"></i>
              </div>

              <div>

                <h5 class="mb-1">
                  Pengumuman
                </h5>

                <small class="text-muted">
                  Informasi terbaru
                </small>

              </div>

            </div>

            ${renderAnnouncements(pengumuman)}

          </div>

        </section>

      </div>


      <!-- AKTIVITAS -->

      <div class="col-lg-6">

        <section class="card h-100">

          <div class="card-body">

            <div class="d-flex align-items-center mb-3">

              <div class="stat-icon me-3">
                <i class="bi bi-clock-history"></i>
              </div>

              <div>

                <h5 class="mb-1">
                  Aktivitas Terbaru
                </h5>

                <small class="text-muted">
                  Aktivitas sistem terbaru
                </small>

              </div>

            </div>

            ${renderActivities(aktivitas)}

          </div>

        </section>

      </div>

    </div>


    <!-- ==========================================
         STATISTIK
    =========================================== -->

    <section class="mt-4">

      <div class="grid grid-4">

        ${statCard("Siswa", statistik.siswa ?? 0, "bi-people")}

        ${statCard("Guru", statistik.guru ?? 0, "bi-person-badge")}

        ${statCard("Jurusan", statistik.jurusan ?? 0, "bi-diagram-3")}

        ${statCard("Kelas", statistik.kelas ?? 0, "bi-building")}

        ${statCard("Mapel", statistik.mapel ?? 0, "bi-book")}

        ${statCard("Materi", statistik.materi ?? 0, "bi-journal-text")}

        ${statCard("Jobsheet", statistik.jobsheet ?? 0, "bi-clipboard-check")}

        ${statCard("CBT", statistik.cbt ?? 0, "bi-pencil-square")}

      </div>

    </section>


    <!-- ==========================================
         PROGRESS PEMBELAJARAN
    =========================================== -->

    <section class="card mt-4">

      <div class="card-body">

        <div class="d-flex align-items-center mb-4">

          <div class="stat-icon me-3">
            <i class="bi bi-graph-up"></i>
          </div>

          <div>

            <h5 class="mb-1">
              Progress Pembelajaran
            </h5>

            <small class="text-muted">
              Ringkasan aktivitas pembelajaran
            </small>

          </div>

        </div>


        ${progressItem("Materi", progress.materi ?? 0)}

        ${progressItem("Jobsheet", progress.jobsheet ?? 0)}

        ${progressItem("Tugas", progress.tugas ?? 0)}

        ${progressItem("CBT", progress.cbt ?? 0)}

      </div>

    </section>


    <!-- ==========================================
         CBT
    =========================================== -->

    <section class="card mt-4">

      <div class="card-body">

        <div class="d-flex align-items-center mb-3">

          <div class="stat-icon me-3">
            <i class="bi bi-pencil-square"></i>
          </div>

          <div>

            <h5 class="mb-1">
              Evaluasi / CBT
            </h5>

            <small class="text-muted">
              Evaluasi yang tersedia
            </small>

          </div>

        </div>

        ${renderCBT(cbt)}

      </div>

    </section>

  `;
}

/* ======================================================
   STAT CARD
====================================================== */

function statCard(title, value, icon) {
  return `

    <div class="card stat-card">

      <div>

        <div class="stat-title">
          ${escapeHtml(title)}
        </div>

        <div class="stat-value">
          ${Number(value) || 0}
        </div>

      </div>

      <div class="stat-icon">

        <i class="bi ${icon}"></i>

      </div>

    </div>

  `;
}

/* ======================================================
   PROGRESS
====================================================== */

function progressItem(label, value) {
  const number = Number(value) || 0;

  /*
   * Untuk sementara nilai backend dianggap
   * sebagai jumlah item, bukan persentase.
   *
   * Karena response sekarang:
   * materi   : 1
   * jobsheet : 1
   * tugas    : 1
   * cbt      : 1
   *
   * Kita tampilkan jumlahnya.
   */

  return `

    <div class="mb-3">

      <div class="d-flex justify-content-between mb-1">

        <span>
          ${escapeHtml(label)}
        </span>

        <strong>
          ${number}
        </strong>

      </div>

      <div class="progress" style="height: 7px;">

        <div
          class="progress-bar"
          role="progressbar"
          style="width: ${number > 0 ? 100 : 0}%"
        ></div>

      </div>

    </div>

  `;
  updateClassAccessFormVisibility();
  updateLoginFormLabels();
}

/* ======================================================
   PENGUMUMAN
====================================================== */

function renderAnnouncements(items) {
  if (!items.length) {
    return emptyState("bi-megaphone", "Belum ada pengumuman.");
  }

  return items
    .map((item) => {
      const title = item.judul || item.title || item.nama || "Pengumuman";

      const description =
        item.isi || item.deskripsi || item.description || item.keterangan || "";

      const date = item.tanggal || item.created_at || item.date || "";

      return `

      <div class="border-bottom pb-3 mb-3">

        <div class="d-flex justify-content-between gap-3">

          <strong>
            ${escapeHtml(title)}
          </strong>

          ${
            date
              ? `
                <small class="text-muted text-nowrap">
                  ${escapeHtml(date)}
                </small>
              `
              : ""
          }

        </div>

        ${
          description
            ? `
              <div class="text-muted small mt-1">
                ${escapeHtml(description)}
              </div>
            `
            : ""
        }

      </div>

    `;
    })
    .join("");
}

/* ======================================================
   AKTIVITAS
====================================================== */

function renderActivities(items) {
  if (!items.length) {
    return emptyState("bi-clock-history", "Belum ada aktivitas.");
  }

  return items
    .map((item) => {
      const text =
        item.aktivitas ||
        item.activity ||
        item.deskripsi ||
        item.description ||
        item.nama ||
        item.title ||
        "Aktivitas sistem";

      const date =
        item.tanggal || item.created_at || item.date || item.waktu || "";

      return `

      <div class="d-flex gap-3 border-bottom pb-3 mb-3">

        <div class="text-primary">

          <i class="bi bi-check-circle"></i>

        </div>

        <div class="flex-grow-1">

          <div class="small">
            ${escapeHtml(text)}
          </div>

          ${
            date
              ? `
                <small class="text-muted">
                  ${escapeHtml(date)}
                </small>
              `
              : ""
          }

        </div>

      </div>

    `;
    })
    .join("");
}

/* ======================================================
   CBT
====================================================== */

function renderCBT(items) {
  if (!items.length) {
    return emptyState("bi-pencil-square", "Belum ada evaluasi CBT.");
  }

  return items
    .map((item) => {
      const title =
        item.judul ||
        item.title ||
        item.nama ||
        item.nama_cbt ||
        "Evaluasi CBT";

      const description =
        item.deskripsi || item.description || item.keterangan || "";

      const status = item.status || "";

      return `

      <div class="d-flex align-items-center justify-content-between
                  gap-3 border-bottom pb-3 mb-3">

        <div class="d-flex align-items-center gap-3">

          <div class="stat-icon">

            <i class="bi bi-pencil-square"></i>

          </div>

          <div>

            <strong>
              ${escapeHtml(title)}
            </strong>

            ${
              description
                ? `
                  <div class="small text-muted">
                    ${escapeHtml(description)}
                  </div>
                `
                : ""
            }

          </div>

        </div>

        ${
          status
            ? `
              <span class="badge bg-light text-dark">
                ${escapeHtml(status)}
              </span>
            `
            : ""
        }

      </div>

    `;
    })
    .join("");
}

/* ======================================================
   EMPTY STATE
====================================================== */

function emptyState(icon, message) {
  return `

    <div class="text-center text-muted py-4">

      <i class="bi ${icon} fs-2"></i>

      <div class="small mt-2">
        ${escapeHtml(message)}
      </div>

    </div>

  `;
}

/* ======================================================
   HTML ESCAPE
====================================================== */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
