import constant from './constant';

const token_key = ('token_' + constant.version);
const menu_key = ('menu_' + constant.version);

const database = {
  getToken() {
    return localStorage.getItem(token_key);
  },
  setToken(token) {
    localStorage.clear();

    localStorage.setItem(token_key, token);
  },
  getMenu() {
    return JSON.parse(localStorage.getItem(menu_key));
  },
  setMenu(menu) {
    localStorage.removeItem(menu_key);

    localStorage.setItem(menu_key, JSON.stringify(menu));
  }
};

export default database;
