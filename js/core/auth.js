/**
 * ======================================================
 * e-Learn MUPA
 * ------------------------------------------------------
 * Authentication
 * Version : 1.0.0
 * ======================================================
 */

const Auth = {
  /**
   * Login
   */
  async login(username, password) {
    const user = await API.login(username, password);

    Storage.set("user", user);

    STATE.user = user;

    return user;
  },

  /**
   * Logout
   */
  logout() {
    Storage.remove("user");

    STATE.user = null;

    window.location.hash = "#login";
  },

  /**
   * User Login
   */
  user() {
    return Storage.get("user");
  },

  /**
   * Check Login
   */
  check() {
    const user = Storage.get("user");

    if (!user) {
      window.location.hash = "#login";

      return false;
    }

    STATE.user = user;

    return true;
  },

  /**
   * Check Role
   */
  role() {
    return STATE.user ? STATE.user.role : null;
  },

  /**
   * Is Admin
   */
  isAdmin() {
    return this.role() === "admin";
  },

  /**
   * Is Guru
   */
  isGuru() {
    return this.role() === "guru";
  },

  /**
   * Is Siswa
   */
  isSiswa() {
    return this.role() === "siswa";
  },
};
