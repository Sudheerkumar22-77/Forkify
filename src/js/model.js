import "regenerator-runtime";
import { API_Url } from "./config";
import { getJSON } from "./helpers";
import icon from 'url:../img/icons.svg';
import recipeView from "./views/recipeView";
// import { set } from "core-js/core/dict";

export const state={
    recipe: {},
    search: {
      query: '',
      results: [],
      page: 1,
    },
    bookmarks: [],
};

export const Loadrecipe = async function (hash) {
  try {
    const data= await getJSON(`${API_Url}${hash}`);
    console.log(data);

    const { recipe } = data.data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    if(state.bookmarks.some((bookmark)=>bookmark.id===recipe.id)) state.recipe.bookmarked= true;
    else state.recipe.bookmarked= false;

  } catch (err) {
    throw err; // rethrow so controller can handle
  }
};

const Renderspinner= function(){
    document.querySelector('.results').innerHTML = '';
    const markup=`
        <div class="spinner">
          <svg>
            <use href="${icon}#icon-loader"></use>
          </svg>
        </div>
    `;
    document.querySelector('.results').insertAdjacentHTML('afterbegin',markup);
}

const RenderError = function (message = 'Something went wrong! Please try again.') {
  const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icon}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
  `;
  const parentEl = document.querySelector('.results');
  parentEl.innerHTML = ''; // clear old content
  parentEl.insertAdjacentHTML('afterbegin', markup);
};


export const LoadSearchResults= async function(query){
  try{
    Renderspinner();
    state.search.query= query;
    const data= await getJSON(`https://forkify-api.jonas.io/api/v2/recipes?search=${query}`);
    state.search.results = data.data.recipes.map(rec=>{
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    })
    console.log(state.search.results);
    getSearchData();    

    if (!data.data.recipes || data.data.recipes.length === 0)
      throw new Error('No recipes found for that query!');
    
  }
  catch (err) {
    RenderError(err.message);
    throw err;
  }
}

export const getSearchData= function(page= state.search.page){
  document.querySelector('.results').innerHTML='';
  const searchedone=getSearchResults(page);

  setSearchData(searchedone, page);
}

const setSearchData= function(searched_one, page){
  document.querySelector('.results').innerHTML = '';
  searched_one.map(recip=>{ 
        const HTML=`
           <li class="preview">
              <a class="preview__link" href="#${recip.id ? `${recip.id}` : ''}">
                <figure class="preview__fig">
                  <img src="${recip.image}" alt="Test" />
                </figure>
                <div class="preview__data">
                  <h4 class="preview__title">${recip.title}</h4>
                  <p class="preview__publisher">${recip.publisher}</p>
                </div>
              </a>
            </li>
         `; 
        document.querySelector('.results').insertAdjacentHTML('beforeend',HTML);
    })
    showPagination(page);
}

const getSearchResults= function(page= state.search.page){
  const start= (page-1)*10;
  const end= (page*10);
  
  return state.search.results.slice(start, end);
}

const showPagination= function(page){
  document.querySelector('.pagination').innerHTML='';
  const HTML=`
    ${page!=1 ? `<button class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icon}#icon-arrow-left"></use>
          </svg>
          <span>Page ${page-1}</span>
    </button>` : ''}
    ${page<(state.search.results.length)/10 ? `<button class="btn--inline pagination__btn--next">
          <span>Page ${page+1}</span>
          <svg class="search__icon">
            <use href="${icon}#icon-arrow-right"></use>
          </svg>
    </button>` : ''} 
  `;
  document.querySelector('.pagination').insertAdjacentHTML('afterbegin', HTML);
}

export const addBookmark= function(recipe){
  state.bookmarks.push(recipe);

  if(recipe.id === state.recipe.id) state.recipe.bookmarked= true;

  console.log(recipe);
  // addBookmarkToLocalStorage(recipe);
}

export const deleteBookmark= function(id){
  const index= state.bookmarks.findIndex(el=> el.id===id);
  state.bookmarks.splice(index, 1);

  if(id === state.recipe.id) state.recipe.bookmarked= false;
}

export const showBookmarkRecipes= function(){


  console.log(state.search.results);
  state.search.results.map(rec=> {
    const HTML= `
      <li class="preview">
              <a class="preview__link" href="${rec.id}">
              <figure class="preview__fig">
                <img src="${rec.image}" alt="Test" />
              </figure>
            <div class="preview__data">
                <h4 class="preview__name">
                  ${rec.title}
                </h4>
              <p class="preview__publisher">${rec.publisher}</p>
            </div>
          </a>
        </li>
    `;
    document.querySelector('.message').innerHTML='';
    document.querySelector('.message').insertAdjacentHTML('afterbegin',HTML);
  })
}

export const addBookmarkToLocalStorage= function(recipe){
  // 1. Initialize (load existing bookmarks or start empty)
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

  // 2. Add a new bookmark
  const newBookmark = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    image: recipe.image,
  };

  bookmarks.push(newBookmark);

  // 3. Save it back to localStorage
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

  // 4. Retrieve later
  const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  console.log(storedBookmarks);
}