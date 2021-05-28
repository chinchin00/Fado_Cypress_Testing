/// <reference types="Cypress" />

import AddToCard from '../../pageObjects/addToCard'
import HomePage from '../../pageObjects/homePage'
import CheckOut from "../../pageObjects/checkOut";

describe('ADD PRODUCT TO CARD', ()=>{
    let keyword = 'thuốc';

    beforeEach(function () {
        cy.fixture('userInfo').then((data) => {
            this.data = data
        })

        cy.visitHomePage()

        cy.closePopup()

    })

    it('Add a product to card', function () {
        const checkOut = new CheckOut()
        const home = new HomePage()
        const addToCard = new AddToCard()

        //search product
        home.searchInStore(keyword)

        //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
        addToCard.getPricedProduct().then(($el) => {
            const title = addToCard.findCardTitle($el);

            addToCard.addToCard($el)
            cy.wait(3000)

            //thêm một sản phẩm thành công vào giỏ hàng
            addToCard.getCardQuantity().should('have.text', 1)

            //redirect tới trang giỏ hàng
            addToCard.goToCardPage()

            cy.url().should('include', '/gio-hang-cua-ban')

            //check tên sản phẩm
            addToCard.getProductName().then(($name) => {
                const name = $name.text().trim();
                expect(name).to.equal(title)
            })
        })

        // check tab Nhập khẩu tiêu dùng được active
        addToCard.getConsumptionImport().should('have.class', 'is-active')

        // check giá sản phẩm
        addToCard.getTotalPriceAProduct().then(($currentPrice) => {
            const res = checkOut.convertToNumber($currentPrice);

            //check tổng giá trị đơn hàng
            addToCard.getTotalValueOrder().then(($price) => {
                const resPrice = checkOut.convertToNumber($price);
                expect(resPrice).to.equal(res)
            })

            // check đơn hàng freeship
            if (res < 1500000) {
                addToCard.getMissAmountFree().then(($freeShip) => {
                    const reship = checkOut.convertToNumber($freeShip)
                    cy.log('Mua thêm ' + reship + ' đ để được freeship')
                    expect(res).to.equal(1500000 - reship)
                })
            }
            else {
                addToCard.getMessFreeShip().then(($freeText) => {
                    const freeText = $freeText.text().trim();
                    expect(freeText).to.equal('Đơn hàng đã được miễn phí giao hàng trong nước')
                })
            }
        })

        addToCard.getProductQuantity().then(($el) => {
            const num = parseInt($el.val())
            cy.get('.mz-number-control__up-btn').click()
            cy.get('.mz-number-control__input').should('have.value', num + 1)
        })
    })

    it('Hủy thao tác xóa sản phẩm trong giỏ hàng', function () {
        const checkOut = new CheckOut()
        const home = new HomePage()
        const addToCard = new AddToCard()

        //Thêm sản phẩm có giá đầu tiên vào giỏ hàng

        home.searchInStore(keyword)

        addToCard.getPricedProduct().then(($el) => {
            let title = addToCard.findCardTitle($el)

            addToCard.addToCard($el)
            cy.wait(3000)

            //thêm một sản phẩm thành công vào giỏ hàng
            addToCard.getCardQuantity().should('have.text', 1)

            //redirect tới trang giỏ hàng
            addToCard.goToCardPage()

            cy.url().should('include', '/gio-hang-cua-ban')

            //check tên sản phẩm
            addToCard.getProductName().then(($name) => {
                let name = $name.text().trim()
                expect(name).to.equal(title)
            })
        })

        //count loại mặt hàng trong giỏ hàng
        let count = 0
        addToCard.getMainProduct().then(($el) => {
            count = Number($el.length)
        })

        // click icon xóa sản phẩm
        addToCard.clickDeleteProduct()
        addToCard.getTitleConfirmModal().then(($title) => {
            expect($title).to.have.text('Loại bỏ sản phẩm khỏi giỏ hàng')
            cy.wait(2000)
        })

        // cancel thao tác xóa sản phẩm
        addToCard.cancelDelete()
        addToCard.getMainProduct().then(($el) => {
            let count1 = Number($el.length)
            expect(count).to.equal(count1)
        })

    })

    it('Delete the product in the shopping card with an item', function () {
        const checkOut = new CheckOut()
        const home = new HomePage()
        const addToCard = new AddToCard()

       //search product
        home.searchInStore(keyword)

        //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
        addToCard.getPricedProduct().then(($el) => {
            const title = addToCard.findCardTitle($el);

            addToCard.addToCard($el)
            cy.wait(3000)

            //thêm một sản phẩm thành công vào giỏ hàng
            addToCard.getCardQuantity().should('have.text', 1)

            //redirect tới trang giỏ hàng
            addToCard.goToCardPage()

            cy.url().should('include', '/gio-hang-cua-ban')

            //check tên sản phẩm
            addToCard.getProductName().then(($name) => {
                const name = $name.text().trim();
                expect(name).to.equal(title)
            })
        })

        // click icon xóa sản phẩm
        addToCard.clickDeleteProduct()
        addToCard.getTitleConfirmModal().then(($title) => {
            expect($title).to.have.text('Loại bỏ sản phẩm khỏi giỏ hàng')

        })
        //xóa sản phẩm
        cy.wait(1000)
        addToCard.deleteProduct()

        cy.wait(2000)
        addToCard.getContentBlankCard().then(($pd) => {
            expect($pd).to.have.text('Chưa có sản phẩm nào trong giỏ hàng')
        })

        addToCard.getLabelBtnContinue().then(($btn) => {
            expect($btn).to.have.text('Tiếp tục mua sắm')
            cy.get($btn).click()

            cy.url().should('equal', Cypress.config('baseUrl'))
        })
    })
})