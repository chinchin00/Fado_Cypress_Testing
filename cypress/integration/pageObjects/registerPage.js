class RegisterPage{

    getTabRegister(){
        return cy.get('.auth-block__menu-list > :nth-child(2)');
    }

    fillFullName(value) {
        const field = cy.get('[data-test-register-input-fullname]');
        field.clear();
        field.type(value);
        return this;
    }

    fillEmail(value) {
        const field = cy.get('[data-test-register-input-email]');
        field.clear();
        field.type(value);
        return this;
    }

    fillPhone(value){
        const field = cy.get('[data-test-register-input-phone]');
        field.clear();
        field.type(value);
        return this;
    }

    fillPass(value){
        const field = cy.get('[data-test-register-input-password]');
        field.clear();
        field.type(value);
        return this;
    }

    fillConfirmPass(value){
        const field = cy.get('[data-test-register-input-retypepassword]');
        field.clear();
        field.type(value);
        return this;
    }

    getBirthday(){
        return cy.get('[data-test-register-input-birthday]');
    }

    fillGender(value){
        const field = cy.get('[data-test-register-select-gender]');
        field.select(value, { force: true })
        return this;
    }

    fillCapcha(value){
        const field = cy.get('[data-test-register-input-captcha]');
        field.clear();
        field.type(value);
        return this;
    }

    getCapchaInput(){
        return cy.get('[data-test-register-input-captcha]');
    }

    getLoginFb(){
        return cy.get('.auth-block__social-btn.-fb');
    }

    getLoginGg(){
        return cy.get('.auth-block__social-btn.-gp');
    }

    getFullNameError(){
        return cy.get('#fullname-error')
    }

    getPasswordError(){
        return  cy.get('#auth-block__register-form__password-input-error')
    }

    getRetypePassError(){
        return cy.get('#retypePassword-error')
    }

    getEmailError(){
        return cy.get('#email-error')
    }

    getPhoneError(){
        return cy.get('#phone-error')
    }
    submit(){
        const btn =  cy.get('.my-btn');
        btn.click().wait(1000)
    }

    getErrorMessage(){
        return cy.get('#auth-block__register-form > .my-alert')
    }
}

export default RegisterPage;