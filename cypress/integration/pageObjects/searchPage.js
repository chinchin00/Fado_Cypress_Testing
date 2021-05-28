class SearchPage{
    constructor(){
    }

    getDropdownSearch(){
        return cy.get('.search-from-dropdown > .dropdown-head');
    }

    getDropMenu(){
        return cy.get('.search-from-dropdown > .mz-dropdown-menu');
    }

    getDropdownStore(){
        return cy.get(':nth-child(8) > .mz-dropdown-menu__list-item');
    }

    getDropdownTitle(){
        return cy.get('.dropdown-title');
    }

    getSearchInput(){
        return cy.get('.mz-header-vsearch__keyword-input');
    }

    fillSearchKeyword(value) {
        const key = cy.get('.mz-header-vsearch__keyword-input');
        key.clear({waitForAnimations: false});
        key.type(value, {force: true});
        return this;
    }

    search(){
        const button = cy.get('.submit-btn-label > .fal');
        button.click();
    }

    getTabStore(){
        return cy.get('.tab-list :nth-child(7)');
    }

    getTitleBrand(){
        return cy.get(':nth-child(1) > .mz-basic-sidebox__head > .mz-basic-sidebox__title');
    }

    getBrands(){
        return cy.get('#filter-brand > .os-padding > .os-viewport > .os-content').children()
    }

    getTitleCountry(){
        return cy.get(':nth-child(2) > .mz-basic-sidebox__head > .mz-basic-sidebox__title');
    }

    getTitleRating(){
        return cy.get(':nth-child(3) > .mz-basic-sidebox__head > .mz-basic-sidebox__title');
    }

    getTitleSevice(){
        return cy.get(':nth-child(4) > .mz-basic-sidebox__head > .mz-basic-sidebox__title');
    }

    getMessageBlank(){
        return cy.get('.block-text > :nth-child(1)');
    }

    getSuggestItemWrap(){
        return cy.get('.mz-header-vsearch__suggest-item-wrap');
    }

    getSuggestKeyword(){
        return cy.get('.suggest-keywords-panel');
    }

    getProductList(){
        return cy.get('.product-card');
    }

    getCardTitle(){
        return cy.get('.product-card__title');
    }

    getCardCountry(){
        return cy.get('.mz-rating__label-field > :nth-child(3)');
    }

    getProductName(){
        return cy.get('.product-name');
    }

    getProductPrice(){
        return cy.get('.product-card__current-price');
    }

    getPriceDetail(){
        return cy.get('.is-show > .price-segment__current-price-inner > .current-price');
    }

    getCountryProduct(){
        return cy.get('.sale-at-field');
    }

    getBuyNowDetail(){
        return cy.get('.product-detail-block__col-2 > .cart-segment > .buy-now-btn');
    }

    getAddToCartDetail(){
        return cy.get('.product-detail-block__col-2 > .cart-segment > .add-cart-btn');
    }

    getRatingDetail(){
        return cy.get('.rating-total-review')
    }
}

export default SearchPage