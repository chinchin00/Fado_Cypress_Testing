/// <reference types="Cypress" />

describe('Check booth', () => {
    beforeEach(() =>{
        cy.intercept({
            // this RegExp matches any URL beginning with 'http://staging.fado.vn/'
            url: /^https:\/\/staging\.fado\.vn/,
            failOnStatusCode: false,
        }, (req) => {
            req.headers['authorization'] = `Basic Z3Vlc3Q6MTIz`
        })
    })

    it('Check exist product', () =>{
        cy.visit('https://fado.vn/shop/fado-mall')
        cy.closePopup()

        const productPage = new ProductPage()

        productPage.checkExistProduct()
    })

    it('Check for product in the catalog', () =>{
        const productPage = new ProductPage()

        cy.visit('https://fado.vn/shop/fado-mall')
        cy.closePopup()

        productPage.checkExistProduct()
    })
    
})