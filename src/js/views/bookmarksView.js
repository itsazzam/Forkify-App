import previewView from './previewView.js';
import View from './view.js';
import icons from 'url:../../img/icons.svg';

class Bookmarksview extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new Bookmarksview();
