import icons from 'url:../../img/icons.svg';
import View from './view.js';

// Class recipe view
class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _message = 'Your recipe was successfully uploaded!';

  _formWindow = document.querySelector('.add-recipe-window');
  _formOverlay = document.querySelector('.overlay');
  _addRecipeBtn = document.querySelector('.nav__btn--add-recipe');
  _closeBtn = document.querySelector('.btn--close-modal');

  // toggle the class 'hidden' to show/hide form window
  showHideForm() {
    this._formOverlay.classList.toggle('hidden');
    this._formWindow.classList.toggle('hidden');
  }

  // add recipe btn listener
  constructor() {
    super();
    this._addRecipeBtn.addEventListener('click', this.showHideForm.bind(this));
    this._formOverlay.addEventListener('click', this.showHideForm.bind(this));
    this._closeBtn.addEventListener('click', this.showHideForm.bind(this));
  }

  addHandlerSubmit(handler) {
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();

      // get the form data
      const dataArray = [...new FormData(this._parentEl)];
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  }
}

export default new AddRecipeView();
