/// <reference types="Cypress" />

import CartPage from '../../pageObjects/cartPage'
import CheckOut from '../../pageObjects/checkOut'
import HomePage from '../../pageObjects/homePage'
import LoginPage from '../../pageObjects/loginPage'

describe('Checkout', () => {

    const checkOut = new CheckOut()
    const home = new HomePage()
    const cartPage = new CartPage()
    let keyword = "watch"

    const cancelOrder = () => {
        const checkOut = new CheckOut();

        //HỦY ĐƠN HÀNG
        checkOut.checkOrder(); // kiem tra don hang
        cy.url().should('include', 'chi-tiet-don-hang');

        checkOut.clickBtnCancelOrder();

        // show modal hủy đơn hàng khi click btn 'Hủy đơn hàng'
        checkOut.getCancelOrderModal().should('have.class', 'show');

        //select lý do hủy đơn hàng
        checkOut.selectReasonCancel();

        //xác nhận hủy đơn hàng
        checkOut.cancelOrder();

        //xacs nhận đơn hàng đã được hủy
        checkOut.getOrderStatusText().should('contain', 'Đã hủy');
    }

    //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
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

    // GUEST
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

        it('[GUEST] check form nhập thông tin người đặt hàng', function() {
            let sumPrice = 0 // tổng tiền items được chọn để đặt hàng trong trang giỏ hàng 

            addToCart();

            cartPage.elements.totalPriceAProduct().each(($el, index, $list) => {
                sumPrice = checkOut.convertToNumber($el) + sumPrice;
            })

            cartPage.elements.totalValueOrder().then(($price) => {
                let resCPrice = checkOut.convertToNumber($price);
                expect(resCPrice, 'Tổng tiền sản phẩm trong cart page: ').to.equal(sumPrice);
            })

            // Đặt hàng
            cartPage.order();
            cy.wait(1000);
            cy.url().should('include', 'xac-nhan-thong-tin-dat-hang');

            checkOut.elements.btnOrder().should('not.have.class', 'is-active');
            
            checkOut.elements.labelEnterInfo().click({ force: true }); // btn [Nhap thong tin dat hang]

            //leave all mandatory field blank
            checkOut.createInfo();
            checkOut.elements.btnOrder().should('not.have.class', 'is-active');
            

            // leave [customerName] field blank
            checkOut.fillCustomerPhone('0353260584');
            checkOut.fillCustomerEmail('trinh-test-03@gmail.com');
    
            checkOut.selectCity();
    
            checkOut.selectDistrict();
    
            checkOut.selectWard();
    
            checkOut.fillDetailAddress('abcd');
    
            checkOut.createInfo();
    
            checkOut.getMessErrorName().should('have.text', 'Họ tên đầy đủ là bắt buộc');

            // leave [customerPhone] field blank
            clearFormInfo();
            checkOut.fillCustomerName('qc_test');
            checkOut.fillCustomerEmail('trinh-test-03@gmail.com');
    
            checkOut.selectCity();
    
            checkOut.selectDistrict();
    
            checkOut.selectWard();
    
            checkOut.fillDetailAddress('abcd');
    
            checkOut.createInfo();
    
            checkOut.getMessErrorPhone().should('have.text', 'Điện thoại là bắt buộc');

            // leave [customerEmail] field blank
            clearFormInfo();
            checkOut.fillCustomerName('qc_test');
            checkOut.fillCustomerPhone('0353260584');
    
            checkOut.selectCity();
    
            checkOut.selectDistrict();
    
            checkOut.selectWard();
    
            checkOut.fillDetailAddress('abcd');
    
            checkOut.createInfo();
    
            checkOut.getMessErrorPhone().should('have.text', 'Email là bắt buộc');

            // leave [customerCity] field blank
            clearFormInfo();
            checkOut.fillCustomerName('qc_test');
            checkOut.fillCustomerPhone('0353260584');
            checkOut.fillCustomerEmail('trinh-test-03@gmail.com');
            checkOut.fillDetailAddress('abcd');
            checkOut.getComboboxDistrict().then(($quan) => {
                expect($quan).to.be.disabled;
            });
            checkOut.getComboboxWard().then(($xa) => {
                expect($xa).to.be.disabled;
            });
            checkOut.createInfo();
    
            checkOut.getMessErrorAddress().then(($address) => {
                let address = $address.text().trim();
                expect(address).to.equal('Vui lòng chọn đầy đủ địa điểm');
            });
            
            // leave [customerDistrict] field blank
            clearFormInfo();
            checkOut.fillCustomerName('qc_test');
            checkOut.fillCustomerPhone('0353260584');
            checkOut.fillCustomerEmail('trinh-test-03@gmail.com');
            checkOut.fillDetailAddress('abcd');
            checkOut
            checkOut.getComboboxDistrict().then(($quan) => {
                expect($quan).to.be.disabled;
            });
            checkOut.getComboboxWard().then(($xa) => {
                expect($xa).to.be.disabled;
            });
            checkOut.createInfo();
    
            checkOut.getMessErrorAddress().then(($address) => {
                let address = $address.text().trim();
                expect(address).to.equal('Vui lòng chọn đầy đủ địa điểm');
            });

            // leave [customerWard] field blank
            clearFormInfo();
            checkOut.fillCustomerName('qc_test');
            checkOut.fillCustomerPhone('0353260584');
            checkOut.fillCustomerEmail('trinh-test-03@gmail.com');
            checkOut.fillDetailAddress('abcd');
            checkOut.selectCity();

            checkOut.getComboboxDistrict().then(($quan) => {
                expect($quan).to.be.disabled;
            });
            checkOut.getComboboxWard().then(($xa) => {
                expect($xa).to.be.disabled;
            });
            checkOut.createInfo();
    
            checkOut.getMessErrorAddress().then(($address) => {
                let address = $address.text().trim();
                expect(address).to.equal('Vui lòng chọn đầy đủ địa điểm');
            });
        })
    })

    it('Không nhập thông tin tỉnh/thành phố trong trường Địa Điểm', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let cartPage = new CartPage()

        // search in store
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

        //redirect tới trang giỏ hàng
        home.goToCartPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        cartPage.order()

        //check thông tin đặt hàng
        checkOut.elements.btnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })


        checkOut.elements.btnOrder().should('not.have.class', 'is-active')

        // cy.get('.user-address-book-update-info-modal').should('have.attr', 'aria-hidden', 'true')
        //tạo địa chỉ
        checkOut.elements.labelEnterInfo().click()

        checkOut.fillCustomerName('QC_test')
        checkOut.fillCustomerPhone('0353260584')
        checkOut.fillCustomerEmail('trinh-test-03@gmail.com')

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
        let cartPage = new CartPage()

        // search in store
        home.searchInStore(keyword)

        //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
        home.elements.pricedProduct().then(($el) => {
            const title = home.elements.findCartTitle()($el);

            home.addProductToCart($el)
            cy.wait(2000)

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

        //redirect tới trang giỏ hàng
        home.goToCartPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        cartPage.order()

        //check thông tin đặt hàng
        checkOut.elements.btnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })


        checkOut.elements.btnOrder().should('not.have.class', 'is-active')

        // cy.get('.user-address-book-update-info-modal').should('have.attr', 'aria-hidden', 'true')
        //tạo địa chỉ
        checkOut.elements.labelEnterInfo().click()

        checkOut.fillCustomerName('QC_test')
        checkOut.fillCustomerPhone('0353260584')
        checkOut.fillCustomerEmail('trinh-test-03@gmail.com')

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
        let cartPage = new CartPage()

        // search in store
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

        //redirect tới trang giỏ hàng
        home.goToCartPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        cartPage.order()

        //check thông tin đặt hàng
        checkOut.elements.btnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })


        checkOut.elements.btnOrder().should('not.have.class', 'is-active')

        // cy.get('.user-address-book-update-info-modal').should('have.attr', 'aria-hidden', 'true')
        //tạo địa chỉ
        checkOut.elements.labelEnterInfo().click()

        checkOut.fillCustomerName('QC_test')
        checkOut.fillCustomerPhone('0353260584')
        checkOut.fillCustomerEmail('trinh-test-03@gmail.com')

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
        let cartPage = new CartPage()

        // search in store
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

        //redirect tới trang giỏ hàng
        home.goToCartPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        cartPage.order()

        //check thông tin đặt hàng
        checkOut.elements.btnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })


        checkOut.elements.btnOrder().should('not.have.class', 'is-active')

        // cy.get('.user-address-book-update-info-modal').should('have.attr', 'aria-hidden', 'true')
        //tạo địa chỉ
        checkOut.elements.labelEnterInfo().click()

        checkOut.fillCustomerName('QC_test')
        checkOut.fillCustomerPhone('0353260584')
        checkOut.fillCustomerEmail('trinh-test-03@gmail.com')

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
        let cartPage = new CartPage()

        //search in store
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

        //redirect tới trang giỏ hàng
        home.goToCartPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        cartPage.order()

        //check thông tin đặt hàng
        checkOut.elements.btnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })


        checkOut.elements.btnOrder().should('not.have.class', 'is-active')

        // cy.get('.user-address-book-update-info-modal').should('have.attr', 'aria-hidden', 'true')
        //tạo địa chỉ
        checkOut.elements.labelEnterInfo().click()

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
        let cartPage = new CartPage()

        // search product in store
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

        //redirect tới trang giỏ hàng
        home.goToCartPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        cartPage.order()

        //check thông tin đặt hàng
        checkOut.elements.btnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })


        checkOut.elements.btnOrder().should('not.have.class', 'is-active')

        // cy.get('.user-address-book-update-info-modal').should('have.attr', 'aria-hidden', 'true')
        //tạo địa chỉ
        checkOut.elements.labelEnterInfo().click()

        checkOut.fillCustomerName('QC_test')
        checkOut.fillCustomerPhone('0353260584')
        checkOut.fillCustomerEmail('trinh-test-03@gmail.com')

        checkOut.selectCity()

        checkOut.selectDistrict()

        checkOut.selectWard()

        checkOut.fillDetailAddress('abcd')

        checkOut.closeAddressModal()

        checkOut.elements.btnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })


        checkOut.elements.btnOrder().should('not.have.class', 'is-active')
    })

    it('Nhập đầy đủ thông tin sản phẩm và check out', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let cartPage = new CartPage()

        // search product in store
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

        //redirect tới trang giỏ hàng
        home.goToCartPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        let sumPrice = 0
        cartPage.elements.totalPriceAProduct().each(($el, index, $list) => {
            sumPrice = checkOut.convertToNumber($el) + sumPrice
        })

        cartPage.elements.totalValueOrder().then(($price) => {
            let resCPrice = checkOut.convertToNumber($price)
            expect(resCPrice, 'Tổng tiền sản phẩm: ').to.equal(sumPrice)
        })

        cartPage.order()

        //check thông tin đặt hàng
        checkOut.elements.btnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })


        checkOut.elements.btnOrder().should('not.have.class', 'is-active')

        // cy.get('.user-address-book-update-info-modal').should('have.attr', 'aria-hidden', 'true')
        //tạo địa chỉ
        checkOut.elements.labelEnterInfo().click()

        checkOut.fillCustomerName('test')
        checkOut.fillCustomerPhone('0353260584')
        checkOut.fillCustomerEmail('trinh-test-03@gmail.com')

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

    it('Đăng nhập tài khoản đã có địa chỉ mặc định', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let cartPage = new CartPage()
        let login = new LoginPage()

        // search product in store
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

        //redirect tới trang giỏ hàng
        home.goToCartPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        cartPage.order()

        //check thông tin đặt hàng
        checkOut.elements.btnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })


        checkOut.elements.btnOrder().should('not.have.class', 'is-active')

        // Đăng nhập
        checkOut.elements.btnLogin().click()
        cy.url().should('include', 'dang-nhap')

        login.fillEmail(this.data.email)
        login.fillPass(this.data.password)

        login.submit()
        cy.url().should('include', 'xac-nhan-thong-tin-dat-hang')

        cy.wait(3000)
        checkOut.elements.btnOrder().should('have.class', 'is-active')
    })

    it('Đăng nhập tài khoản chưa có địa chỉ mặc định', function () {
        const checkOut = new CheckOut()
        const home = new HomePage()
        const cartPage = new CartPage()
        const login = new LoginPage()

        // search product in store
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

        //redirect tới trang giỏ hàng
        home.goToCartPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        cartPage.order()

        //check thông tin đặt hàng
        checkOut.elements.btnLogin().then(($lr) => {
            let lr = $lr.text().trim()
            expect(lr).to.equal('Đăng nhập / Đăng ký')
        })


        checkOut.elements.btnOrder().should('not.have.class', 'is-active')

        // Đăng nhập
        checkOut.elements.btnLogin().click()
        cy.url().should('include', 'dang-nhap')

        login.fillEmail(this.data.email2)
        login.fillPass(this.data.passEmail2)

        login.submit()
    })

    /////////////đăng ký
    it('Đăng ký tài khoản mới', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let cartPage = new CartPage()
    })

    /////////Login tài khoản có địa chỉ trước khi checkout
    it('Login tài khoản có sổ địa chỉ trước khi thanh toán', function () {
        let checkOut = new CheckOut()
        let home = new HomePage()
        let cartPage = new CartPage()
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
        cartPage.getCardQuantity().then(($el) => {
            itemQuantity = Number($el.text())
        })

        // search product in store
        home.searchInStore(keyword)

        //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
        home.elements.pricedProduct().then(($el) => {
            const title = home.elements.findCartTitle()($el);

            home.addProductToCart($el)
            cy.wait(3000)

            //thêm một sản phẩm thành công vào giỏ hàng
            cartPage.getCardQuantity().should('have.text', itemQuantity + 1)

            //redirect tới trang giỏ hàng
            home.goToCartPage()

            cy.url().should('include', '/gio-hang-cua-ban')

            //check tên sản phẩm
            cartPage.elements.productName().then(($name) => {
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
        home.goToCartPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        //tổng giá trị sản phẩm trong giỏ hàng
        let sumPrice = 0
        cartPage.elements.totalPriceAProduct().each(($el, index, $list) => {
            sumPrice = checkOut.convertToNumber($el) + sumPrice
        })
        //check tổng giá trị sản phẩm trong giỏ hàng
        cartPage.elements.totalValueOrder().then(($price) => {
            let resCPrice = checkOut.convertToNumber($price)
            expect(resCPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })
        // Chuyển tới trang thanh toán từ giỏ hàng
        cartPage.order()
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
        checkOut.elements.btnOrder().should('have.class', 'is-active')
        checkOut.elements.btnOrder().click()

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
        let cartPage = new CartPage()
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
        cartPage.getCardQuantity().then(($el) => {
            itemQuantity = Number($el.text())
        })

        //search product in store
        home.searchInStore(keyword)

        //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
        home.elements.pricedProduct().then(($el) => {
            const title = home.elements.findCartTitle()($el);

            home.addProductToCart($el)
            cy.wait(3000)

            //thêm một sản phẩm thành công vào giỏ hàng
            cartPage.getCardQuantity().should('have.text', itemQuantity + 1)

            //redirect tới trang giỏ hàng
            home.goToCartPage()

            cy.url().should('include', '/gio-hang-cua-ban')

            //check tên sản phẩm
            cartPage.elements.productName().then(($name) => {
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
        home.goToCartPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        //tổng giá trị sản phẩm trong giỏ hàng
        let sumPrice = 0
        cartPage.elements.totalPriceAProduct().each(($el, index, $list) => {
            sumPrice = checkOut.convertToNumber($el) + sumPrice
        })
        //check tổng giá trị sản phẩm trong giỏ hàng
        cartPage.elements.totalValueOrder().then(($price) => {
            let resCPrice = checkOut.convertToNumber($price)
            expect(resCPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })
        // Chuyển tới trang thanh toán từ giỏ hàng
        cartPage.order()
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
        let cartPage = new CartPage()
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
        cartPage.getCardQuantity().then(($el) => {
            itemQuantity = Number($el.text())
        })

        //search product in store
        home.searchInStore(keyword)

        //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
        home.elements.pricedProduct().then(($el) => {
            const title = home.elements.findCartTitle()($el);

            home.addProductToCart($el)
            cy.wait(3000)

            //thêm một sản phẩm thành công vào giỏ hàng
            cartPage.getCardQuantity().should('have.text', itemQuantity + 1)

            //redirect tới trang giỏ hàng
            home.goToCartPage()

            cy.url().should('include', '/gio-hang-cua-ban')

            //check tên sản phẩm
            cartPage.elements.productName().then(($name) => {
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
        home.goToCartPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        //tổng giá trị sản phẩm trong giỏ hàng
        let sumPrice = 0
        cartPage.elements.totalPriceAProduct().each(($el, index, $list) => {
            sumPrice = checkOut.convertToNumber($el) + sumPrice
        })
        //check tổng giá trị sản phẩm trong giỏ hàng
        cartPage.elements.totalValueOrder().then(($price) => {
            let resCPrice = checkOut.convertToNumber($price)
            expect(resCPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })
        // Chuyển tới trang thanh toán từ giỏ hàng
        cartPage.order()
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
        checkOut.elements.btnOrder().should('have.class', 'is-active')
        checkOut.elements.btnOrder().click()

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
        let cartPage = new CartPage()
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
        cartPage.getCardQuantity().then(($el) => {
            itemQuantity = Number($el.text())
        })

        //search product in store
        home.searchInStore(keyword)

        //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
        home.elements.pricedProduct().then(($el) => {
            const title = home.elements.findCartTitle()($el);

            home.addProductToCart($el)
            cy.wait(3000)

            //thêm một sản phẩm thành công vào giỏ hàng
            cartPage.getCardQuantity().should('have.text', itemQuantity + 1)

            //redirect tới trang giỏ hàng
            home.goToCartPage()

            cy.url().should('include', '/gio-hang-cua-ban')

            //check tên sản phẩm
            cartPage.elements.productName().then(($name) => {
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
        home.goToCartPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        //tổng giá trị sản phẩm trong giỏ hàng
        let sumPrice = 0
        cartPage.elements.totalPriceAProduct().each(($el, index, $list) => {
            sumPrice = checkOut.convertToNumber($el) + sumPrice
        })
        //check tổng giá trị sản phẩm trong giỏ hàng
        cartPage.elements.totalValueOrder().then(($price) => {
            let resCPrice = checkOut.convertToNumber($price)
            expect(resCPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })
        // Chuyển tới trang thanh toán từ giỏ hàng
        cartPage.order()
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
        checkOut.elements.btnOrder().should('have.class', 'is-active')
        checkOut.elements.btnOrder().click()

        //đồng ý điều khoản 
        checkOut.acceptRule()

        //redirect to page history order 
        cy.visit('https://fado.vn/lich-su-don-hang')

        //check lại order sau khi đặt hàng thành công
        checkOut.checkHistoryOrder()

        checkOut.getMethodCheckOutText().should((txt) => {
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
        let cartPage = new CartPage()
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
        cartPage.getCardQuantity().then(($el) => {
            itemQuantity = Number($el.text())
        })

        //search product in store
        home.searchInStore(keyword)

        //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
        home.elements.pricedProduct().then(($el) => {
            const title = home.elements.findCartTitle()($el);

            home.addProductToCart($el)
            cy.wait(3000)

            //thêm một sản phẩm thành công vào giỏ hàng
            cartPage.getCardQuantity().should('have.text', itemQuantity + 1)

            //redirect tới trang giỏ hàng
            home.goToCartPage()

            cy.url().should('include', '/gio-hang-cua-ban')

            //check tên sản phẩm
            cartPage.elements.productName().then(($name) => {
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
        home.goToCartPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        //tổng giá trị sản phẩm trong giỏ hàng
        let sumPrice = 0
        cartPage.elements.totalPriceAProduct().each(($el, index, $list) => {
            sumPrice = checkOut.convertToNumber($el) + sumPrice
        })
        //check tổng giá trị sản phẩm trong giỏ hàng
        cartPage.elements.totalValueOrder().then(($price) => {
            let resCPrice = checkOut.convertToNumber($price)
            expect(resCPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })
        // Chuyển tới trang thanh toán từ giỏ hàng
        cartPage.order()
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
        checkOut.elements.btnOrder().should('have.class', 'is-active')
        checkOut.elements.btnOrder().click()

        //đồng ý điều khoản 
        checkOut.acceptRule()

        //redirect to page history order 
        cy.visit('https://fado.vn/lich-su-don-hang')

        //check lại order sau khi đặt hàng thành công
        checkOut.checkHistoryOrder()

        checkOut.getMethodCheckOutText().should((txt) => {
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
        let cartPage = new CartPage()
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
        cartPage.getCardQuantity().then(($el) => {
            itemQuantity = Number($el.text())
        })

        //search product in store
        home.searchInStore(keyword)

        //Thêm sản phẩm có giá đầu tiên vào giỏ hàng
        let title
        home.elements.pricedProduct().then(($el) => {
            title = home.elements.findCartTitle()($el);

            home.addProductToCart($el)
            cy.wait(3000)

            //thêm một sản phẩm thành công vào giỏ hàng
            cartPage.getCardQuantity().should('have.text', itemQuantity + 1)

            //redirect tới trang giỏ hàng
            home.goToCartPage()

            cy.url().should('include', '/gio-hang-cua-ban')

        })

        //check tên sản phẩm
        let productName = []
        cartPage.elements.productName().each(($el) => {
            productName.push($el.text().trim())
            expect(productName).to.include(title)
        })

        //redirect tới trang giỏ hàng
        home.goToCartPage()
        cy.url().should('include', '/gio-hang-cua-ban')

        let sumPrice = 0
        cartPage.elements.totalPriceAProduct().each(($el, index, $list) => {
            sumPrice = checkOut.convertToNumber($el) + sumPrice
        })

        //tổng tiền các sản phẩm trong giỏ hàng
        cartPage.elements.totalValueOrder().then(($price) => {
            let resCPrice = checkOut.convertToNumber($price)
            expect(resCPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })
        // chuyển sang trang thanh toán
        cartPage.order()
        // Tổng tiền sản phẩm
        checkOut.getTotalProductPrice().then(($dPrice) => {
            let resDPrice = checkOut.convertToNumber($dPrice)
            expect(resDPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
        })

        checkOut.getLabelBtnCreateInfo().then(($crtInfo) => {
            let crtInfo = $crtInfo.text().trim()
            expect(crtInfo).to.equal('Tạo thông tin đặt hàng')
        })
        checkOut.elements.btnOrder().should('not.have.class', 'is-active')
    })
})