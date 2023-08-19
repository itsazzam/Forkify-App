import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { getJSON, sendJSON } from './helper.js';

// the state object for recipe, bookmarks and search
export const state = {
  recipe: {},
  bookmarks: [],
  search: {
    query: '',
    page: 1,
    resultsPerPage: RES_PER_PAGE,
    results: [],
  },
};

const createRecipeObject = function (data) {
  const recipe = data.data.recipe;
  // mutate the recipe object 'side effect'
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    imageURL: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceURL: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

// load recipe function
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    state.recipe = createRecipeObject(data);

    // mark as bookmarked if it exsist in the bookmarks array
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
};

export const loadSearchResutls = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);
    const results = data.data.recipes;
    state.search.results = results.map(recipe => {
      return {
        id: recipe.id,
        imageURL: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RES_PER_PAGE; // 0
  const end = page * RES_PER_PAGE; //10
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  // update ingredients
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const updateLocalStorage = function () {
  const bookmarks = state.bookmarks;

  if (!bookmarks) return;
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
};

export const addBookmark = function (recipe) {
  // add to bookmarks array
  state.bookmarks.push(recipe);

  // bookmark the current recipe
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // add to loaclStorage
  updateLocalStorage();
};

export const removeBookmark = function (id) {
  // search for the recipe with the same id
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  console.log('remove', index);

  // remove it
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  updateLocalStorage();
};

// upload recipe function
export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(newRecipe);
    // return an array of ingredients
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map((ing, i) => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) throw new Error('❌Wrong input format!');
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    console.log(ingredients);
    // create an object to send to the API
    const uploadData = {
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      ingredients,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceURL,
      title: newRecipe.title,
    };

    const data = await sendJSON(`${API_URL}?key=${KEY}`, uploadData);

    // show the recipe
    state.recipe = createRecipeObject(data);

    //add to bookmarks
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

const validateForm =
  /**
   * Validate uploaded Recipe
   * @date 8/19/2023 - 11:50:19 AM
   *
   * @param {object} data // the fields data
   */
  function (data) {};

const init = function () {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

  if (!bookmarks) return;
  state.bookmarks = bookmarks;
};
init();
