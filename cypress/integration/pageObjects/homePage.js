import LoginPage from './loginPage'
import SearchPage from './searchPage'

class HomePage {
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

    //get dropdown username on menu bar
    getUserName() {
        return cy.get('#user-info__dropdown > .dropdown-head');
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

    getProductDeal(){
        return cy.get('.product-deal-action-card');
    }

    getPricedProductDeal(){
        return cy.get('.product-deal-action-card__current-price');
    }

    // get Product Horizontal in home page
    getProductHorizontal(){
        return cy.get('.product-horizontal-card');
    }

    getMinPriceProductHorizontal(){
        return cy.get('.product-horizontal-card__min-price-number');
    }

    getDealTab(){
        // get list tab deal trên trang chủ
        return cy.get('.tab-item-label');
    }

    getPagingDeal(index){
        // get index page deal on 'Khap the gioi' tab
        return cy.get('.paging-nav > :nth-child(' + index + ')');
    }

    getTrendTab(index){
        // in homepage
        return cy.get('.tab-item-col > :nth-child(' + index + ')');
    }

    getProductTrend(index){
        // get prouct in Trend tab
        return cy.get('.product-large-row > :nth-child('+ index + ') > .product-card');
    }

    getSuggestTab(tab, item){
        return cy.get('.home-suggest-block:nth-child(' + tab +  ') > .block-head > .tab-segment > .tab-item:nth-child(' + item + ') > .tab-btn-name');
    }

    getCurrentPriceNumber(){
        return cy.get('.product-card__current-price-number');
    }
}

export default HomePage;
