import View from './view.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentEl = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const pagesNum = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(curPage);
    console.log(pagesNum);

    // we need to deal with some scenarios
    // * 1) On page 1 and there are other pages
    if (curPage === 1 && pagesNum > 1) {
      return `
            <button data-goToPage="${
              curPage + 1
            }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
        
        `;
    }

    // * 3) On Last page
    if (curPage === pagesNum && pagesNum > 1) {
      return `
        <button data-goToPage="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
        </button>
        
        `;
    }

    // * 4) On other pages
    if (curPage < pagesNum) {
      return `
        <button data-goToPage="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
        </svg>
        </button>
        <button data-goToPage="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
        </button>
        
        `;
    }

    // * 2) On page 1 and there are NO other pages
    return ``;
  }

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.gotopage;
      handler(goToPage);
    });
  }
}

export default new ResultsView();
