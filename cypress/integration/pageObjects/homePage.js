import LoginPage from './loginPage'
import SearchPage from './searchPage'

class HomePage {
    elements = {
        pricedProduct: () => cy.get('.product-card').first('.mz-btn-gray'),
        listPricedsProduct: () => cy.get('.product-card').find('.mz-btn-gray'),
        findCartTitle: (el) => el.find('.product-card__title').text().trim(),
        cartQuantity: () => cy.get('#header-cart-quantity'),
        headerCartBtn: () => cy.get('#header-cart-quantity'),
        userName: () => cy.get('#user-info__dropdown > .dropdown-head'), //get dropdown username on menu bar
        productDeal: () => cy.get('.product-deal-action-card'),
        pricedProductDeal: () => cy.get('.product-deal-action-card__current-price'),
        productsHorizontal: () => cy.get('.product-horizontal-card'),
        minPriceProductHorizontal: () => cy.get('.product-horizontal-card__min-price-number'),
        dealTab: () => cy.get('.tab-item-label'),
        pagingDeal:(index) => cy.get('.paging-nav > :nth-child(' + index + ')'), // get index page deal on 'Khap the gioi' tab
        trendTab: (index) => cy.get('.tab-item-col > :nth-child(' + index + ')'),
        productTrendTab: (index) => cy.get('.product-large-row > :nth-child('+ index + ') > .product-card'), //get prouct in Trend tab
        suggestTab: (tab, item) => cy.get('.home-suggest-block:nth-child(' + tab +  ') > .block-head > .tab-segment > .tab-item:nth-child(' + item + ') > .tab-btn-name'),
        currentPriceNumber: () => cy.get('.product-card__current-price-number')
    }

    // findCartTitle(el){
    //     return el.find('.product-card__title').text().trim();
    // }

    addProductToCart(el) {
        el.find('.mz-btn-gray').trigger("click");
    }

    goToCartPage() {
        const button = this.elements.headerCartBtn();
        button.click();
    }

    closePopup() {
        cy.get('body').wait(1000).then($body => {
            if ($body.find('.close').length > 0) {
                cy.get('.modal-body > .close').click();
            }
        })
    }

    constructor(){
        this.search = new SearchPage();
    }

    goToSignIn() {
        return new LoginPage();
    }

    //search product
    searchInStore(value){

        this.search.getDropdownSearch().click();
        // this.search.getDropMenu().should('have.class', 'is-show');

        this.search.getDropdownStore().click({ force: true });
        this.search.getDropdownStore().should('have.class', 'is-active');

        this.search.getDropdownTitle().should('have.text', 'Từ Gian hàng');

        this.search.fillSearchKeyword(value);
        cy.wait(2000);
        
        this.search.search();
        cy.wait(5000);

        return this;
    }

    //get body
    getBody(){
        return cy.get('body');
    }

}

export default HomePage;
