/**
 * ======================================================
 * Local Storage
 * ======================================================
 */

const Storage = {
  set(key, value) {
    localStorage.setItem(
      CONFIG.STORAGE_KEY + "_" + key,

      JSON.stringify(value),
    );
  },

  get(key) {
    const data = localStorage.getItem(CONFIG.STORAGE_KEY + "_" + key);

    return data ? JSON.parse(data) : null;
  },

  remove(key) {
    localStorage.removeItem(CONFIG.STORAGE_KEY + "_" + key);
  },

  clear() {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(CONFIG.STORAGE_KEY)) {
        localStorage.removeItem(key);
      }
    });
  },
};
