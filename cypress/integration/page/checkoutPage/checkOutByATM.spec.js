/// <reference types="Cypress" />
import AddToCard from '../../pageObjects/addToCard'
import CheckOut from '../../pageObjects/checkOut'
import HomePage from '../../pageObjects/homePage'
import LoginPage from '../../pageObjects/loginPage'

describe('CHECK OUT BY INLAND ATM CARD', () => {
    let keyword = 'thuốc';

    const checkOutByATMCard = ($bank) => {
        const login = new LoginPage()
        const checkOut = new CheckOut()
        const addToCard = new AddToCard()
        const home = new HomePage()
        //login
        cy.get('.login-btn').click()
        cy.wait(1000)
        cy.url().should('include', 'dang-nhap')
        login.fillEmail('trinh1@yopmail.com')
        login.fillPass('123456789')

        login.submit()

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
        })

        // thanh toán đơn hàng qua VNPAY
        checkOut.checkOutByATM()

        checkOut.getPaymentGatewayVNPay().should('have.class', 'is-active')

        checkOut.selectBank($bank)

        //Thanh toán đơn hàng
        checkOut.getBtnOrder().should('have.class', 'is-active')

        //đồng ý điều khoản
        checkOut.acceptRule()

        //redirect to page history order 
        cy.visit('https://fado.vn/lich-su-don-hang')

        //check lại order sau khi đặt hàng thành công
        checkOut.checkHistoryOrder()

        checkOut.getMethodCheckOutText().should((txt) =>{
            expect(txt.trim()).to.eq('Thanh toán trực tuyến qua Vnpay')
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
    }

    beforeEach(function () {
        cy.fixture('userInfo').then((data) => {
            this.data = data
        })

        cy.visitHomePage()

        cy.closePopup()

    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là An Bình', function () {
        checkOutByATMCard('An Bình')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là ACB', function () {
        checkOutByATMCard('ACB')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là Agribank', function () {
        checkOutByATMCard('Agribank')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là Bắc Á', function () {
        checkOutByATMCard('Bắc Á')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là BIDV', function () {
        checkOutByATMCard('BIDV')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là Đông Á', function () {
        checkOutByATMCard('Đông Á')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là Eximbank', function () {
        checkOutByATMCard('Eximbank')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là HDBank', function () {
        checkOutByATMCard('HDBank')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là INDOVINA', function () {
        checkOutByATMCard('INDOVINA')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là MBBank', function () {
        checkOutByATMCard('MBBank')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là MSBANK', function () {
        checkOutByATMCard('MSBANK')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là Nam Á', function () {
        checkOutByATMCard('Nam Á')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là Quốc dân', function () {
        checkOutByATMCard('Quốc dân')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là OCB', function () {
        checkOutByATMCard('OCB')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là Đại Dương', function () {
        checkOutByATMCard('Đại Dương')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là TMCP Đại Chúng Việt Nam', function () {
        checkOutByATMCard('TMCP Đại Chúng Việt Nam')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là Sacombank', function () {
        checkOutByATMCard('Sacombank')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là SCB', function () {
        checkOutByATMCard('SCB')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là SHB', function () {
        checkOutByATMCard('SHB')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là Techcombank', function () {
        checkOutByATMCard('Techcombank')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là Sài Gòn Công Thương', function () {
        checkOutByATMCard('Sài Gòn Công Thương')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là TPBANK', function () {
        checkOutByATMCard('TPBANK')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là VPBank', function () {
        checkOutByATMCard('VPBank')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là Vietcombank', function () {
        checkOutByATMCard('Vietcombank')
    })

    it('Thanh toán đơn hàng qua thẻ ATM nội địa, qua cổng VNPAY, ngân hàng giao dịch là Vietinbank', function () {
        checkOutByATMCard('Vietinbank')
    })
})