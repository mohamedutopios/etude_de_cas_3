class LoginPage {

    // -------------------------
    // Page de connexion
    // -------------------------
    emailInput() {
      return cy.get('[data-testid="input-email"]');
    }
  
    passwordInput() {
      return cy.get('[data-testid="input-password"]');
    }
  
    loginButton() {
      return cy.get('[data-testid="btn-login"]');
    }
  
    forgotPasswordLink() {
      return cy.get('[data-testid="link-forgot-password"]');
    }
  
    typeEmail(email) {
      this.emailInput().clear().type(email);
    }
  
    typePassword(password) {
      this.passwordInput().clear().type(password);
    }
  
    clickLogin() {
      this.loginButton().click();
    }
  
    login(email, password) {
      this.typeEmail(email);
      this.typePassword(password);
      this.clickLogin();
    }
  
    // -------------------------
    // Page 2FA
    // -------------------------
    twoFAScreen() {
      return cy.get('h1.login-title')
        .contains('Vérification en 2 étapes');
    }
  
    // Saisie du code 2FA chiffre par chiffre
    enterTwoFACode(code) {
      const digits = code.split('');
      digits.forEach((digit, index) => {
        cy.get(`[data-testid="2fa-code-${index}"]`).type(digit);
      });
    }
  
    submitTwoFACodeButton() {
      return cy.get('[data-testid="btn-verify-2fa"]');
    }
  
    // -------------------------
    // Mot de passe oublié
    // -------------------------

    forgotPasswordTitle() {
        return cy.get('h1.login-title').contains('Mot de passe oublié');
      }

    resetEmailInput() {
      return cy.get('[data-testid="input-reset-email"]');
    }
  
    sendResetLinkButton() {
      return cy.get('[data-testid="btn-reset-password"]');
    }
  
    resetSuccessMessage() {
      return cy.get('[data-testid="reset-success"]');
    }
  
    requestPasswordReset(email) {
      this.resetEmailInput().clear().type(email);
      this.sendResetLinkButton().click();
    }
  
  }
  
  export default LoginPage;
  