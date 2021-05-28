/// <reference types="Cypress" />

import HomePage from '../../pageObjects/homePage'

describe('LOGIN', () => {

    beforeEach(function () {
        cy.fixture('userInfo').then((data) => {
            this.data = data
        })
        cy.visitLoginPage()
    })
    //chưa viết test cho phần login/register qua fb hoặc gg

    it('Verify form Login', function () {
        const home = new HomePage()

        const login = home.goToSignIn()

        login.getTabLogin().should('have.class', 'is-active')

        login.getLinkForgot().should('have.text', 'Quên mật khẩu ?')

        login.getLoginFb().then(($fb) => {
            const fb = $fb.text().trim()
            expect(fb).to.equal('Facebook')
        })
        login.getLoginGg().then(($gg) => {
            const gg = $gg.text().trim()
            expect(gg).to.equal('Google Plus')
        })
        login.getlinkRegisterNow().should('have.attr', 'href', '/dang-ky-thanh-vien')
    })

    it('Verify if a user will be able to login with a valid email and a valid password', function () {
        const home = new HomePage()

        const login = home.goToSignIn()

        login.fillEmail(this.data.email)
        login.fillPass(this.data.password)

        login.submit()
        cy.wait(10000)
        cy.closePopup()

        home.getUserName().children().should('have.class', 'user-name-col')
            .and('have.class', 'arrow-icon')

    })

    it('Verify if a user will be able to login with an email with the first space and a valid password', function () {
        const home = new HomePage()

        const login = home.goToSignIn()

        login.fillEmail(this.data.emailFirstSpace)
        login.fillEmail(this.data.password)

        login.submit()
        cy.wait(10000)
        cy.closePopup()

        home.getUserName().children().should('have.class', 'user-name-col')
            .and('have.class', 'arrow-icon')

    })

    it('Verify if a user will be able to login with an email with last character space and valid password', function () {
        const home = new HomePage()

        const login = home.goToSignIn()
        login.fillEmail(this.data.emailLastSpace)
        login.fillEmail(this.data.password)

        login.submit()
        cy.wait(10000)
        cy.closePopup()

        home.getUserName().children().should('have.class', 'user-name-col')
            .and('have.class', 'arrow-icon')

    })

    it('Verify if a user cannot login with a valid email and an invalid password', function () {
        const home = new HomePage()

        const login = home.goToSignIn()

        login.fillEmail(this.data.email)
        login.fillEmail(this.data.passwordInvalid)

        login.submit()

        login.getErrorMessage()
            .should('have.text', 'Có lỗi xảy ra:- Mật khẩu không đúng, vui lòng kiểm tra lại')
            .and('have.css', 'color', 'rgb(169, 68, 66)')
    })

    it('Verify if a user cannot login with an invalid email and a valid password', function () {
        const home = new HomePage()

        const login = home.goToSignIn()

        login.fillEmail(this.data.emailInvalid)
        login.fillEmail(this.data.password)

        login.submit()

        login.getErrorMessage()
            .should('have.text', 'Có lỗi xảy ra:- Tài khoản không tồn tại, vui lòng kiểm tra lại')
            .and('have.css', 'color', 'rgb(169, 68, 66)')
    })

    it('Verify if a user cannot login with a valid email and password is blank', function () {
        const home = new HomePage()

        const login = home.goToSignIn()

        login.fillEmail(this.data.emailInvalid)

        login.submit()

        login.getPassError()
            .should('have.text', 'Vui lòng nhập dữ liệu')
            .and('have.css', 'color', 'rgb(205, 53, 59)')
    })

    it('Verify if a user cannot login with a valid password and a email is blank', function () {
        const home = new HomePage()

        const login = home.goToSignIn()

        login.fillEmail(this.data.password)

        login.submit()

        login.getEmailError()
            .should('have.text', 'Vui lòng nhập dữ liệu')
            .and('have.css', 'color', 'rgb(205, 53, 59)')
    })

    it('Verify the login page for both, when the field is blank and Submit button is clicked', function () {
        const home = new HomePage()

        const login = home.goToSignIn()

        login.submit()

        login.getEmailError()
            .should('have.text', 'Vui lòng nhập dữ liệu')
            .and('have.css', 'color', 'rgb(205, 53, 59)')

        login.getPassError()
            .should('have.text', 'Vui lòng nhập dữ liệu')
            .and('have.css', 'color', 'rgb(205, 53, 59)')
    })

    //check forgot function
    it('Verify the ‘Forgot Password’ functionality', function () {
        const home = new HomePage()

        const login = home.goToSignIn()

        login.getLinkForgotPass().click()

        login.getRequestPassModal().should('have.class', 'show')

        login.fillEmailForgot(this.data.email)
        login.fillCapchaForgot('hx68gs#32op')

        login.submitReset()

        login.getFinishModal().should('have.class', 'show')
        cy.get('.request-page > .mz-btn').click()
        cy.url().should('eq', Cypress.config('baseUrl'))
    })

    it('Enter email not register yet', function () {
        const home = new HomePage()

        const login = home.goToSignIn()
        
        login.getLinkForgotPass().click()

        login.getRequestPassModal().should('have.class', 'show')

        login.fillEmailForgot('not@yopmail.com')
        login.fillCapchaForgot('hx68gs#32op')

        login.submitReset()

        login.getRequestPassModal().find('.my-alert.-alert-danger').then(($el) => {
            expect($el, 'Có lỗi xảy ra').to.exist
            expect($el.text()).to.contain('Email của bạn không tồn tại trong hệ thống, xin vui lòng nhập lại.')
        })
        login.getFinishModal().should('not.have.class', 'show')
    })

    it('Enter incorrect capcha', function () {
        const home = new HomePage()

        const login = home.goToSignIn()
        
        login.getLinkForgotPass().click()

        login.getRequestPassModal().should('have.class', 'show')

        login.fillEmailForgot(this.data.email)
        login.fillCapchaForgot('123')

        login.submitReset().wait(2000)

        login.getFinishModal().should('not.have.class', 'show')
    })

})