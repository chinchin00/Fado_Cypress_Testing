/// <reference types="Cypress" />

import ProductPage from '../../pageObjects/categoryPage'

describe('Check Category', () => {
    beforeEach(() => {

    })

    /////////////////////////////////////////////////////////////
    // ALL TAB

    it('Check exist product in category', () => {
        const productPage = new ProductPage()
        cy.visitHomePage()
        cy.visit('/cat/thiet-bi-dien-tu')
        cy.closePopup()
        productPage.checkExistProduct()
    })

    it('Check for product in the catalog', () => {
        const productPage = new ProductPage()
        cy.visitHomePage()
        cy.visit('/cat/thiet-bi-dien-tu')
        productPage.checkExistProduct()
        cy.closePopup()
        productPage.getCategoryItem().each(($e1, index, $list) => {
            productPage.getCategoryItem().eq(index).click({ force: true })
            productPage.checkExistProduct()
            cy.go('back')
        })
    })

    it("Filter products by country", ()=>{
        const productPage = new ProductPage()
        cy.visitHomePage()
        cy.visit('/cat/thiet-bi-dien-tu')
        cy.closePopup()

        productPage.checkExistProduct()

        productPage.getGroupCountry().each(($el, index, $list) => {
            productPage.getFilterItem().eq(index).click().then(($countryCode) => {
                const countryCode = $countryCode.data('test-filter-item-value')
                productPage.getProductList().each(($el,index, $list) =>{
                    cy.get('[data-country-code]').eq(index).then(($countryProduct) =>{
                        const countryProduct = $countryProduct.data('country-code')
                        expect(countryCode).to.equal(countryProduct)
                    })
                })
                cy.go('back')
            })
        })
    })

    it('Filter products by brand', () => {
        const productPage = new ProductPage()
        cy.visitHomePage()
        cy.visit('/cat/thiet-bi-dien-tu')
        cy.closePopup()

        productPage.getGroupBrand().each(($el, index, $list) => {
            productPage.getBrandCheckbox().eq(index).should('not.have.attr', 'checked')
            productPage.getGroupBrand().eq(index).click({ force: true })
            productPage.checkExistProduct()
            productPage.getBrandCheckbox().should('be.checked')
            cy.get('[data-test-selected-filter-key="brand_id"] > .mz-btn__label-col').then(($nameBrand) =>{
                const name = $nameBrand.text()
                cy.get('.is-selected > .mz-basic-sidebox__item-name').should('contain', name.trim())
            })
            cy.go('back')
        })
    })

    it('Check redirect to next page', () => {
        const productPage = new ProductPage()
        cy.visitHomePage()
        cy.visit('/cat/thiet-bi-dien-tu')
        cy.closePopup()
        productPage.checkExistProduct()

        cy.get('[data-test-page]').then(($pagination) => {
            if ($pagination.find('.pagination-nav__list').length = 1) {
                cy.get('.pagination-nav__page-btn').each(($el, index, $list) => {
                    cy.get($el).click({ force: true })
                    productPage.checkExistProduct()
                    cy.url().should('include', 'page'+index)
                })
            }
            else {
                cy.end()
            }
        })
    })

    /////////////////////////////////////////////////////////////
    // GLOBAL CATEGORY TAB


    it('Check global category', () => {
        const productPage = new ProductPage()
        cy.visitHomePage()
        cy.visit('/cat/thiet-bi-dien-tu')
        cy.closePopup()

        cy.get('.tab-list > a:nth-child(2)').click().should('have.class', 'is-active')
        productPage.checkExistProduct()
    })

    it('Check for product in the child categories in global categories tab', () => {
        const productPage = new ProductPage()
        cy.visitHomePage()
        cy.visit('/cat/thiet-bi-dien-tu')
        //chuyển sang tab hàng quốc tế
        cy.get('.tab-list > a:nth-child(2)').click().should('have.class', 'is-active')

        productPage.checkExistProduct()
        cy.closePopup()
        productPage.getCategoryItem().each(($e1, index, $list) => {
            productPage.getCategoryItem().eq(index).click({ force: true })
            cy.get('.tab-list > a:nth-child(2)').should('have.class', 'is-active')
            productPage.checkExistProduct()
            cy.go('back')
        })
    })

    it("Filter products by country in global categories tab", () => {
        const productPage = new ProductPage()
        cy.visitHomePage()
        cy.visit('/cat/thiet-bi-dien-tu')
        cy.closePopup()
        //chuyển sang tab hàng quốc tế
        cy.get('.tab-list > a:nth-child(2)').click().should('have.class', 'is-active')
        productPage.checkExistProduct()

        productPage.getGroupCountry().each(($el, index, $list) => {
            productPage.getFilterItem().eq(index).click().then(($countryCode) => {
                cy.get('.tab-list > a:nth-child(2)').should('have.class', 'is-active')

                const countryCode = $countryCode.data('test-filter-item-value')
                productPage.getProductList().each(($el, index, $list) => {
                    cy.get('[data-country-code]').eq(index).then(($countryProduct) => {
                        const countryProduct = $countryProduct.data('country-code')
                        expect(countryCode).to.equal(countryProduct)
                    })
                })
                cy.go('back')
            })
        })
    })

    it('Filter products by brand in global categories tab', () => {
        const productPage = new ProductPage()
        cy.visitHomePage()
        cy.visit('/cat/thiet-bi-dien-tu')
        cy.closePopup()
        //chuyển sang tab hàng quốc tế
        cy.get('.tab-list > a:nth-child(2)').click().should('have.class', 'is-active')
        productPage.checkExistProduct()

        productPage.getGroupBrand().each(($el, index, $list) => {
            productPage.getBrandCheckbox().eq(index).should('not.have.attr', 'checked')
            productPage.getGroupBrand().eq(index).click({ force: true })

            cy.get('.tab-list > a:nth-child(2)').should('have.class', 'is-active')
            productPage.checkExistProduct()
            productPage.getBrandCheckbox().should('be.checked')
            cy.get('[data-test-selected-filter-key="brand_id"] > .mz-btn__label-col').then(($nameBrand) => {
                const name = $nameBrand.text()
                cy.get('.is-selected > .mz-basic-sidebox__item-name').should('contain', name.trim())
            })
            cy.go('back')
        })
    })

    it('Check redirect to next page', () => {
        const productPage = new ProductPage()
        cy.visitHomePage()
        cy.visit('/cat/thiet-bi-dien-tu')
        cy.closePopup()
        //chuyển sang tab hàng quốc tế
        cy.get('.tab-list > a:nth-child(2)').click().should('have.class', 'is-active')
        productPage.checkExistProduct()

        cy.get('[data-test-page]').then(($pagination) => {
            if ($pagination.find('.pagination-nav__list').length = 1) {
                cy.get('.pagination-nav__page-btn').each(($el, index, $list) => {
                    cy.get($el).click({ force: true })
                    cy.get('.tab-list > a:nth-child(2)').should('have.class', 'is-active')
                    productPage.checkExistProduct()
                    cy.url().should('include', 'page'+index)
                })
            }
            else {
                cy.end()
            }
        })
    })


    //////////////////////////////////////////////
    //TEST

    // it("Check price of product", () => {
    //     // [data-product-id] > .product-card__img-field
    //     //.product-card__title
    //     const productPage = new ProductPage()

    //     cy.visit('https://fado.vn/cat/thiet-bi-dien-tu')

    //     productPage.getProductList().each(($el, index, $list) => {
    //         cy.wait(7000)

    //         cy.get('.product-card__current-price').eq(index).then(($productPrice) => {
    //             const productPrice = $productPrice.text()

    //             productPage.getProductTitle().eq(index).then(($product) => {
    //                 const productTitle = $product.text().trim()

    //                 productPage.getProductTitle().eq(index).click({force: true}).then(() => {
    //                     cy.closePopup()

    //                     cy.get('.product-name').should(($productName) => {
    //                         const productName = $productName.text().trim()
    //                         expect(productName).contains(productTitle)
    //                     })

    //                     cy.get('body').then(($body) =>{
    //                         if($body.find('.out-of-stock-tag').length > 0){
    //                             cy.get('.out-of-stock-tag').contains('Hết hàng')

    //                         }else{
    //                             cy.get('.is-show > .price-segment__current-price-inner > .current-price').then(($price) => {
    //                                 const price = $price.text().trim()
    //                                 expect(price).to.equal(productPrice)
    //                             })
    //                         }
    //                     })

    //                 })
    //             })

    //             cy.go('back')
    //             cy.wait(7000)
    //         })

    //     })

    // })

})