import LoginPage from '../../support/pages/LoginPage';
import DashboardPage from '../../support/pages/DashboardPage';

describe('Paramètres de sécurité - Double authentification', () => {

  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  beforeEach(() => {
    cy.fixture('users').as('usersData');
    cy.fixture('success-message').as('successMessage');  // Charger la fixture success-message
    cy.visit('http://127.0.0.1:8080/index.html');
  });

  it('Doit activer puis désactiver la double authentification', function () {

    const user = this.usersData.loginUser;
    const successEnabledMessage = this.successMessage.security.enabled;  // Message pour l'activation de la 2FA
    const successDisabledMessage = this.successMessage.security.disabled;  // Message pour la désactivation de la 2FA

    // ---------------------------
    // Connexion
    // ---------------------------
    loginPage.login(user.email, user.password);
    dashboardPage.dashboardGreeting()
      .should('be.visible')
      .and('contain.text', 'Bonjour');

    // ---------------------------
    // Accès à l’onglet Sécurité
    // ---------------------------
    cy.get('[data-testid="tab-security"]').click();
    cy.contains('Paramètres de sécurité').should('be.visible');

    // ---------------------------
    // Activation de la 2FA
    // ---------------------------
    cy.get('[data-testid="toggle-2fa"]')
      .should('exist')
      .and('not.be.checked')
      .check({ force: true });

    // Vérifier le message de succès pour l'activation de la 2FA
    cy.get('#security-success')
      .should('be.visible')
      .and('contain.text', successEnabledMessage);

    // ---------------------------
    // Désactivation de la 2FA
    // ---------------------------
    cy.get('[data-testid="toggle-2fa"]')
      .should('be.checked')
      .uncheck({ force: true });

    // Vérifier le message de succès pour la désactivation de la 2FA
    cy.get('#security-success')
      .should('be.visible')
      .and('contain.text', successDisabledMessage);
  });
});
