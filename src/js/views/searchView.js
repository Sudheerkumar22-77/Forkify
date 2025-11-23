class searchView{
    #parentEL= document.querySelector('.search');

    getQuery(){
        return this.#parentEL.querySelector('.search__field').value;
    }

    clearInput(){
        this.#parentEL.querySelector('.search__field').value='';
    }

    addHandlerSearch(handler){
        this.#parentEL.addEventListener('submit', function(e){
            e.preventDefault();
            handler();
        })
    }
}

export default new searchView();