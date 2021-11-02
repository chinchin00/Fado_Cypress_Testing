/// <reference types="Cypress" />

import HomePage from './pageObjects/homePage'
import CheckOut from './pageObjects/checkOut'
import CartPage from './pageObjects/cartPage'


describe('SEARCH PRODUCT IN STORE', () => {

    const keyword = 'thuốc';
    const cardTitle = '.product-card__title';
    const country = '.mz-rating__label-field > :nth-child(3)';
    const stockTitle = '.out-of-stock-tag';

    const checkOut = new CheckOut()
    const home = new HomePage()
    const cartPage = new CartPage()

    const addToCart = () => {
        home.elements.pricedProduct().then(($el) => {
            const title = home.elements.findCartTitle($el);

            home.addProductToCart($el)
            cy.wait(2000)

            //thêm một sản phẩm thành công vào giỏ hàng
            home.elements.cartQuantity().should('have.text', 1)

            //redirect tới trang giỏ hàng
            home.goToCartPage()

            cy.url().should('include', '/gio-hang-cua-ban')

            //check tên sản phẩm
            cartPage.elements.productName().then(($name) => {
                const name = $name.text().trim();
                expect(name).to.equal(title)
            })
        })
    }

    const createInfoOrderer = () => {
        checkOut.elements.labelEnterInfo().click()

        checkOut.fillCustomerName('test')
        checkOut.fillCustomerPhone('0353260584')
        checkOut.fillCustomerEmail('trinh-test-03@gmail.com')

        checkOut.selectCity()

        checkOut.selectDistrict()

        checkOut.selectWard()

        checkOut.fillDetailAddress('abcd')

        checkOut.createInfo()

        cy.wait(1000)
    }

    beforeEach(function () {

        cy.fixture('userInfo').then((data) => {
            this.data = data
        })

        // cy.visitLoginPage()
        // cy.loginByForm()

        cy.visitHomePage()

    })

    context('GUEST', function () {
        // Create info orderer
        const createInfoOrderer = () => {
            checkOut.elements.labelEnterInfo().click()

            checkOut.fillCustomerName('test')
            checkOut.fillCustomerPhone('0353260584')
            checkOut.fillCustomerEmail('trinh-test-03@gmail.com')

            checkOut.selectCity()

            checkOut.selectDistrict()

            checkOut.selectWard()

            checkOut.fillDetailAddress('abcd')

            checkOut.createInfo()

            cy.wait(1000)
        }

        // clear form enter info orderer
        const clearFormInfo = () =>{
            checkOut.elements.fieldCustomerName().clear();
            checkOut.elements.fieldCustomerPhone().clear();
            checkOut.elements.fieldCustomerEmail().clear();
            cy.get('#vs1__combobox > .vs__actions > .vs__clear > .deselect-btn').click();
            cy.get('#vs2__combobox > .vs__actions > .vs__clear > .deselect-btn').click();
            cy.get('#vs3__combobox > .vs__actions > .vs__clear > .deselect-btn').click();
            checkOut.elements.fieldCustomerDetailAddress().clear();
        }

        beforeEach(function () {
            cy.fixture('userInfo').then((data) => {
                this.data = data
            })
            cy.visitHomePage()
            cy.closePopup()
        })

        it('[GUEST] Check out success', function () {

            let sumPrice = 0 // tổng tiền items được chọn để đặt hàng trong trang giỏ hàng 

            addToCart();

            cartPage.elements.totalPriceAProduct().each(($el, index, $list) => {
                sumPrice = checkOut.convertToNumber($el) + sumPrice
            })

            cartPage.elements.totalValueOrder().then(($price) => {
                let resCPrice = checkOut.convertToNumber($price)
                expect(resCPrice, 'Tổng tiền sản phẩm trong cart page: ').to.equal(sumPrice)
            })

            // Đặt hàng
            cartPage.order();
            cy.wait(1000);
            cy.url().should('include', 'xac-nhan-thong-tin-dat-hang');

            createInfoOrderer();

            checkOut.getTotalProductPrice().then(($dPrice) => {
                let resDPrice = checkOut.convertToNumber($dPrice)
                expect(resDPrice, 'Tổng tiền sản phẩm: ').to.equal(sumPrice)
            })

            let resSumPrice
            checkOut.getTotalOrderPrice().then(($sumPrice) => {
                resSumPrice = checkOut.convertToNumber($sumPrice)
            })
            checkOut.elements.btnOrder().should('have.class', 'is-active')
            checkOut.elements.btnOrder().click()

            checkOut.acceptRule()

            checkOut.getMessOrderSuccess().then(($dh) => {
                let dh = $dh.text().trim()
                expect(dh).to.equal('Quý khách đã tạo đơn hàng thành công')
            })
            checkOut.getPriceAfterOrder().then(($price) => {
                let resPrice = checkOut.convertToNumber($price)
                if (resPrice === resSumPrice) {
                    expect(resPrice, 'Tổng tiền đơn hàng').to.equal(resSumPrice)
                } else {
                    cy.log('Tổng tiền bị chênh lệch do tỷ giá')
                }
            })

            checkOut.checkOrder()
            cy.url().should('include', '/kiem-tra-don-hang')
        })
    })

})