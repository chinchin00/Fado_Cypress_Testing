// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


//eturning false here prevents Cypress from
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

//Đóng popup
Cypress.Commands.add("closePopup", () => {
  cy.get('body').wait(1000).then($body => {
    if ($body.find('.close').length > 0) {
      cy.get('.modal-body > .close').click();
    }
  })
})

//Thanh toán đơn hàng qua thẻ ATM
Cypress.Commands.add("checkOutByATMCart", ($bank) => {

  cy.get('.login-btn').click()
  cy.url().should('include', 'dang-nhap')
  cy.get('#auth-block__form-group__email').type('trinh1@yopmail.com')
  cy.get(':nth-child(2) > .auth-block__form-group__info-col > .my-form-control').type('123456789')

  cy.get('.auth-block__btn-group > .my-btn').click()
  cy.wait(10000)
  cy.closePopup()
  //thêm sản phẩm vào giỏ hàng
  cy.get('.mz-btn-gray').first('.mz-btn-gray').click()

  //get địa chỉ mặc định trong sổ địa chỉ
  cy.get('#user-info__dropdown > .dropdown-head').children().should('have.class', 'user-name-col')
  let username, phoneNumber, address
  cy.visit('https://fado.vn/so-dia-chi')
  cy.url().should('include', 'so-dia-chi')

  cy.get('.address-book-type').each(($el, index, $list) => {
    let text = $el.text().trim()
    if (text === 'Mặc định') {
      cy.get($el).parents('.address-book-item').then(($pr) => {
        cy.get($pr).find('.title-col').then(($us) => {
          username = $us.text().trim()
        })
        cy.get($pr).find('.content-field.customer-phone-field').then(($ph) => {
          phoneNumber = $ph.text().trim()
        })
        cy.get($pr).find('.content-field.address-detail-field').then(($ad) => {
          address = $ad.text().trim()
        })
      })
    }
  })

  //redirect tới trang giỏ hàng
  cy.get('#header-cart-btn').click()
  cy.url().should('include', '/gio-hang-cua-ban')

  //tổng giá trị sản phẩm trong giỏ hàng
  let sumPrice = 0
  cy.get('.total-current-price').each(($el, index, $list) => {
    let price = $el.text().trim()
    let resPrice = price.split(" ")
    sumPrice = Number(resPrice[0].replace(/[^\d]/g, '')) + sumPrice
  })
  //check tổng giá trị sản phẩm trong giỏ hàng
  cy.get('.section-static-inner > .cart-summary-block > .price-col > .total-price-field > .value > .price').then(($price) => {
    let cPrice = $price.text().trim()
    let resCPrice = cPrice.split(" ")
    resCPrice = Number(resCPrice[0].replace(/[^\d]/g, ''))
    expect(resCPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
  })
  // Chuyển tới trang thanh toán từ giỏ hàng
  cy.get('.section-static-inner > .cart-summary-block > .submit-col > .mz-grd-btn > .mz-grd-btn__inner').click({ force: true })
  //check giá sản phẩm
  cy.get('.total-product-price > div').then(($dPrice) => {
    let dPrice = $dPrice.text().trim()
    let resDPrice = dPrice.split(" ")
    resDPrice = Number(resDPrice[0].replace(/[^\d]/g, ''))
    expect(resDPrice, 'Tổng tiền sản phẩm').to.equal(sumPrice)
  })
  //Check địa chỉ
  cy.get('.head-control > .mz-btn > .mz-btn__label-col').should('have.text', 'Sổ địa chỉ')
  cy.get('.block-body > .user-info-row > .address-title-col > .address-title').then(($el) => {
    let urs = $el.text().trim()
    expect(urs, 'Username').to.equal(username)
  })
  cy.get('.block-body > .user-info-row > .main-info-col > .phone-label').then(($el) => {
    let phone = $el.text().trim()
    expect(phone, 'Số điện thoại').to.equal(phoneNumber)
  })
  cy.get('.block-body > .user-info-row > .main-info-col > .mz-text-gray-dark').then(($el) => {
    let adr = $el.text().trim()
    expect(address, 'Địa chỉ').to.contain(adr)
  })
  cy.get('.block-body > .user-info-row > .main-info-col > .full-address-label').then(($el) => {
    let ad = $el.text().trim()
    let resad = ad.split(" ")
    expect(address, 'Địa chỉ chính xác').to.contain(resad[1])
  })
  // get tổng số tiền cần thanh toán của đơn hàng
  cy.wait(5000)
  let resSumPrice
  cy.get('.price-label').then(($sumPrice) => {
    let sPrice = $sumPrice.text().trim()
    resSumPrice = sPrice.split(" ")
    resSumPrice = Number(resSumPrice[0].replace(/[^\d]/g, ''))
    cy.log(resSumPrice)
  })

  // thanh toán đơn hàng qua VNPAY
  cy.get('.mz-grid > :nth-child(4)').click()
  cy.get(':nth-child(1) > .tag-item').should('have.class', 'is-active')
  cy.get('[data-tippy-content="' + $bank + '"]').click()
  cy.get('[data-tippy-content="' + $bank + '"]').should('have.class', 'is-active', 'Thanh toán qua ngân hàng' + $bank)

  //Thanh toán đơn hàng
  cy.get('.submit-order-info-btn').should('have.class', 'is-active')
  cy.get('.submit-order-info-btn').click()

  //đồng ý điều khoản 
  cy.get('.mz-btn-danger').click()
  cy.wait(10000)
  cy.visit('https://fado.vn/lich-su-don-hang')
  cy.get('#user-block__date--order-history > tbody > .user-block__order-tr > .user-block__total-price-td').first().then(($el) => {
    let price = $el.text().trim()
    let resPrice = price.split(" ")
    resPrice = Number(resPrice[0].replace(/[^\d]/g, ''))
    expect(resPrice, 'Tạo đơn hàng thành công').to.equal(resSumPrice)
  })
})

//visit home page
Cypress.Commands.add('visitHomePage', () => {
  cy.clearCookies()

  if(Cypress.env().environment === 'stage') {
    cy.visit(
      Cypress.config('baseUrl'),
      {
        auth: {
          username: 'guest',
          password: '123'
        }
      }
    )
  } else {
    cy.visit(Cypress.config('baseUrl'))
  }

  // đóng popup
  cy.get('body').wait(1000).then($body => {
    if ($body.find('.close').length > 0) {
      cy.get('.modal-body > .close').click();
    }
  })
})

//visit login page
Cypress.Commands.add('visitLoginPage', () => {
  cy.clearCookies()

  if(Cypress.env().environment === 'stage') {
    cy.visit(
      Cypress.config('baseUrl') + 'dang-nhap',
      {
        auth: {
          username: 'guest',
          password: '123'
        }
      }
    )
  }else {
    cy.visit(Cypress.config('baseUrl') + 'dang-nhap')
  }
  
  // đóng popup
  cy.get('body').wait(1000).then($body => {
    if ($body.find('.close').length > 0) {
      cy.get('.modal-body > .close').click();
    }
  })
})