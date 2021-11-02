describe('Login', () => {
  
  it('Login through Google', () => {
    const loginUrl = 'https://fado.vn/dang-nhap'
    const preLoginSelector = '[id="auth-block__form-group__email"]'
    const loginSelector = '[class="auth-block__social-btn -gp"]'
    const postLoginSelector = '[id="logout-link"]'
    const cookieName = 'my-cookie-name'
    const username = 'thitrinh17061999@gmail.com'
    const password = 'QC-test@123'
    const usernameField = '[id="identifierId"]'
    const usernameSubmitBtn = '[id="identifierNext"]'
    const passwordField = '[name="password"]'
    const passwordSubmitBtn = '[id="passwordNext"]'
    
    const socialLoginOptions = {
      headless: false,
      logs: true,
      getAllBrowserCookies: true,
      loginUrl: loginUrl, // The URL for the login page that includes the social network buttons
      preLoginSelector: preLoginSelector, // a selector to find and click on before clicking on the login button (useful for accepting cookies)
      isPopup: true, // boolean, is your google auth displayed like a popup
      popupDelay: 5000, // number, delay a specific milliseconds before popup is shown. Pass a falsy (false, 0, null, undefined, '') to avoid completely
      loginSelectorDelay: 500, // delay a specific amount of time before clicking on the login button, defaults to 250ms. Pass a boolean false to avoid completely.
      loginSelector: loginSelector, // A selector on the page that defines the specific social network to use and can be clicked, such as a button or a link      
      username: username,
      password: password,
      postLoginSelector: postLoginSelector, // A selector on the post-login page that can be asserted upon to confirm a successful login
      usernameField: usernameField,
      usernameSubmitBtn: usernameSubmitBtn,
      passwordField: passwordField,
      passwordSubmitBtn: passwordSubmitBtn
    }
    
    return cy.task('GoogleSocialLogin', socialLoginOptions).then(({cookies}) => {
      cy.clearCookies()

      const cookie = cookies.filter(cookie => cookie.name === cookieName).pop()
      if (cookie) {
        cy.setCookie(cookie.name, cookie.value, {
          domain: cookie.domain,
          expiry: cookie.expires,
          httpOnly: cookie.httpOnly,
          path: cookie.path,
          secure: cookie.secure
        })

        Cypress.Cookies.defaults({
          preserve: cookieName
        })
      }
    })
  })
})