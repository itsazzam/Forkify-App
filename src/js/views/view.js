// it contains the common properties between all views
import 'core-js/stable';
import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderErrorMessage();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    // compare between the two doms
    newElements.forEach((newEl, i) => {
      if (
        !newEl.isEqualNode(curElements[i]) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curElements[i].textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curElements[i]))
        Array.from(newEl.attributes).forEach(attr =>
          curElements[i].setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  renderSpinner() {
    const markup = `<div class="spinner">
                    <svg>
                       <use href="${icons}#icon-loader"></use>
                    </svg>
                  </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderErrorMessage(message = this._errorMessage) {
    const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `<div class="message">
           <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
            </div>  
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
