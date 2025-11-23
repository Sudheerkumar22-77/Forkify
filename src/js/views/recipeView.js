import icon from 'url:../../img/icons.svg';
import { Fraction } from 'fraction.js';

class recipeview{
    #parentelement= document.querySelector('.recipe');
    #data;

    Renderspinner(){
        const html=`
            <div class="spinner">
              <svg>
                <use href="${icon}#icon-loader"></use>
              </svg>
            </div>
        `;
        this.#clearParentElement();
        this.#parentelement.insertAdjacentHTML('afterbegin',html);
    }

    RenderError(err){
        const HTML=`
            <div class="error">
                <div>
                <svg>
                    <use href="${icon}#icon-alert-triangle"></use>
                </svg>
                </div>
                <p>${err.message} Please try another one!..<p>
            </div>
        `;
        this.#clearParentElement();
        this.#parentelement.insertAdjacentHTML('afterbegin',HTML);
    }

    addHandlerBookmark(handler){
        this.#parentelement.addEventListener('click', function(e){
            const btn= e.target.closest('.btn--bookmark');
            console.log(btn);
            // const useEl = btn.querySelector('use');
            // const hrefValue = useEl?.getAttribute('href') || '';
            // if (hrefValue.includes('fill')) unbookmark();
            // else 
            handler();
        })
    }

    render(data, no_of_people){
        try{
            this.#data= data;
            // if(!data) throw new Error('Recipe not found!...');
            const HTML= this.#generateHTML(no_of_people);
            this.#clearParentElement();
            this.#parentelement.insertAdjacentHTML('afterbegin', HTML);
        } catch(err){
            // this.RenderError(err.message);
        }
    }

    #clearParentElement(){
        this.#parentelement.innerHTML= '';
    }

    #generateHTML(no_of_people){
        return `
            <figure class="recipe__fig">
            <img src="${this.#data.image}" alt="${this.#data.title}" class="recipe__img" />
            <h1 class="recipe__title">
                <span>${this.#data.title}</span>
            </h1>
            </figure>

            <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                <use href="${icon}#icon-clock"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${this.#data.cookingTime}</span>
                <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                <use href="${icon}#icon-users"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${no_of_people}</span>
                <span class="recipe__info-text">servings</span>

                <div class="recipe__info-buttons">
                <button class="btn--tiny btn--increase-servings">
                    <svg>
                    <use href="${icon}#icon-minus-circle"></use>
                    </svg>
                </button>
                <button class="btn--tiny btn--increase-servings">
                    <svg>
                    <use href="${icon}#icon-plus-circle"></use>
                    </svg>
                </button>
                </div>
            </div>

            <div class="recipe__user-generated">
                <svg>
                <use href="${icon}#icon-user"></use>
                </svg>
            </div>
            <button class="btn--round btn--bookmark">
                <svg class="">
                <use href="${icon}#icon-bookmark${this.#data.bookmarked ? '-fill' : ''}"></use>
                </svg>
            </button>
            </div>

            <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
                ${this.#data.ingredients.map(ing => {
                    const originalServings = this.#data.servings || 4; // fallback to 4 if not provided
                    const updatedQuantity = ing.quantity
                    ? (ing.quantity * no_of_people) / originalServings
                    : null;

                    return `
                    <li class="recipe__ingredient">
                        <svg class="recipe__icon">
                        <use href="${icon}#icon-check"></use>
                        </svg>
                        <div class="recipe__quantity">
                        ${updatedQuantity ? new Fraction(updatedQuantity).toFraction(true) : ''}
                        </div>
                        <div class="recipe__description">
                        <span class="recipe__unit">${ing.unit ?? ''}</span>
                        ${ing.description}
                        </div>
                    </li>
                    `;
                }).join('')}
                </ul>
            </div>

            <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__publisher">${this.#data.publisher}</span>. Please check out
                directions at their website.
            </p>
            <a
                class="btn--small recipe__btn"
                href="${this.#data.sourceUrl}"
                target="_blank"
            >
                <span>Directions</span>
                <svg class="search__icon">
                <use href="${icon}#icon-arrow-right"></use>
                </svg>
            </a>
            </div>
        `;
    }
}

export default new recipeview();