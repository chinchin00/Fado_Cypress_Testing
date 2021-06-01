/// <reference types="Cypress" />

import HomePage from "../../pageObjects/homePage"
import Banner from "../../pageObjects/homePage/banner"
import SearchPage from "../../pageObjects/searchPage"

describe('CHECKN BANNER', () => {
    function checkPriceProduct() {
        const search = new SearchPage()
        search.getProductList().each(($el, index, $list) => {
            expect($el).to.not.contains('Đang cập nhật')
        })
    }
    beforeEach(function () {
        cy.visitHomePage()

        cy.closePopup()
    })

    // it('Visit banner 1', function () {
    //     const home = new HomePage()
    //     const banner = new Banner()

    //     banner.getSliderBanner(1)

    //     cy.url().should('eq', 'https://fado.vn/h/cham-deal-thang-5')
    //     cy.wait(1000)

    //     for (let i = 1; i < 6; i++) {
    //         banner.getTemplateTab(11693, i)
    //         banner.getTemplateTab(11699, i)
    //         banner.getTemplateTab(11710, i)
    //         banner.getTemplateTab(11716, i)
    //         banner.getTemplateTab(11722, i)
    //         banner.getTemplateTab(11687, i)
    //         checkPriceProduct()
    //     }
    //     for (let i = 1; i < 5; i++) {
    //         banner.getTemplateTab(11705, i)
    //         checkPriceProduct()
    //     }
    // })

    it('Visit banner 2', function () {
        const banner = new Banner()

        banner.getSliderBanner(2)

        cy.url().should('eq', 'https://fado.vn/vn/store/may-loc-khong-khi-blue-air-pure-411-360-do-loc-tinh-dien-va-co-hoc-mau-xanh-BLUEAIRPURE411.html')

        cy.get('body').contains('Máy lọc không khí Blue Air Pure 411 , 360 độ, lọc tĩnh điện và cơ học - Màu xanh')
    })

    it('Visit banner 3', function(){
        const home = new HomePage()
        const banner = new Banner()

        banner.getSliderBanner(3)

        cy.url().should('eq', 'https://fado.vn/h/anne-klein')

        cy.wait(1000)

        checkPriceProduct()
    })

    it('Visit banner 4', function () {
        const banner = new Banner()

        banner.getSliderBanner(4)

        cy.url().should('eq', 'https://fado.vn/ho-tro/thanh-toan-vnpay-giam-ngay-50000.n2715')

        cy.get('body').contains('Thanh Toán VNPAY Giảm Ngay 50.000')
    })

    it('Visit banner 5', function () {
        const home = new HomePage()
        const banner = new Banner()

        banner.getSliderBanner(5)

        cy.url().should('eq', 'https://fado.vn/h/puma')
        cy.wait(1000)

        checkPriceProduct()
    })

   it('Visit banner 6', function(){
       const banner = new Banner()

       banner.getSliderBanner(6)

       cy.url().should('eq', 'https://fado.vn/h/golden-brand-pin-sac-du-phong')
   })
})