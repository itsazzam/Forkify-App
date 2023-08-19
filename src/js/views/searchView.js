import icons from 'url:../../img/icons.svg';

class searchView {
  #parentEl = document.querySelector('.search');
  #data;

  getQuery() {
    const query = this.#parentEl.querySelector('.search__field').value;
    this.#clear();
    return query;
  }

  #clear() {
    this.#parentEl.querySelector('.search__field').value = '';
  }

  addSearchHandler(handler) {
    this.#parentEl.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new searchView();
