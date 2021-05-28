/// <reference types="Cypress" />

import HomePage from './pageObjects/homePage'
import CheckOut from './pageObjects/checkOut'


describe('SEARCH PRODUCT IN STORE', () => {

    const keyword = 'thuốc';
    const cardTitle = '.product-card__title';
    const country = '.mz-rating__label-field > :nth-child(3)';
    const stockTitle = '.out-of-stock-tag';

    beforeEach(function () {

        cy.fixture('userInfo').then((data) => {
            this.data = data
        })

        cy.visitHomePage()

        cy.closePopup()
    })


    it('Hủy đơn hàng', function (){

    })

})
