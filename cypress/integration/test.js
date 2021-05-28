/// <reference types="Cypress" />

import AddToCard from './pageObjects/addToCard'
import CheckOut from './pageObjects/checkOut'
import HomePage from './pageObjects/homePage'
import LoginPage from './pageObjects/loginPage'
import CancelOrder from "./pageObjects/cancelOrder";
import SearchPage from "./pageObjects/searchPage"


describe('CHECK PRODUCT IN HOME PAGE', () => {
    const currentPrice = '.product-card__current-price-number'
    const minPrice = '.product-card__min-price-number'
    const minhorizontal = '.product-horizontal-card__min-price-number'

    const checkPriced = () => {
        const home = new HomePage()
        const search = new SearchPage()
        const addToCard = new AddToCard()

        //count số sản phẩm có giá
        search.getProductList().then(($el) => {
            let numProduct, numPricedProduct, num
            numProduct = Number($el.length)
            expect(numProduct).to.be.greaterThan(30)
            cy.wait(2000)
            addToCard.getListPricedsProduct().then(($price) => {
                numPricedProduct = Number($price.length)
                num = (numPricedProduct * 100) / numProduct
                expect(num).to.be.greaterThan(90)
            })
        })

        //count số sản phẩm deal có giá
        home.getProductDeal().then(($el) => {
            let numProduct, numPricedProduct
            numProduct = Number($el.length)
            home.getPricedProductDeal().then(($price) => {
                expect($price.text().trim()).to.not.contain('Đang cập nhật')
                expect($price.text().trim()).to.not.contain('Xem báo giá')
                numPricedProduct = Number($price.length)
                expect(numProduct).to.equal(numPricedProduct)
            })
        })

        home.getProductHorizontal().then(($el) => {
            let numProduct = Number($el.length)
            expect(numProduct).to.be.greaterThan(0)
            let card = Number($el.find('.mz-btn-gray').length)
            if ($el.find(minhorizontal).length > 0) {
                let min = Number(home.getProductHorizontal().find(minhorizontal).length)
                card = card + min
            }
            expect(card, 'Sản phẩm có giá').to.equal(numProduct)
        })

        search.getProductPrice().each(($el) => {
            const price = $el.text().trim()
            expect(price).to.not.equal('Đang cập nhật')
        })
    }

    const checkSuggestProduct = () => {
        const home = new HomePage()
        for (let i = 1; i < 7; i++) {
            if (i == 1 || i == 2 || i == 6) {
                for (let j = 1; j < 5; j++) {
                    home.getSuggestTab(i, j);
                    cy.wait(2000);
                    home.getCurrentPriceNumber().each(($el) => {
                        const price = $el.text().trim()
                        expect(price, 'Sản phẩm có giá').to.exist
                        expect(price, 'Sản phẩm có giá').to.not.equal('Đang cập nhật')
                    })
                }
            }
            else {
                for (let j = 1; j < 4; j++) {
                    home.getSuggestTab(i, j);
                    cy.wait(2000);
                    home.getCurrentPriceNumber().each(($el) => {
                        const price = $el.text().trim()
                        expect(price, 'Sản phẩm có giá').to.exist
                        expect(price, 'Sản phẩm có giá').to.not.equal('Đang cập nhật')
                    })
                }
            }
        }
    }

    beforeEach(function () {
        const home = new HomePage()
        cy.visitHomePage()

        home.closePopup()
    })

    it('Switch suggest tab', function () {
        const home = new HomePage()
        checkSuggestProduct()
    })
})