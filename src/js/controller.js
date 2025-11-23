import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import { getSearchData } from './model.js';
// import searchView from './views/searchView.js';

const recipeContainer = document.querySelector('.recipe');

let no_of_people=4;
let pageno=1;

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////


const Controlrecipe= async function() {
    try{
      const hash= window.location.hash.slice(1);
      if (!hash) return;

      //Render spinner
      recipeView.Renderspinner();
    
      //Load recipe
      await model.Loadrecipe(hash);
      const {recipe}= model.state;

      //Rendering recipe
      recipeView.render(model.state.recipe, no_of_people);

      //Load search results
      

      // recipeContainer.innerHTML='';
      // recipeContainer.insertAdjacentHTML('afterbegin', html);
    } catch(err){
      recipeView.RenderError(err);
    }
}

//Load own recipees
const getOwnRecipes= function(query){
  const storedData = JSON.parse(localStorage.getItem('recipeData')) || [];
  console.log(storedData);
  storedData.forEach((recip)=>{
    if(recip.title.toLowerCase() === query.toLowerCase()){
          const HTML=`
          <li class="preview">
            <a class="preview__link" href="#${recip.id}">
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
        document.querySelector('.results').insertAdjacentHTML('afterbegin',HTML);
     }
  })
}

const controllerSearchResults= async function(query){
  try{
    
    const query1= searchView.getQuery();
    getOwnRecipes(query1);
    await model.LoadSearchResults(query1);
    searchView.clearInput();
  } catch(err){
    console.log('err');
  }
}

window.addEventListener('hashchange', Controlrecipe);
window.addEventListener('load', Controlrecipe);

// document.querySelector('.search').addEventListener('submit', function(e){
//   e.preventDefault();
//   const query = document.querySelector('.search__field').value;
//   controllerSearchResults(query);
//   document.querySelector('.search__field').value='';
// });


//Increasing Ingredients as per members
document.querySelector('.recipe').addEventListener('click', function (e) {
  const btn = e.target.closest('.btn--tiny');
  if (!btn) return;
  const useEl = btn.querySelector('use');
  const hrefValue = useEl?.getAttribute('href') || '';

  const ingredientsList = document.querySelector('.recipe__ingredient-list'); // the <ul>
  const ingredientsArray = Array.from(ingredientsList.querySelectorAll('li')); 


  // Check if it’s the minus or plus icon
  if (hrefValue.includes('minus') && no_of_people!=1) {
    document.querySelector('.recipe__info-data--people').textContent=--no_of_people;
  } 
  if (hrefValue.includes('plus')) {
    document.querySelector('.recipe__info-data--people').textContent=++no_of_people;
  }
  recipeView.render(model.state.recipe, no_of_people);
  
});

//Setting Pageno's for search results
document.querySelector('.pagination').addEventListener('click', function(e){

  const btn = e.target.closest('.btn--inline');
  
  if (btn.classList.contains('pagination__btn--prev') && pageno!=1) {
    --pageno;
  }

  if (btn.classList.contains('pagination__btn--next')) {
    ++pageno;
  }
  getSearchData(pageno);
  
});


// //Setting ingredients quantity as per members
// document.querySelector('.results').addEventListener('click', function(e){
//   const selected_data= e.target.closest('.preview');

//   const anchor = selected_data.querySelector('a');
//   const hrefVal = anchor?.getAttribute('href') || '';

// });

//Add recipe
document.querySelector('.nav__btn--add-recipe').addEventListener('click', function(e){
  document.querySelector('.overlay').classList.remove('hidden');
  document.querySelector('.add-recipe-window').classList.remove('hidden');

})

document.querySelector('.overlay').addEventListener('click', function(e){
  document.querySelector('.overlay').classList.add('hidden');
  document.querySelector('.add-recipe-window').classList.add('hidden');
})

document.querySelector('.btn--close-modal').addEventListener('click', function(e){
  document.querySelector('.overlay').classList.add('hidden');
  document.querySelector('.add-recipe-window').classList.add('hidden');
})

document.querySelector('.upload__btn').addEventListener('click', function(e){
  e.preventDefault();
  const inputs = document.querySelector('.upload').querySelectorAll('input');

  const Formdata = {};
  inputs.forEach(input => {
    Formdata[input.name] = input.value.trim();
  });

  const existingRecipes = JSON.parse(localStorage.getItem('recipeData')) || [];

  // Add the new recipe to the array
  existingRecipes.push(Formdata);

  // Save the updated array back to localStorage
  localStorage.setItem('recipeData', JSON.stringify(existingRecipes));
  const storedData = JSON.parse(localStorage.getItem('recipeData'));

  console.log(Formdata);
  console.log(storedData);
  document.querySelector('.overlay').classList.add('hidden');
  document.querySelector('.add-recipe-window').classList.add('hidden');
})

//Add bookmark
const controlAddBookmark= function(){
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);
  model.showBookmarkRecipes();
  recipeView.render(model.state.recipe, no_of_people);
}

// const unbookmark= function(){
//   model.addBookmark(model.state.recipe, false);
//   console.log(model.state.recipe);
//   recipeView.render(model.state.recipe, no_of_people);
// }

const init= function(){
  searchView.addHandlerSearch(controllerSearchResults);
  recipeView.addHandlerBookmark(controlAddBookmark);

}
init();

// const data= async function(){
//     setTimeout(() => {
//       console.log("Hello after 3 seconds!");
//     }, 4000);
// }
// data();
// console.log("Try programiz.pro");
// setTimeout(() => {
//       console.log("Hello after 3 seconds!...");
// }, 3000);

