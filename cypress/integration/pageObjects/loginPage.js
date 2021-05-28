class LoginPage{

    getTabLogin(){
        return cy.get('.auth-block__menu-list > :nth-child(1)')
    }

    getLoginFb(){
        return cy.get('.auth-block__social-btn.-fb');
    }

    getLoginGg(){
        return cy.get('.auth-block__social-btn.-gp');
    }

    fillEmail(value){
        const field = cy.get('[data-test-login-email-input]');
        field.clear();
        field.type(value);
        return this;
    }

    fillPass(value){
        const field = cy.get('[data-test-login-password]');
        field.clear();
        field.type(value);
        return this;
    }

    getLinkForgot(){
        return  cy.get('[data-test-login-href]');
    }

    getlinkRegisterNow(){
        return cy.get('.auth-block__alert-register-field > a')
    }

    submit(){
        const btn =  cy.get('[data-test-login-btn-submit]');
        btn.click().wait(4000);
    }

    getErrorMessage(){
        return cy.get('#auth-block__register-form > .my-alert');
    }

    getPassError(){
        return cy.get('#password-error');
    }

    getEmailError(){
        return cy.get('#auth-block__form-group__email-error');
    }

    getLinkForgotPass(){
        return cy.get('.mz-text-right > a');
    }

    getRequestPassModal(){
        return cy.get('#request-password-modal');
    }

    fillEmailForgot(value){
        const field = cy.get('.mz-basic-modal__body > :nth-child(1) > .mz-form-group__control-col > .mz-form-control > .my-form-control');
        field.clear();
        field.type(value);
        return this;
    }

    fillCapchaForgot(value){
        const field = cy.get(':nth-child(1) > .mz-form-control > .my-form-control');
        field.clear();
        field.type(value);
        return this;
    }

    submitReset(){
        const button = cy.get('#request-password-modal__form > .modal-content > .mz-basic-modal__foot > .mz-btn-primary');
        button.click();
    }

    getFinishModal(){
        return cy.get('#request-password-finish-modal');
    }
}

export default LoginPage;