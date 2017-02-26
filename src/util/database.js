const database = {
  getToken() {
    return localStorage.getItem("token2");
  },
  setToken(token) {
    localStorage.removeItem("token2");

    localStorage.setItem("token2", token);
  },
  getMenu() {
    return JSON.parse(localStorage.getItem("menu"));
  },
  setMenu(menu) {
    localStorage.removeItem("menu");

    localStorage.setItem("menu", JSON.stringify(menu));
  }
};

export default database;
