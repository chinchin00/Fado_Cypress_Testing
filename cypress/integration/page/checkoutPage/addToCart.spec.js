/// <reference types="Cypress" />

import CartPage from '../../pageObjects/cartPage'
import HomePage from '../../pageObjects/homePage'
import CheckOut from "../../pageObjects/checkOut";

describe('ADD PRODUCT TO CART', ()=>{
    let keyword = 'thuốc';

    beforeEach(function () {
        cy.fixture('userInfo').then((data) => {
            this.data = data
        })

        cy.visitHomePage()

        cy.closePopup()

    })

    it('Add a product to cart', function () {
        const checkOut = new CheckOut()
        const home = new HomePage()
        const cartPage = new CartPage()

        //search product
        home.searchInStore(keyword)

        //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
        home.elements.pricedProduct().then(($el) => {
            const title = home.elements.findCartTitle()($el);

            home.addProductToCart($el)
            cy.wait(3000)

            //thêm một sản phẩm thành công vào giỏ hàng
            cartPage.getCardQuantity().should('have.text', 1)

            //redirect tới trang giỏ hàng
            home.goToCartPage()

            cy.url().should('include', '/gio-hang-cua-ban')

            //check tên sản phẩm
            cartPage.elements.productName().then(($name) => {
                const name = $name.text().trim();
                expect(name).to.equal(title)
            })
        })

        // check tab Nhập khẩu tiêu dùng được active
        cartPage.elements.consumptionImport().should('have.class', 'is-active')

        // check giá sản phẩm
        cartPage.elements.totalPriceAProduct().then(($currentPrice) => {
            const res = checkOut.convertToNumber($currentPrice);

            //check tổng giá trị đơn hàng
            cartPage.elements.totalValueOrder().then(($price) => {
                const resPrice = checkOut.convertToNumber($price);
                expect(resPrice).to.equal(res)
            })

            // check đơn hàng freeship
            if (res < 1500000) {
                cartPage.elements.missAmountFree().then(($freeShip) => {
                    const reship = checkOut.convertToNumber($freeShip)
                    cy.log('Mua thêm ' + reship + ' đ để được freeship')
                    expect(res).to.equal(1500000 - reship)
                })
            }
            else {
                cartPage.getMessFreeShip().then(($freeText) => {
                    const freeText = $freeText.text().trim();
                    expect(freeText).to.equal('Đơn hàng đã được miễn phí giao hàng trong nước')
                })
            }
        })

        cartPage.elements.productQuantity().then(($el) => {
            const num = parseInt($el.val())
            cy.get('.mz-number-control__up-btn').click()
            cy.get('.mz-number-control__input').should('have.value', num + 1)
        })
    })

    it('Hủy thao tác xóa sản phẩm trong giỏ hàng', function () {
        const checkOut = new CheckOut()
        const home = new HomePage()
        const cartPage = new CartPage()

        //Thêm sản phẩm có giá đầu tiên vào giỏ hàng

        home.searchInStore(keyword)

        home.elements.pricedProduct().then(($el) => {
            let title = home.elements.findCartTitle()($el)

            home.addProductToCart($el)
            cy.wait(3000)

            //thêm một sản phẩm thành công vào giỏ hàng
            cartPage.getCardQuantity().should('have.text', 1)

            //redirect tới trang giỏ hàng
            home.goToCartPage()

            cy.url().should('include', '/gio-hang-cua-ban')

            //check tên sản phẩm
            cartPage.elements.productName().then(($name) => {
                let name = $name.text().trim()
                expect(name).to.equal(title)
            })
        })

        //count loại mặt hàng trong giỏ hàng
        let count = 0
        cartPage.elements.mainProduct().then(($el) => {
            count = Number($el.length)
        })

        // click icon xóa sản phẩm
        cartPage.deleteAProduct()
        cartPage.elements.titleComfirmModal().then(($title) => {
            expect($title).to.have.text('Loại bỏ sản phẩm khỏi giỏ hàng')
            cy.wait(2000)
        })

        // cancel thao tác xóa sản phẩm
        cartPage.cancelDelete()
        cartPage.elements.mainProduct().then(($el) => {
            let count1 = Number($el.length)
            expect(count).to.equal(count1)
        })

    })

    it('Delete the product in the shopping card with an item', function () {
        const checkOut = new CheckOut()
        const home = new HomePage()
        const cartPage = new CartPage()

       //search product
        home.searchInStore(keyword)

        //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
        home.elements.pricedProduct().then(($el) => {
            const title = home.elements.findCartTitle()($el);

            home.addProductToCart($el)
            cy.wait(3000)

            //thêm một sản phẩm thành công vào giỏ hàng
            cartPage.getCardQuantity().should('have.text', 1)

            //redirect tới trang giỏ hàng
            home.goToCartPage()

            cy.url().should('include', '/gio-hang-cua-ban')

            //check tên sản phẩm
            cartPage.elements.productName().then(($name) => {
                const name = $name.text().trim();
                expect(name).to.equal(title)
            })
        })

        // click icon xóa sản phẩm
        cartPage.deleteAProduct()
        cartPage.elements.titleComfirmModal().then(($title) => {
            expect($title).to.have.text('Loại bỏ sản phẩm khỏi giỏ hàng')

        })
        //xóa sản phẩm
        cy.wait(1000)
        cartPage.deleteProduct()

        cy.wait(2000)
        cartPage.elements.contentBlankCart().then(($pd) => {
            expect($pd).to.have.text('Chưa có sản phẩm nào trong giỏ hàng')
        })

        cartPage.elements.labelBtnContinue().then(($btn) => {
            expect($btn).to.have.text('Tiếp tục mua sắm')
            cy.get($btn).click()

            cy.url().should('equal', Cypress.config('baseUrl'))
        })
    })
})