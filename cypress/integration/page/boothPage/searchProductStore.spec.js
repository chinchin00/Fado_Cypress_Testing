/// <reference types="Cypress" />
import SearchPage from '../../pageObjects/searchPage'
import HomePage from '../../pageObjects/homePage'

describe('SEARCH PRODUCT IN STORE', () => {

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

        cy.visitHomePage()

        cy.closePopup()
    })

    it('Check search store page', () => {
        const search = new SearchPage()
        const home = new HomePage()

        home.searchInStore(keyword)

        checkSearchResult()

    })

    it('Check search with keyword recommended', function(){
        const search = new SearchPage()

        search.getDropdownSearch().click()
        search.getDropMenu().should('have.class', 'is-show')

        search.getDropdownStore().click({ force: true })
        search.getDropdownStore().should('have.class', 'is-active')

        search.getDropdownTitle().should('have.text', 'Từ Gian hàng')

        search.fillSearchKeyword(keyword)
        cy.wait(3000)

        search.getSuggestItemWrap().then(($el) =>{
            expect($el).not.to.have.css('display', 'none')
            cy.get($el).children().first().children().then(($ch) =>{
                cy.get($ch).click()
                cy.wait(2000)
            })
        })  
        checkSearchResult()
    })

    it('Focus to search input', function () {
        const search = new SearchPage()
        search.getSearchInput().focus()
        search.getSuggestKeyword().then(($el) => {
            expect($el, 'Show popup suggest keyword').to.exist
        })
    })

    // it('Check detail products', function () {
    //     const search = new SearchPage()
    //     const home = new HomePage()

    //     home.searchInStore(keyword)

    //     checkSearchResult()

    //     const productNames = []
    //     const productCountries = []

    //     search.getProductList().each(($el, index, $list) => {

    //         search.getCardCountry().eq(index).then(($country) => {
    //             productCountries.push($country.text().trim())
    //         })

    //         search.getCardTitle().eq(index).then(($title) => {
    //             productNames.push($title.text().trim())
    //         })

    //         search.getCardTitle().eq(index).click({ force: true })
    //         cy.closePopup()

    //         search.getProductName().then(($name) => {
    //             const name = $name.text().trim()
    //             expect(name).to.equal(productNames[index])
    //         })

    //         home.getBody().then(($body) => {
    //             if ($body.find(stockTitle).length > 0) {
    //                 cy.get(stockTitle).contains('Hết hàng')

    //             } else {
    //                 expect(search.getPriceDetail()).to.exist
    //                 expect(search.getBuyNowDetail(), 'Button Buy Now').to.exist
    //                 expect(search.getAddToCartDetail(), 'Add this product to cart').to.exist
    //             }
    //         })

    //         search.getCountryProduct().then($country =>{
    //             const country = $country.text().trim()
    //             expect(country, 'Country').contain(productCountries[index])
    //         })

    //         cy.go('back')
    //     })

    // })

})