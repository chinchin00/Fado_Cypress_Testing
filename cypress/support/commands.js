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

//visit home page
Cypress.Commands.add('visitHomePage', () => {

  if (Cypress.env().environment === 'stage') {
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

  if (Cypress.env().environment === 'stage') {
    cy.visit(
      Cypress.config('baseUrl') + 'dang-nhap',
      {
        auth: {
          username: 'guest',
          password: '123'
        }
      }
    )
  } else {
    cy.visit(Cypress.config('baseUrl') + 'dang-nhap')
  }

  // đóng popup
  cy.get('body').wait(1000).then($body => {
    if ($body.find('.close').length > 0) {
      cy.get('.modal-body > .close').click();
    }
  })
})

//login by form
Cypress.Commands.add('loginByForm', () => {
  const formData = new FormData();
  formData.append('email', 'trinhnt@miczone.asia');
  formData.append('password', '123456');
  return cy.request({
    method: 'POST',
    url: '/ajax/user/postUserLogin?v=3.142.11.2',
    body: formData
  })
})