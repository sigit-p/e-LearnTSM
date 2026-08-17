/**
 * ======================================================
 * e-Learn MUPA
 * ------------------------------------------------------
 * API Service
 * Version : 1.0.0
 * ======================================================
 */

const API = {
  /**
   * Request API
   */
  async request(action, params = {}) {
    try {
      const query = new URLSearchParams({
        action,

        ...params,
      });

      const response = await fetch(
        `${CONFIG.API_URL}?${query.toString()}`,

        {
          method: "GET",

          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Network Error");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    } catch (error) {
      console.error(error);

      throw error;
    }
  },
};

/* ======================================================
 * DASHBOARD
 * ======================================================
 */

API.dashboard = () => API.request("dashboard");

/* ======================================================
 * AUTH
 * ======================================================
 */

API.login = (username, password) =>
  API.request("login", {
    username,

    password,
  });

API.logout = () => API.request("logout");

/* ======================================================
 * MASTER
 * ======================================================
 */

API.jurusan = () => API.request("jurusan");

API.kelas = (jurusan_id = "") =>
  API.request("kelas", {
    jurusan_id,
  });

API.kelasByAkses = (akses_kode = "") =>
  API.request("kelasByAkses", {
    akses_kode,
  });

API.guru = () => API.request("guru");

API.mapel = () => API.request("mapel");

API.siswa = (kelas_id = "") =>
  API.request("siswa", {
    kelas_id,
  });
