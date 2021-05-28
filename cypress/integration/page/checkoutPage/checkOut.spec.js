/// <reference types="Cypress" />

import AddToCard from '../../pageObjects/addToCard'
import CheckOut from '../../pageObjects/checkOut'
import HomePage from '../../pageObjects/homePage'
import LoginPage from '../../pageObjects/loginPage'
import CancelOrder from "../../pageObjects/cancelOrder";

describe('Checkout', () => {

    let keyword = 'thuốc';

    const cancelOrder = () =>{
        const checkOut = new CheckOut()

         //HỦY ĐƠN HÀNG
         checkOut.checkOrder()
         cy.url().should('include', 'chi-tiet-don-hang')
 
         checkOut.clickBtnCancelOrder()
 
         // show modal hủy đơn hàng khi click btn 'Hủy đơn hàng'
         checkOut.getCancelOrderModal().should('have.class', 'show')

         //select lý do hủy đơn hàng
         checkOut.selectReasonCancel()
 
         //xác nhận hủy đơn hàng
         checkOut.cancelOrder()
 
         //xacs nhận đơn hàng đã được hủy
         checkOut.getOrderStatusText().should('contain', 'Đã hủy')
    }

    beforeEach(function () {
        cy.fixture('userInfo').then((data) => {
            this.data = data
        })

        cy.visitHomePage()

        cy.closePopup()

    })

    it('Thêm sản phẩm vào giỏ hàng và thanh toán', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()

        // search in store
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

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        //check out 
        addToCard.getTotalValueOrder().then(($price) => {
            let resPrice = checkOut.convertToNumber($price)

            // Đặt hàng
            addToCard.order()
            cy.wait(2000)
            cy.url().should('include', 'xac-nhan-thong-tin-dat-hang')

            //check giá sản phẩm
            checkOut.getTotalProductPrice().then(($priceSt) => {
                let resPriceSt = checkOut.convertToNumber($priceSt)
                expect(resPriceSt).to.equal(resPrice)
            })
        })

        //check thông tin đặt hàng
        checkOut.getBtnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })
        checkOut.getLabelEnterInfo().then(($info) => {
            let info = $info.text().trim()
            expect(info).to.equal('Nhập thông tin đặt hàng')
        })

        checkOut.getBtnOrder().should('not.have.class', 'is-active')

    })

    it('Không nhập họ tên người đặt đơn hàng', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()

        // search in store
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

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        addToCard.order()

        //check thông tin đặt hàng
        checkOut.getBtnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })
        checkOut.getLabelEnterInfo().then(($info) => {
            let info = $info.text().trim()
            expect(info).to.equal('Nhập thông tin đặt hàng')
        })

        checkOut.getBtnOrder().should('not.have.class', 'is-active')

        // cy.get('.user-address-book-update-info-modal').should('have.attr', 'aria-hidden', 'true')
        //tạo địa chỉ
        checkOut.getLabelEnterInfo().click({force: true})

        checkOut.fillCustomerPhone('0353260584')
        checkOut.fillCustomerEmail('test1@yopmail.com')

        checkOut.selectCity()

        checkOut.selectDistrict()

        checkOut.selectWard()

        checkOut.fillDetailAddress('abcd')

        checkOut.createInfo()

        checkOut.getMessErrorName().should('have.text', 'Họ tên đầy đủ là bắt buộc')

    })

    it('Không nhập số điện thoại người đặt đơn hàng', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()

        // search in store
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

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        addToCard.order()

        //check thông tin đặt hàng
        checkOut.getBtnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })
        checkOut.getLabelEnterInfo().then(($info) => {
            let info = $info.text().trim()
            expect(info).to.equal('Nhập thông tin đặt hàng')
        })

        checkOut.getBtnOrder().should('not.have.class', 'is-active')

        // cy.get('.user-address-book-update-info-modal').should('have.attr', 'aria-hidden', 'true')
        //tạo địa chỉ
        checkOut.getLabelEnterInfo().click()

        checkOut.fillCustomerName('QC_test')

        checkOut.fillCustomerEmail('test1@yopmail.com')

        checkOut.selectCity()

        checkOut.selectDistrict()

        checkOut.selectWard()

        checkOut.fillDetailAddress('abcd')

        checkOut.createInfo()

        checkOut.getMessErrorPhone().should('have.text', 'Điện thoại là bắt buộc')

    })

    it('Không nhập email người đặt đơn hàng', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()

        // search in store
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

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        addToCard.order()

        //check thông tin đặt hàng
        checkOut.getBtnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })
        checkOut.getLabelEnterInfo().then(($info) => {
            let info = $info.text().trim()
            expect(info).to.equal('Nhập thông tin đặt hàng')
        })

        checkOut.getBtnOrder().should('not.have.class', 'is-active')

        // cy.get('.user-address-book-update-info-modal').should('have.attr', 'aria-hidden', 'true')
        //tạo địa chỉ
        checkOut.getLabelEnterInfo().click()

        checkOut.fillCustomerName('QC_test')

        checkOut.fillCustomerPhone('0353260584')

        checkOut.selectCity()

        checkOut.selectDistrict()

        checkOut.selectWard()

        checkOut.fillDetailAddress('abcd')

        checkOut.createInfo()

        checkOut.getMessErrorEmail().should('have.text', 'Email là bắt buộc')

    })

    it('Không nhập thông tin tỉnh/thành phố trong trường Địa Điểm', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()

        // search in store
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

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        addToCard.order()

        //check thông tin đặt hàng
        checkOut.getBtnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })
        checkOut.getLabelEnterInfo().then(($info) => {
            let info = $info.text().trim()
            expect(info).to.equal('Nhập thông tin đặt hàng')
        })

        checkOut.getBtnOrder().should('not.have.class', 'is-active')

        // cy.get('.user-address-book-update-info-modal').should('have.attr', 'aria-hidden', 'true')
        //tạo địa chỉ
        checkOut.getLabelEnterInfo().click()

        checkOut.fillCustomerName('QC_test')
        checkOut.fillCustomerPhone('0353260584')
        checkOut.fillCustomerEmail('test1@yopmail.com')

        checkOut.fillDetailAddress('abcd')
        checkOut.getComboboxDistrict().then(($quan) => {
            expect($quan).to.be.disabled
        })
        checkOut.getComboboxWard().then(($xa) => {
            expect($xa).to.be.disabled
        })
        checkOut.createInfo()

        checkOut.getMessErrorAddress().then(($address) => {
            let address = $address.text().trim()
            expect(address).to.equal('Vui lòng chọn đầy đủ địa điểm')
        })

    })

    it('Không nhập thông tin quận trong trường Địa Điểm', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()

        // search in store
        home.searchInStore(keyword)

       //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
        addToCard.getPricedProduct().then(($el) => {
           const title = addToCard.findCardTitle($el);

           addToCard.addToCard($el)
           cy.wait(2000)

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

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        addToCard.order()

        //check thông tin đặt hàng
        checkOut.getBtnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })
        checkOut.getLabelEnterInfo().then(($info) => {
            let info = $info.text().trim()
            expect(info).to.equal('Nhập thông tin đặt hàng')
        })

        checkOut.getBtnOrder().should('not.have.class', 'is-active')

        // cy.get('.user-address-book-update-info-modal').should('have.attr', 'aria-hidden', 'true')
        //tạo địa chỉ
        checkOut.getLabelEnterInfo().click()

        checkOut.fillCustomerName('QC_test')
        checkOut.fillCustomerPhone('0353260584')
        checkOut.fillCustomerEmail('test1@yopmail.com')

        checkOut.selectCity()

        checkOut.fillDetailAddress('abcd')

        checkOut.getComboboxWard().then(($xa) => {
            expect($xa).to.be.disabled
        })

        checkOut.createInfo()

        checkOut.getMessErrorAddress().then(($address) => {
            let address = $address.text().trim()
            expect(address).to.equal('Vui lòng chọn đầy đủ địa điểm')
        })

    })

    it('Không nhập thông tin xã/phường trong trường Địa Điểm', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()

        // search in store
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

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        addToCard.order()

        //check thông tin đặt hàng
        checkOut.getBtnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })
        checkOut.getLabelEnterInfo().then(($info) => {
            let info = $info.text().trim()
            expect(info).to.equal('Nhập thông tin đặt hàng')
        })

        checkOut.getBtnOrder().should('not.have.class', 'is-active')

        // cy.get('.user-address-book-update-info-modal').should('have.attr', 'aria-hidden', 'true')
        //tạo địa chỉ
        checkOut.getLabelEnterInfo().click()

        checkOut.fillCustomerName('QC_test')
        checkOut.fillCustomerPhone('0353260584')
        checkOut.fillCustomerEmail('test1@yopmail.com')

        checkOut.selectCity()

        checkOut.selectDistrict()

        checkOut.fillDetailAddress('abcd')

        checkOut.createInfo()

        checkOut.getMessErrorAddress().then(($address) => {
            let address = $address.text().trim()
            expect(address).to.equal('Vui lòng chọn đầy đủ địa điểm')
        })

    })

    it('Không nhập thông tin trong trường địa điểm chính xác', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()

        // search in store
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

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        addToCard.order()

        //check thông tin đặt hàng
        checkOut.getBtnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })
        checkOut.getLabelEnterInfo().then(($info) => {
            let info = $info.text().trim()
            expect(info).to.equal('Nhập thông tin đặt hàng')
        })

        checkOut.getBtnOrder().should('not.have.class', 'is-active')

        // cy.get('.user-address-book-update-info-modal').should('have.attr', 'aria-hidden', 'true')
        //tạo địa chỉ
        checkOut.getLabelEnterInfo().click()

        checkOut.fillCustomerName('QC_test')
        checkOut.fillCustomerPhone('0353260584')
        checkOut.fillCustomerEmail('test1@yopmail.com')

        checkOut.selectCity()

        checkOut.selectDistrict()

        checkOut.selectWard()

        checkOut.createInfo()

        checkOut.getMessErrorDetailAddress().then(($dc) => {
            expect($dc).to.not.have.css('display', 'none')
            expect($dc).to.have.text('Vui lòng nhập địa chỉ cụ thể')
        })
    })

    it('Không nhập tất cả thông tin trong form địa chỉ người nhận hàng', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()

        //search in store
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

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        addToCard.order()

        //check thông tin đặt hàng
        checkOut.getBtnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })
        checkOut.getLabelEnterInfo().then(($info) => {
            let info = $info.text().trim()
            expect(info).to.equal('Nhập thông tin đặt hàng')
        })

        checkOut.getBtnOrder().should('not.have.class', 'is-active')

        // cy.get('.user-address-book-update-info-modal').should('have.attr', 'aria-hidden', 'true')
        //tạo địa chỉ
        checkOut.getLabelEnterInfo().click()

        checkOut.createInfo()

        checkOut.getMessErrorName().should('have.text', 'Họ tên đầy đủ là bắt buộc')
        checkOut.getMessErrorPhone().should('have.text', 'Điện thoại là bắt buộc')
        checkOut.getMessErrorEmail().should('have.text', 'Email là bắt buộc')

        checkOut.getComboboxDistrict().then(($quan) => {
            expect($quan).to.be.disabled
        })
        checkOut.getComboboxWard().then(($xa) => {
            expect($xa).to.be.disabled
        })

        checkOut.getMessErrorAddress().then(($address) => {
            let address = $address.text().trim()
            expect(address).to.equal('Vui lòng chọn đầy đủ địa điểm')
        })

        checkOut.getMessErrorDetailAddress().then(($dc) => {
            expect($dc).to.not.have.css('display', 'none')
            expect($dc).to.have.text('Vui lòng nhập địa chỉ cụ thể')
        })
    })

    it('Hủy thao tác nhập thông tin đơn hàng', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()

        // search product in store
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

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        addToCard.order()

        //check thông tin đặt hàng
        checkOut.getBtnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })
        checkOut.getLabelEnterInfo().then(($info) => {
            let info = $info.text().trim()
            expect(info).to.equal('Nhập thông tin đặt hàng')
        })

        checkOut.getBtnOrder().should('not.have.class', 'is-active')

        // cy.get('.user-address-book-update-info-modal').should('have.attr', 'aria-hidden', 'true')
        //tạo địa chỉ
        checkOut.getLabelEnterInfo().click()

        checkOut.fillCustomerName('QC_test')
        checkOut.fillCustomerPhone('0353260584')
        checkOut.fillCustomerEmail('test1@yopmail.com')

        checkOut.selectCity()

        checkOut.selectDistrict()

        checkOut.selectWard()

        checkOut.fillDetailAddress('abcd')

        checkOut.closeAddressModal()

        checkOut.getBtnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })
        checkOut.getLabelEnterInfo().then(($info) => {
            let info = $info.text().trim()
            expect(info).to.equal('Nhập thông tin đặt hàng')
        })

        checkOut.getBtnOrder().should('not.have.class', 'is-active')
    })

    it('Nhập đầy đủ thông tin sản phẩm và check out', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()
        let cancelOrder = new CancelOrder()

        // search product in store
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

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        let sumPrice = 0
        addToCard.getTotalPriceAProduct().each(($el, index, $list) => {
            sumPrice = checkOut.convertToNumber($el) + sumPrice
        })

        addToCard.getTotalValueOrder().then(($price) => {
            let resCPrice = checkOut.convertToNumber($price)
            expect(resCPrice, 'Tổng tiền sản phẩm: ').to.equal(sumPrice)
        })

        addToCard.order()

        //check thông tin đặt hàng
        checkOut.getBtnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })
        checkOut.getLabelEnterInfo().then(($info) => {
            let info = $info.text().trim()
            expect(info).to.equal('Nhập thông tin đặt hàng')
        })

        checkOut.getBtnOrder().should('not.have.class', 'is-active')

        // cy.get('.user-address-book-update-info-modal').should('have.attr', 'aria-hidden', 'true')
        //tạo địa chỉ
        checkOut.getLabelEnterInfo().click()

        checkOut.fillCustomerName('test')
        checkOut.fillCustomerPhone('0353260584')
        checkOut.fillCustomerEmail('test1@yopmail.com')

        checkOut.selectCity()

        checkOut.selectDistrict()

        checkOut.selectWard()

        checkOut.fillDetailAddress('abcd')

        checkOut.createInfo()

        cy.wait(3000)
        checkOut.getTotalProductPrice().then(($dPrice) => {
            let resDPrice = checkOut.convertToNumber($dPrice)
            expect(resDPrice, 'Tổng tiền sản phẩm: ').to.equal(sumPrice)
        })

        let resSumPrice
        checkOut.getTotalOrderPrice().then(($sumPrice) => {
            resSumPrice = checkOut.convertToNumber($sumPrice)
        })
        checkOut.getBtnOrder().should('have.class', 'is-active')
        checkOut.getBtnOrder().click()

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

        cancelOrder.checkOrder()
        cy.url().should('include', '/kiem-tra-don-hang')

    })

    it('Đăng nhập tài khoản đã có địa chỉ mặc định', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()
        let login = new LoginPage()

        // search product in store
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

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        addToCard.order()

        //check thông tin đặt hàng
        checkOut.getBtnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })
        checkOut.getLabelEnterInfo().then(($info) => {
            let info = $info.text().trim()
            expect(info).to.equal('Nhập thông tin đặt hàng')
        })

        checkOut.getBtnOrder().should('not.have.class', 'is-active')

        // Đăng nhập
        checkOut.getBtnLogin().click()
        cy.url().should('include', 'dang-nhap')

        login.fillEmail(this.data.email)
        login.fillPass(this.data.password)

        login.submit()
        cy.url().should('include', 'xac-nhan-thong-tin-dat-hang')

        cy.wait(3000)
        checkOut.getBtnOrder().should('have.class', 'is-active')
    })

    it('Đăng nhập tài khoản chưa có địa chỉ mặc định', function () {
        const checkOut = new CheckOut()
        const home = new HomePage()
        const addToCard = new AddToCard()
        const login = new LoginPage()

        // search product in store
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

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        addToCard.order()

        //check thông tin đặt hàng
        checkOut.getBtnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })
        checkOut.getLabelEnterInfo().then(($info) => {
            let info = $info.text().trim()
            expect(info).to.equal('Nhập thông tin đặt hàng')
        })

        checkOut.getBtnOrder().should('not.have.class', 'is-active')

        // Đăng nhập
        checkOut.getBtnLogin().click()
        cy.url().should('include', 'dang-nhap')

        login.fillEmail(this.data.email2)
        login.fillPass(this.data.passEmail2)

        login.submit()
    })

    /////////////đăng ký
    it('Đăng ký tài khoản mới', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()
    })

    /////////Login tài khoản có địa chỉ trước khi checkout
    it('Login tài khoản có sổ địa chỉ trước khi thanh toán', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()
        let login = new LoginPage()

        //login
        cy.get('.login-btn').click()
        cy.url().should('include', 'dang-nhap')
        login.fillEmail(this.data.email)
        login.fillPass(this.data.password)

        login.submit()
        cy.wait(3000)
        cy.closePopup()

        //get quantity product in card
        var itemQuantity
        addToCard.getCardQuantity().then(($el) => {
            itemQuantity = Number($el.text())
        })

        // search product in store
        home.searchInStore(keyword)

       //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
        addToCard.getPricedProduct().then(($el) => {
           const title = addToCard.findCardTitle($el);

           addToCard.addToCard($el)
           cy.wait(3000)

           //thêm một sản phẩm thành công vào giỏ hàng
           addToCard.getCardQuantity().should('have.text', itemQuantity + 1)

           //redirect tới trang giỏ hàng
           addToCard.goToCardPage()

           cy.url().should('include', '/gio-hang-cua-ban')

           //check tên sản phẩm
           addToCard.getProductName().then(($name) => {
               const name = $name.text().trim()
               expect(name).to.equal(title)
           })
       })

        //get địa chỉ trong sổ địa chỉ
        var username, phoneNumber, address
        cy.visit('https://fado.vn/so-dia-chi')
        cy.url().should('include', 'so-dia-chi')

        checkOut.getAddressBookType().each(($el, index, $list) => {
            let text = $el.text().trim()
            if (text === 'Mặc định') {
                checkOut.getAddressBookItem($el).then(($pr) => {
                    checkOut.getUserNameAddress($pr).then(($userName) => {
                        username = $userName.text().trim();
                    })
                    checkOut.getPhoneAddress($pr).then(($phone) => {
                        phoneNumber = $phone.text().trim();
                    })
                    checkOut.getDetailAddress($pr).then(($address) => {
                        address = $address.text().trim();
                    })
                })
            }
        })

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        //tổng giá trị sản phẩm trong giỏ hàng
        let sumPrice = 0
        addToCard.getTotalPriceAProduct().each(($el, index, $list) => {
            sumPrice = checkOut.convertToNumber($el) + sumPrice
        })
        //check tổng giá trị sản phẩm trong giỏ hàng
        addToCard.getTotalValueOrder().then(($price) => {
            let resCPrice = checkOut.convertToNumber($price)
            expect(resCPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })
        // Chuyển tới trang thanh toán từ giỏ hàng
        addToCard.order()
        //check giá sản phẩm
        checkOut.getTotalProductPrice().then(($dPrice) => {
            let resDPrice = checkOut.convertToNumber($dPrice)
            expect(resDPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })
        //Check địa chỉ
        checkOut.getBtnLabelAddress().should('have.text', 'Sổ địa chỉ')

        checkOut.getOrdererName().then(($el) => {
            let urs = $el.text().trim()
            expect(urs, 'Username').to.equal(username)
        })
        checkOut.getOrdererPhone().then(($el) => {
            let phone = $el.text().trim()
            expect(phone, 'Số điện thoại').to.equal(phoneNumber)
        })
        checkOut.getOrdererAddress().then(($el) => {
            let adr = $el.text().trim()
            expect(address, 'Địa chỉ').to.contain(adr)
        })
        checkOut.getOrdererDetailAddress().then(($el) => {
            let ad = $el.text().trim()
            let resad = ad.split(" ")
            expect(address, 'Địa chỉ chính xác').to.contain(resad[1])
        })
        // get tổng số tiền cần thanh toán của đơn hàng
        cy.wait(3000)
        let resSumPrice
        checkOut.getTotalOrderPrice().then(($sumPrice) => {
            resSumPrice = checkOut.convertToNumber($sumPrice)
        })
        //Thanh toán đơn hàng
        checkOut.getBtnOrder().should('have.class', 'is-active')
        checkOut.getBtnOrder().click()

        //đồng ý điều khoản
        checkOut.acceptRule()
        cy.wait(2000)

        //check lại thông tin sau khi đặt hàng thành công
        checkOut.getMessOrderSuccess().then(($dh) => {
            const dh = $dh.text().trim()
            expect(dh).to.equal('Quý khách đã tạo đơn hàng thành công')
        })
        checkOut.getPriceAfterOrder().then(($price) => {
            const resPrice = checkOut.convertToNumber($price)
            const price = Math.abs(resPrice - resSumPrice)
            expect(price, 'Kiểm tra tổng tiền đơn hàng').to.be.lessThan(3000)
        })

        //HỦY ĐƠN HÀNG
        cancelOrder()
    })

    it('Tạo địa chỉ nhận hàng mới với user đã đăng nhập trước đó', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()
        let login = new LoginPage()

        //login
        cy.get('.login-btn').click()
        cy.url().should('include', 'dang-nhap')
        login.fillEmail(this.data.email)
        login.fillPass(this.data.password)

        login.submit()
        cy.wait(3000)
        cy.closePopup()

        //get quantity product in card
        var itemQuantity
        addToCard.getCardQuantity().then(($el) => {
            itemQuantity = Number($el.text())
        })

        //search product in store
        home.searchInStore(keyword)

       //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
        addToCard.getPricedProduct().then(($el) => {
           const title = addToCard.findCardTitle($el);

           addToCard.addToCard($el)
           cy.wait(3000)

           //thêm một sản phẩm thành công vào giỏ hàng
           addToCard.getCardQuantity().should('have.text', itemQuantity + 1)

           //redirect tới trang giỏ hàng
           addToCard.goToCardPage()

           cy.url().should('include', '/gio-hang-cua-ban')

           //check tên sản phẩm
           addToCard.getProductName().then(($name) => {
               const name = $name.text().trim();
               expect(name).to.equal(title)
           })
       })

        //get địa chỉ trong sổ địa chỉ
        var username, phoneNumber, address
        cy.visit('https://fado.vn/so-dia-chi')
        cy.url().should('include', 'so-dia-chi')

        checkOut.getAddressBookType().each(($el, index, $list) => {
            let text = $el.text().trim()
            if (text === 'Mặc định') {
                checkOut.getAddressBookItem($el).then(($pr) => {
                    checkOut.getUserNameAddress($pr).then(($userName) => {
                        username = $userName.text().trim();
                    })
                    checkOut.getPhoneAddress($pr).then(($phone) => {
                        phoneNumber = $phone.text().trim();
                    })
                    checkOut.getDetailAddress($pr).then(($address) => {
                        address = $address.text().trim();
                    })
                })
            }
        })

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        //tổng giá trị sản phẩm trong giỏ hàng
        let sumPrice = 0
        addToCard.getTotalPriceAProduct().each(($el, index, $list) => {
            sumPrice = checkOut.convertToNumber($el) + sumPrice
        })
        //check tổng giá trị sản phẩm trong giỏ hàng
        addToCard.getTotalValueOrder().then(($price) => {
            let resCPrice = checkOut.convertToNumber($price)
            expect(resCPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })
        // Chuyển tới trang thanh toán từ giỏ hàng
        addToCard.order()
        //check giá sản phẩm
        checkOut.getTotalProductPrice().then(($dPrice) => {
            let resDPrice = checkOut.convertToNumber($dPrice)
            expect(resDPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })
        //Check địa chỉ
        checkOut.getBtnLabelAddress().should('have.text', 'Sổ địa chỉ')
        checkOut.getOrdererName().then(($el) => {
            let urs = $el.text().trim()
            expect(urs, 'Username').to.equal(username)
        })
        checkOut.getOrdererPhone().then(($el) => {
            let phone = $el.text().trim()
            expect(phone, 'Số điện thoại').to.equal(phoneNumber)
        })
        checkOut.getOrdererAddress().then(($el) => {
            let adr = $el.text().trim()
            expect(address, 'Địa chỉ').to.contain(adr)
        })
        checkOut.getOrdererDetailAddress().then(($el) => {
            let ad = $el.text().trim()
            let resad = ad.split(" ")
            expect(address, 'Địa chỉ chính xác').to.contain(resad[1])
        })
        // get tổng số tiền cần thanh toán của đơn hàng
        cy.wait(5000)
        let resSumPrice
        checkOut.getTotalOrderPrice().then(($sumPrice) => {
            resSumPrice = checkOut.convertToNumber($sumPrice)
            cy.log(resSumPrice)
        })

        //Thêm địa chỉ mới
        let nAddress
        checkOut.getBtnAddress()
        checkOut.getListAddressBook().children().then(($el) => {
            nAddress = Number($el.length)
        })

        checkOut.addNewAddress()

        cy.get('.checkbox-col').then(($checkb) => {
            expect($checkb, 'Checkbox chọn làm địa chỉ mặc định').to.exist
        })

        //tạo địa chỉ mới
        checkOut.fillCustomerName('QC_test')
        checkOut.fillCustomerPhone('0353260584')

        checkOut.selectCity()

        checkOut.selectDistrict()

        checkOut.selectWard()

        checkOut.fillNewDetailAddress('abc')

        checkOut.createInfo()
        cy.wait(3000)
        checkOut.getListAddressBook().children().then(($el) => {
            let nAddressN = Number($el.length)
            expect(nAddressN, 'Tạo địa chỉ thành công').to.equal(nAddress + 1)
        })
    })

    it('Thêm địa chỉ người nhận hàng khác người đặt hàng', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()
        let login = new LoginPage()

        //login
        cy.get('.login-btn').click()
        cy.url().should('include', 'dang-nhap')
        login.fillEmail(this.data.email)
        login.fillPass(this.data.password)

        login.submit()
        cy.wait(3000)
        cy.closePopup()

        var itemQuantity
        addToCard.getCardQuantity().then(($el) => {
            itemQuantity = Number($el.text())
        })

        //search product in store
        home.searchInStore(keyword)

       //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
        addToCard.getPricedProduct().then(($el) => {
           const title = addToCard.findCardTitle($el);

           addToCard.addToCard($el)
           cy.wait(3000)

           //thêm một sản phẩm thành công vào giỏ hàng
           addToCard.getCardQuantity().should('have.text', itemQuantity + 1)

           //redirect tới trang giỏ hàng
           addToCard.goToCardPage()

           cy.url().should('include', '/gio-hang-cua-ban')

           //check tên sản phẩm
           addToCard.getProductName().then(($name) => {
               const name = $name.text().trim();
               expect(name).to.equal(title)
           })
       })

        //get địa chỉ trong sổ địa chỉ
        var username, phoneNumber, address
        cy.visit('https://fado.vn/so-dia-chi')
        cy.url().should('include', 'so-dia-chi')

        checkOut.getAddressBookType().each(($el, index, $list) => {
            let text = $el.text().trim()
            if (text === 'Mặc định') {
                checkOut.getAddressBookItem($el).then(($pr) => {
                    checkOut.getUserNameAddress($pr).then(($userName) => {
                        username = $userName.text().trim();
                    })
                    checkOut.getPhoneAddress($pr).then(($phone) => {
                        phoneNumber = $phone.text().trim();
                    })
                    checkOut.getDetailAddress($pr).then(($address) => {
                        address = $address.text().trim();
                    })
                })
            }
        })

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        //tổng giá trị sản phẩm trong giỏ hàng
        let sumPrice = 0
        addToCard.getTotalPriceAProduct().each(($el, index, $list) => {
            sumPrice = checkOut.convertToNumber($el) + sumPrice
        })
        //check tổng giá trị sản phẩm trong giỏ hàng
        addToCard.getTotalValueOrder().then(($price) => {
            let resCPrice = checkOut.convertToNumber($price)
            expect(resCPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })
        // Chuyển tới trang thanh toán từ giỏ hàng
        addToCard.order()
        //check giá sản phẩm
        checkOut.getTotalProductPrice().then(($dPrice) => {
            let resDPrice = checkOut.convertToNumber($dPrice)
            expect(resDPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })
        //Check địa chỉ
        checkOut.getBtnLabelAddress().should('have.text', 'Sổ địa chỉ')
        checkOut.getOrdererName().then(($el) => {
            let urs = $el.text().trim()
            expect(urs, 'Username').to.equal(username)
        })
        checkOut.getOrdererPhone().then(($el) => {
            let phone = $el.text().trim()
            expect(phone, 'Số điện thoại').to.equal(phoneNumber)
        })
        checkOut.getOrdererAddress().then(($el) => {
            let adr = $el.text().trim()
            expect(address, 'Địa chỉ').to.contain(adr)
        })
        checkOut.getOrdererDetailAddress().then(($el) => {
            let ad = $el.text().trim()
            let resad = ad.split(" ")
            expect(address, 'Địa chỉ chính xác').to.contain(resad[1])
        })
        // get tổng số tiền cần thanh toán của đơn hàng
        cy.wait(5000)
        let resSumPrice
        checkOut.getTotalOrderPrice().then(($sumPrice) => {
            resSumPrice = checkOut.convertToNumber($sumPrice)
            cy.log(resSumPrice)
        })

        //Thêm địa chỉ người nhận hàng
        checkOut.addAddressReceiver()
        checkOut.getBtnAddressBook().then(($el) => {
            expect($el, 'Hiển thị button "Sổ địa chỉ"').to.exist
            cy.get($el).click()

            cy.wait(5000)
            checkOut.getFirstAddress()
            
            cy.get('.field-label > .label-link').then(($el) => {
                expect($el, 'Lời nhắn đến người nhận').to.exist
            })
        })

        //Thanh toán đơn hàng
        checkOut.getBtnOrder().should('have.class', 'is-active')
        checkOut.getBtnOrder().click()

        //đồng ý điều khoản 
        checkOut.acceptRule()

        //check lại thông tin sau khi đặt hàng thành công
        checkOut.getMessOrderSuccess().then(($dh) => {
            let dh = $dh.text().trim()
            expect(dh).to.equal('Quý khách đã tạo đơn hàng thành công')
        })
        checkOut.getPriceAfterOrder().then(($price) => {
            const resPrice = checkOut.convertToNumber($price)
            const price = Math.abs(resPrice - resSumPrice)
            expect(price, 'Kiểm tra tổng tiền đơn hàng').to.be.lessThan(3000)
        })

        //HỦY ĐƠN HÀNG
        cancelOrder()
    })

    it('Thanh toán đơn hàng qua viettel pay', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()
        let login = new LoginPage()

        //login
        cy.get('.login-btn').click()
        cy.url().should('include', 'dang-nhap')
        login.fillEmail(this.data.email)
        login.fillPass(this.data.password)

        login.submit()
        cy.wait(3000)
        cy.closePopup()

        //get quantity product in card
        var itemQuantity
        addToCard.getCardQuantity().then(($el) => {
            itemQuantity = Number($el.text())
        })

        //search product in store
        home.searchInStore(keyword)

       //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
        addToCard.getPricedProduct().then(($el) => {
           const title = addToCard.findCardTitle($el);

           addToCard.addToCard($el)
           cy.wait(3000)

           //thêm một sản phẩm thành công vào giỏ hàng
           addToCard.getCardQuantity().should('have.text',itemQuantity + 1)

           //redirect tới trang giỏ hàng
           addToCard.goToCardPage()

           cy.url().should('include', '/gio-hang-cua-ban')

           //check tên sản phẩm
           addToCard.getProductName().then(($name) => {
               const name = $name.text().trim();
               expect(name).to.equal(title)
           })
       })

        //get địa chỉ trong sổ địa chỉ
        var username, phoneNumber, address
        cy.visit('https://fado.vn/so-dia-chi')
        cy.url().should('include', 'so-dia-chi')

        checkOut.getAddressBookType().each(($el, index, $list) => {
            let text = $el.text().trim()
            if (text === 'Mặc định') {
                checkOut.getAddressBookItem($el).then(($pr) => {
                    checkOut.getUserNameAddress($pr).then(($userName) => {
                        username = $userName.text().trim();
                    })
                    checkOut.getPhoneAddress($pr).then(($phone) => {
                        phoneNumber = $phone.text().trim();
                    })
                    checkOut.getDetailAddress($pr).then(($address) => {
                        address = $address.text().trim();
                    })
                })
            }
        })

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        //tổng giá trị sản phẩm trong giỏ hàng
        let sumPrice = 0
        addToCard.getTotalPriceAProduct().each(($el, index, $list) => {
            sumPrice = checkOut.convertToNumber($el) + sumPrice
        })
        //check tổng giá trị sản phẩm trong giỏ hàng
        addToCard.getTotalValueOrder().then(($price) => {
            let resCPrice = checkOut.convertToNumber($price)
            expect(resCPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })
        // Chuyển tới trang thanh toán từ giỏ hàng
        addToCard.order()
        //check giá sản phẩm
        checkOut.getTotalProductPrice().then(($dPrice) => {
            let resDPrice = checkOut.convertToNumber($dPrice)
            expect(resDPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })
        //Check địa chỉ
        checkOut.getBtnLabelAddress().should('have.text', 'Sổ địa chỉ')
        checkOut.getOrdererName().then(($el) => {
            let urs = $el.text().trim()
            expect(urs, 'Username').to.equal(username)
        })
        checkOut.getOrdererPhone().then(($el) => {
            let phone = $el.text().trim()
            expect(phone, 'Số điện thoại').to.equal(phoneNumber)
        })
        checkOut.getOrdererAddress().then(($el) => {
            let adr = $el.text().trim()
            expect(address, 'Địa chỉ').to.contain(adr)
        })
        checkOut.getOrdererDetailAddress().then(($el) => {
            let ad = $el.text().trim()
            let resad = ad.split(" ")
            expect(address, 'Địa chỉ chính xác').to.contain(resad[1])
        })
        // get tổng số tiền cần thanh toán của đơn hàng
        cy.wait(3000)
        let resSumPrice
        checkOut.getTotalOrderPrice().then(($sumPrice) => {
            resSumPrice = checkOut.convertToNumber($sumPrice)
            cy.log(resSumPrice)
        })

        // thanh toán đơn hàng qua ViettelPay
        cy.get('.payment-method-group-col > .mz-grid > :nth-child(1)').click()

        //Thanh toán đơn hàng
        checkOut.getBtnOrder().should('have.class', 'is-active')
        checkOut.getBtnOrder().click()

        //đồng ý điều khoản 
        checkOut.acceptRule()

        //redirect to page history order 
        cy.visit('https://fado.vn/lich-su-don-hang')
        
        //check lại order sau khi đặt hàng thành công
        checkOut.checkHistoryOrder()

        checkOut.getMethodCheckOutText().should((txt) =>{
            expect(txt.trim()).to.eq('Viettel Pay')
        })

        cy.url().should('include', 'chi-tiet-don-hang')
 
         checkOut.clickBtnCancelOrder()
 
         // show modal hủy đơn hàng khi click btn 'Hủy đơn hàng'
         checkOut.getCancelOrderModal().should('have.class', 'show')

         //select lý do hủy đơn hàng
         checkOut.selectReasonCancel()
 
         //xác nhận hủy đơn hàng
         checkOut.cancelOrder()
 
         //xacs nhận đơn hàng đã được hủy
         checkOut.getOrderStatusText().should('contain', 'Đã hủy')
    })

    it('Thanh toán đơn hàng qua zalo pay', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()
        let login = new LoginPage()

        //login
        cy.get('.login-btn').click()
        cy.url().should('include', 'dang-nhap')
        login.fillEmail(this.data.email)
        login.fillPass(this.data.password)

        login.submit()
        cy.wait(3000)
        cy.closePopup()

        //get quantity product in card
        var itemQuantity
        addToCard.getCardQuantity().then(($el) => {
            itemQuantity = Number($el.text())
        })

        //search product in store
        home.searchInStore(keyword)

       //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
        addToCard.getPricedProduct().then(($el) => {
           const title = addToCard.findCardTitle($el);

           addToCard.addToCard($el)
           cy.wait(3000)

           //thêm một sản phẩm thành công vào giỏ hàng
           addToCard.getCardQuantity().should('have.text',itemQuantity + 1)

           //redirect tới trang giỏ hàng
           addToCard.goToCardPage()

           cy.url().should('include', '/gio-hang-cua-ban')

           //check tên sản phẩm
           addToCard.getProductName().then(($name) => {
               const name = $name.text().trim();
               expect(name).to.equal(title)
           })
       })

        //get địa chỉ trong sổ địa chỉ
        var username, phoneNumber, address
        cy.visit('https://fado.vn/so-dia-chi')
        cy.url().should('include', 'so-dia-chi')

        checkOut.getAddressBookType().each(($el, index, $list) => {
            let text = $el.text().trim()
            if (text === 'Mặc định') {
                checkOut.getAddressBookItem($el).then(($pr) => {
                    checkOut.getUserNameAddress($pr).then(($userName) => {
                        username = $userName.text().trim();
                    })
                    checkOut.getPhoneAddress($pr).then(($phone) => {
                        phoneNumber = $phone.text().trim();
                    })
                    checkOut.getDetailAddress($pr).then(($address) => {
                        address = $address.text().trim();
                    })
                })
            }
        })

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        //tổng giá trị sản phẩm trong giỏ hàng
        let sumPrice = 0
        addToCard.getTotalPriceAProduct().each(($el, index, $list) => {
            sumPrice = checkOut.convertToNumber($el) + sumPrice
        })
        //check tổng giá trị sản phẩm trong giỏ hàng
        addToCard.getTotalValueOrder().then(($price) => {
            let resCPrice = checkOut.convertToNumber($price)
            expect(resCPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })
        // Chuyển tới trang thanh toán từ giỏ hàng
        addToCard.order()
        //check giá sản phẩm
        checkOut.getTotalProductPrice().then(($dPrice) => {
            let resDPrice = checkOut.convertToNumber($dPrice)
            expect(resDPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })
        //Check địa chỉ
        checkOut.getBtnLabelAddress().should('have.text', 'Sổ địa chỉ')
        checkOut.getOrdererName().then(($el) => {
            let urs = $el.text().trim()
            expect(urs, 'Username').to.equal(username)
        })
        checkOut.getOrdererPhone().then(($el) => {
            let phone = $el.text().trim()
            expect(phone, 'Số điện thoại').to.equal(phoneNumber)
        })
        checkOut.getOrdererAddress().then(($el) => {
            let adr = $el.text().trim()
            expect(address, 'Địa chỉ').to.contain(adr)
        })
        checkOut.getOrdererDetailAddress().then(($el) => {
            let ad = $el.text().trim()
            let resad = ad.split(" ")
            expect(address, 'Địa chỉ chính xác').to.contain(resad[1])
        })
        // get tổng số tiền cần thanh toán của đơn hàng
        cy.wait(5000)
        let resSumPrice
        checkOut.getTotalOrderPrice().then(($sumPrice) => {
            resSumPrice = checkOut.convertToNumber($sumPrice)
            cy.log(resSumPrice)
        })

        // thanh toán đơn hàng qua ZaloPay
        checkOut.checkOutByZalo()

        //Thanh toán đơn hàng
        checkOut.getBtnOrder().should('have.class', 'is-active')
        checkOut.getBtnOrder().click()

        //đồng ý điều khoản 
        checkOut.acceptRule()
        
        //redirect to page history order 
        cy.visit('https://fado.vn/lich-su-don-hang')
        
        //check lại order sau khi đặt hàng thành công
        checkOut.checkHistoryOrder()

        checkOut.getMethodCheckOutText().should((txt) =>{
            expect(txt.trim()).to.eq('Thanh toán qua ứng dụng ZaloPay')
        })

        cy.url().should('include', 'chi-tiet-don-hang')
 
         checkOut.clickBtnCancelOrder()
 
         // show modal hủy đơn hàng khi click btn 'Hủy đơn hàng'
         checkOut.getCancelOrderModal().should('have.class', 'show')

         //select lý do hủy đơn hàng
         checkOut.selectReasonCancel()
 
         //xác nhận hủy đơn hàng
         checkOut.cancelOrder()
 
         //xác nhận đơn hàng đã được hủy
         checkOut.getOrderStatusText().should('contain', 'Đã hủy')

    })

    // login tài khoản chưa có sổ địa chỉ trc khi thanh toán
    it('Login tài khoản chưa có sổ địa chỉ trước khi thanh toán', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let addToCard = new AddToCard()
        let login = new LoginPage()

        //login
        cy.get('.login-btn').click()
        cy.url().should('include', 'dang-nhap')
        login.fillEmail("test3@yopmail.com")
        login.fillPass(this.data.password)

        login.submit()
        cy.wait(3000)
        cy.closePopup()

        //get quantity product in card
        var itemQuantity
        addToCard.getCardQuantity().then(($el) => {
            itemQuantity = Number($el.text())
        })

        //search product in store
        home.searchInStore(keyword)

        //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
        let title
        addToCard.getPricedProduct().then(($el) => {
            title = addToCard.findCardTitle($el);

            addToCard.addToCard($el)
            cy.wait(3000)

            //thêm một sản phẩm thành công vào giỏ hàng
            addToCard.getCardQuantity().should('have.text', itemQuantity + 1)

            //redirect tới trang giỏ hàng
            addToCard.goToCardPage()

            cy.url().should('include', '/gio-hang-cua-ban')

        })

        //check tên sản phẩm
        let productName = []
        addToCard.getProductName().each(($el) => {
            productName.push($el.text().trim())
            expect(productName).to.include(title)
        })

        //redirect tới trang giỏ hàng
        addToCard.goToCardPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        let sumPrice = 0
        addToCard.getTotalPriceAProduct().each(($el, index, $list) => {
            sumPrice = checkOut.convertToNumber($el) + sumPrice
        })

        //tổng tiền các sản phẩm trong giỏ hàng
        addToCard.getTotalValueOrder().then(($price) => {
            let resCPrice = checkOut.convertToNumber($price)
            expect(resCPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })
        // chuyển sang trang thanh toán
        addToCard.order()
        // Tổng tiền sản phẩm
        checkOut.getTotalProductPrice().then(($dPrice) => {
            let resDPrice = checkOut.convertToNumber($dPrice)
            expect(resDPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })

        checkOut.getLabelBtnCreateInfo().then(($crtInfo) => {
            let crtInfo = $crtInfo.text().trim()
            expect(crtInfo).to.equal('Tạo thông tin đặt hàng')
        })
        checkOut.getBtnOrder().should('not.have.class', 'is-active')
    })
})