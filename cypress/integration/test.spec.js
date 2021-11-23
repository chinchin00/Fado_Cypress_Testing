/// <reference types="Cypress" />

import HomePage from './pageObjects/homePage'
import SearchPage from "./pageObjects/searchPage"


describe('SEARCH PRODUCT IN HOME PAGE', () => {
    const keyword = 'thuốc';
    const stockTitle = '.out-of-stock-tag';

    const checkSearchResult = ()=>{
        const search = new SearchPage()
        const home = new HomePage()
        
        search.getTabStore().should('have.class', 'is-active').then(() => {
            cy.get("body").then(($body) => {
                if (search.getProductList().length <= 0) {
                    search.getMessageBlank().contains('Không tìm thấy sản phẩm nào phù hợp cho từ khóa')
                }
                else {
                    search.getTitleBrand().then(($brand) => {
                        var brand = $brand.text().trim()
                        expect(brand).have.string('Thương hiệu')
                    })

                    search.getBrands().then(($el) => {
                        expect($el).to.lengthOf.lessThan(11)
                        expect($el).to.lengthOf.greaterThan(0)
                    })

                    search.getTitleCountry().then(($country) => {
                        var country = $country.text().trim()
                        expect(country).have.string('Quốc gia')
                    })

                    search.getTitleRating().then(($rating) => {
                        var rating = $rating.text().trim()
                        expect(rating).have.string('Đánh giá')
                    })

                    search.getTitleSevice().then(($sevice) => {
                        var sevice = $sevice.text().trim()
                        expect(sevice).have.string('Dịch Vụ & Khuyến Mãi')
                    })
                }
            })        
        })
    }
    
    beforeEach(function () {
        const home = new HomePage()
        cy.visitHomePage()

        home.closePopup()
    })

    it('Check all cat Fado', function () {
        cy.visit('https://fado.vn/xem-tat-ca-danh-muc-fado')
        cy.wait(1000)
        const links = []
        cy.get('.mz-container > .all-cate-section__head > .all-cate-section__head__title-col > a').each(($el, index, $list) => {
            cy.get('.mz-container > .all-cate-section__head > .all-cate-section__head__title-col > a').eq(index).click({force:true})
            cy.wait(2000)
            cy.get('.mz-layout__main-col').then(($el) => {
                if($el.find('.product-card-col').length > 0){
                    const url = cy.url()
                    links.push(url)
                }
            })
            cy.go('back')
        })
        cy.writeFile('element.txt', links);
    })
})