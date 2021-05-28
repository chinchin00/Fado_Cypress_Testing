/// <reference types="Cypress" />
import RegisterPage from '../../pageObjects/registerPage'
import HomePage from '../../pageObjects/homePage'
import { generateRandomString, generateRandomStringPhone } from '../../../util/stringUtil';

describe('REGISTER', function () {
    const emailFakeSuffix = '@test.cypress';


     beforeEach(function () {
        cy.fixture('userInfo').then((data) => {
            this.data = data
        })
        cy.visitLoginPage()
    })

    it('Register new account', () => {
        const register = new RegisterPage();
        const home = new HomePage();
        const email = generateRandomString(7) + emailFakeSuffix;
        const phone = generateRandomStringPhone();

        //redirect to tab register
        register.getTabRegister().click()

        register.getTabRegister().should('have.class', 'is-active')

        register.fillFullName('QC_test')

        register.fillEmail(email)

        register.fillPhone(phone)

        register.fillPass('123456')

        register.fillConfirmPass('123456')

        register.fillGender('Nữ')

        register.fillCapcha('hx68gs#32op')

        register.getLoginFb().then(($fb) => {
            const fb = $fb.text().trim()
            expect(fb).to.equal('Facebook')
        })
        register.getLoginGg().then(($gg) => {
            const gg = $gg.text().trim()
            expect(gg).to.equal('Google Plus')
        })

        register.submit()
        cy.url().should('eq', Cypress.config('baseUrl'))

        home.getUserName().children().should('have.class', 'user-name-col')
            .and('have.class', 'arrow-icon')
    })

    it('Không nhập thông tin vào tất cả các trường và nhấn đăng ký', () => {
        const register = new RegisterPage();

        //redirect to tab register
        register.getTabRegister().click()

        register.getTabRegister().should('have.class', 'is-active')

        register.submit()

        register.getFullNameError().should('have.text', 'Vui lòng nhập dữ liệu')
        register.getEmailError().should('have.text', 'Vui lòng nhập dữ liệu')
        register.getPhoneError().should('have.text', 'Vui lòng nhập dữ liệu')
        register.getPasswordError().should('have.text', 'Vui lòng nhập dữ liệu')

    })

    it('Đăng ký với email đã tồn tại', function () {
        const register = new RegisterPage();
        const phone = generateRandomStringPhone();

        //redirect to tab register
        register.getTabRegister().click()

        register.getTabRegister().should('have.class', 'is-active')

        register.fillFullName('QC_test')

        register.fillEmail('trinh1@yopmail.com')

        register.fillPhone(phone)

        register.fillPass('123456')

        register.fillConfirmPass('123456')

        register.fillGender('Nữ')

        register.fillCapcha('hx68gs#32op')

        register.submit()

        register.getErrorMessage().then(($el) => {
            const errorMessage = $el.text().trim()
            expect(errorMessage).to.equal('Có lỗi xảy ra:- Email đã tồn tại')
        })
    })

    it('Đăng ký tài khoản với email sai format', function () {
        const register = new RegisterPage();
        const phone = generateRandomStringPhone();

        //redirect to tab register
        register.getTabRegister().click()

        register.getTabRegister().should('have.class', 'is-active')

        register.fillFullName('QC_test')

        register.fillEmail('emailyopmail.com')

        register.fillPhone(phone)

        register.fillPass('123456')

        register.fillConfirmPass('123456')

        register.fillGender('Nữ')

        register.fillCapcha('hx68gs#32op')

        register.submit()
        register.getEmailError().should('have.text', 'Vui lòng nhập Email đúng định dạng')
    })

    it('Nhập dấu cách trước email', function () {
        const register = new RegisterPage();
        const home = new HomePage();
        const email = generateRandomString(7) + emailFakeSuffix;
        const phone = generateRandomStringPhone();

        //redirect to tab register
        register.getTabRegister().click()

        register.getTabRegister().should('have.class', 'is-active')

        register.fillFullName('QC_test')

        register.fillEmail('    ' + email)

        register.fillPhone(phone)

        register.fillPass('123456')

        register.fillConfirmPass('123456')

        register.fillGender('Nữ')

        register.fillCapcha('hx68gs#32op')

        register.getLoginFb().then(($fb) => {
            const fb = $fb.text().trim()
            expect(fb).to.equal('Facebook')
        })
        register.getLoginGg().then(($gg) => {
            const gg = $gg.text().trim()
            expect(gg).to.equal('Google Plus')
        })

        register.submit()
        cy.url().should('eq', Cypress.config('baseUrl'))

        home.getUserName().children().should('have.class', 'user-name-col')
            .and('have.class', 'arrow-icon')
    })

    it('Nhập dấu cách sau email', function () {
        const register = new RegisterPage();
        const home = new HomePage()

        const email = generateRandomString(7) + emailFakeSuffix;
        const phone = generateRandomStringPhone();

        //redirect to tab register
        register.getTabRegister().click()

        register.getTabRegister().should('have.class', 'is-active')

        register.fillFullName('QC_test')

        register.fillEmail(email + '    ')

        register.fillPhone(phone)

        register.fillPass('123456')

        register.fillConfirmPass('123456')

        register.fillGender('Nữ')

        register.fillCapcha('hx68gs#32op')

        register.getLoginFb().then(($fb) => {
            const fb = $fb.text().trim()
            expect(fb).to.equal('Facebook')
        })
        register.getLoginGg().then(($gg) => {
            const gg = $gg.text().trim()
            expect(gg).to.equal('Google Plus')
        })

        register.submit()
        cy.url().should('eq', Cypress.config('baseUrl'))

        home.getUserName().children().should('have.class', 'user-name-col')
            .and('have.class', 'arrow-icon')
    })

    it('Đăng ký tài khoản mới với số điện thoại đã tồn tại', function () {
        const register = new RegisterPage();
        const email = generateRandomString(7) + emailFakeSuffix;

        //redirect to tab register
        register.getTabRegister().click()

        register.getTabRegister().should('have.class', 'is-active')

        register.fillFullName('QC_test')

        register.fillEmail(email)

        register.fillPhone('0363240850')

        register.fillPass('123456')

        register.fillConfirmPass('123456')

        register.fillGender('Nữ')

        register.fillCapcha('hx68gs#32op')

        register.submit()

        register.getErrorMessage().then(($el) => {
            const errorMessage = $el.text().trim()
            expect(errorMessage).to.equal('Có lỗi xảy ra:- Số điện thoại đã tồn tại')
        })
    })

    it('Không nhập trường họ tên', function () {
        const register = new RegisterPage();
        const email = generateRandomString(7) + emailFakeSuffix;
        const phone = generateRandomStringPhone();

        //redirect to tab register
        register.getTabRegister().click()

        register.getTabRegister().should('have.class', 'is-active')

        register.fillEmail(email)

        register.fillPhone(phone)

        register.fillPass('123456')

        register.fillConfirmPass('123456')

        register.fillGender('Nữ')

        register.fillCapcha('hx68gs#32op')

        register.submit()

        register.getFullNameError().should('have.text', 'Vui lòng nhập dữ liệu')
    })

    it('Không nhập trường email', function () {
        const register = new RegisterPage();

        const phone = generateRandomStringPhone();

        //redirect to tab register
        register.getTabRegister().click()

        register.getTabRegister().should('have.class', 'is-active')

        register.fillFullName('QC_test')

        register.fillPhone(phone)

        register.fillPass('123456')

        register.fillConfirmPass('123456')

        register.fillGender('Nữ')

        register.fillCapcha('hx68gs#32op')

        register.submit()
        register.getEmailError().should('have.text', 'Vui lòng nhập dữ liệu')
    })

    it('Không nhập số điện thoại', function () {
        const register = new RegisterPage();

        const email = generateRandomString(7) + emailFakeSuffix;

        //redirect to tab register
        register.getTabRegister().click()

        register.getTabRegister().should('have.class', 'is-active')

        register.fillFullName('QC_test')

        register.fillEmail(email)

        register.fillPass('123456')

        register.fillConfirmPass('123456')

        register.fillGender('Nữ')

        register.fillCapcha('hx68gs#32op')

        register.submit()

        register.getPhoneError().should('have.text', 'Vui lòng nhập dữ liệu')
    })

    it('Nhập số điện thoại sai format', function () {
        const register = new RegisterPage();

        const email = generateRandomString(7) + emailFakeSuffix;

        //redirect to tab register
        register.getTabRegister().click()

        register.getTabRegister().should('have.class', 'is-active')

        register.fillFullName('QC_test')

        register.fillEmail(email)

        register.fillPhone('035324')

        register.fillPass('123456')

        register.fillConfirmPass('123456')

        register.fillGender('Nữ')

        register.fillCapcha('hx68gs#32op')

        register.submit()

        register.getPhoneError().should('have.text', 'Độ dài số điện thoại không hợp lệ')
    })

    it('Không nhập mật khẩu', function () {
        const register = new RegisterPage();

        const email = generateRandomString(7) + emailFakeSuffix;
        const phone = generateRandomStringPhone();

        //redirect to tab register
        register.getTabRegister().click()

        register.getTabRegister().should('have.class', 'is-active')

        register.fillFullName('QC_test')

        register.fillEmail(email)

        register.fillPhone(phone)

        register.fillConfirmPass('123456')

        register.fillGender('Nữ')

        register.fillCapcha('hx68gs#32op')

        register.submit()

        register.getPasswordError().should('have.text', 'Vui lòng nhập dữ liệu')
    })

    it('Không nhập vào field xác nhận mật khẩu', function () {
        const register = new RegisterPage();

        const email = generateRandomString(7) + emailFakeSuffix;
        const phone = generateRandomStringPhone();

        //redirect to tab register
        register.getTabRegister().click()

        register.getTabRegister().should('have.class', 'is-active')

        register.fillFullName('QC_test')

        register.fillEmail(email)

        register.fillPhone(phone)

        register.fillPass('123456')

        register.fillGender('Nữ')

        register.fillCapcha('hx68gs#32op')

        register.submit()

        register.getRetypePassError().should('have.text', 'Mật khẩu nhập lại không trùng khớp')
    })

    it('Nhập mật khẩu và xác nhận mật khẩu không khớp', function () {
        const register = new RegisterPage();

        const email = generateRandomString(7) + emailFakeSuffix;
        const phone = generateRandomStringPhone();

        //redirect to tab register
        register.getTabRegister().click()

        register.getTabRegister().should('have.class', 'is-active')

        register.fillFullName('QC_test')

        register.fillEmail(email)

        register.fillPhone(phone)

        register.fillPass('123456')

        register.fillConfirmPass('123457')

        register.fillGender('Nữ')

        register.fillCapcha('hx68gs#32op')

        register.submit()

        register.getRetypePassError().should('have.text', 'Mật khẩu nhập lại không trùng khớp')
    })

    it('Không nhập mã xác nhận', function () {
        const register = new RegisterPage();

        const email = generateRandomString(7) + emailFakeSuffix;
        const phone = generateRandomStringPhone();

        //redirect to tab register
        register.getTabRegister().click()

        register.getTabRegister().should('have.class', 'is-active')

        register.fillFullName('QC_test')

        register.fillEmail(email)

        register.fillPhone(phone)

        register.fillPass('123456')

        register.fillConfirmPass('123456')

        register.fillGender('Nữ')

        register.submit()

        register.getCapchaInput().then(($el) => {
            expect($el).to.have.css('border-color', 'rgb(205, 53, 59)')
        })
    })

    it('Nhập mã xác nhận sai', function () {
        const register = new RegisterPage();

        const email = generateRandomString(7) + emailFakeSuffix;
        const phone = generateRandomStringPhone();

        //redirect to tab register
        register.getTabRegister().click()

        register.getTabRegister().should('have.class', 'is-active')

        register.fillFullName('QC_test')

        register.fillEmail(email)

        register.fillPhone(phone)

        register.fillPass('123456')

        register.fillConfirmPass('123456')

        register.fillGender('Nữ')

        register.fillCapcha('hx68gs#55555')

        register.submit()

        register.getErrorMessage().then(($el) => {
            const errorMessage = $el.text().trim()
            expect(errorMessage).to.equal('Có lỗi xảy ra:- Mã xác nhận không chính xác')
        })
    })
})