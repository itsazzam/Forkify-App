// imports
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'regenerator-runtime/runtime';
import 'core-js/stable';
import { async } from 'regenerator-runtime';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
if (module.hot) {
  module.hot.accept();
}

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    // guard
    if (!id) return;
    recipeView.renderSpinner();

    // update search results
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // wait for async function, it modifies the recipe object
    await model.loadRecipe(id);

    // pass the recipe object to render it
    recipeView.render(model.state.recipe);

    console.log(model.state.recipe);
  } catch (error) {
    recipeView.renderErrorMessage();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    console.log(query);

    if (!query) return;

    await model.loadSearchResutls(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
    // console.log(model.getSearchResultsPage(1));
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update servings
  model.updateServings(newServings);

  // update recipe
  recipeView.update(model.state.recipe);
};

// bookmark control
const controlBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (data) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(data);

    // validation
    console.log(data);

    // show succes message
    addRecipeView.renderMessage();

    // render recipe
    recipeView.render(model.state.recipe);

    // update the url
    history.pushState(null, '', `#${model.state.recipe.id}`);

    // hide the modal
    setTimeout(() => {
      addRecipeView.showHideForm();
    }, MODAL_CLOSE_SEC * 1000);

    bookmarksView.render(model.state.bookmarks);
  } catch (error) {
    console.error(error);
  }
};

// Handling events in MVC following the publisher - subscrber method
// Subscriber
const init = function () {
  recipeView.addHandlerRender(showRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.render(model.state.bookmarks);
  addRecipeView.addHandlerSubmit(controlAddRecipe);
};
init();
