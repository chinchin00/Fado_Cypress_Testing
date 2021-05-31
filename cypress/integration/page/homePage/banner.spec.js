/// <reference types="Cypress" />

import HomePage from "../../pageObjects/homePage"
import Banner from "../../pageObjects/homePage/banner"
import SearchPage from "../../pageObjects/searchPage"

describe('CHECKN BANNER', () => {
    function checkPriceProduct() {
        const search = new SearchPage()
        search.getProductList().each(($el) => {
            expect($el).to.not.contain('Đang cập nhật')
        })
    }
    beforeEach(function () {
        cy.visitHomePage()

        cy.closePopup()
    })

    it('Visit banner 1', function () {
        const home = new HomePage()
        const banner = new Banner()

        banner.getSliderBanner(1)

        cy.url().should('eq', 'https://fado.vn/h/cham-deal-thang-5')
        cy.wait(1000)

        for (let i = 1; i < 6; i++) {
            banner.getTemplateTab(11693, i)
            banner.getTemplateTab(11699, i)
            banner.getTemplateTab(11710, i)
            banner.getTemplateTab(11716, i)
            banner.getTemplateTab(11722, i)
            banner.getTemplateTab(11687, i)
            checkPriceProduct()
        }
        for (let i = 1; i < 5; i++) {
            banner.getTemplateTab(11705, i)
            checkPriceProduct()
        }
    })

    it('Visit banner 2', function () {
        const banner = new Banner()

        banner.getSliderBanner(2)

        cy.url().should('eq', 'https://fado.vn/ho-tro/thanh-toan-vnpay-giam-ngay-50000.n2715')

        cy.get('body').contain('Thanh Toán VNPAY Giảm Ngay 50000')
    })

    it('Visit banner 3', function () {
        const home = new HomePage()
        const banner = new Banner()

        banner.getSliderBanner(1)

        cy.url().should('eq', 'https://fado.vn/h/puma')
        cy.wait(1000)

        checkPriceProduct()
    })
})