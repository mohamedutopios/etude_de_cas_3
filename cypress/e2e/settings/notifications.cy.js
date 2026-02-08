import LoginPage from '../../support/pages/LoginPage';
import DashboardPage from '../../support/pages/DashboardPage';

describe('Paramètres de sécurité - Gestion des notifications', () => {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  beforeEach(() => {
    cy.fixture('users').as('usersData');
    cy.visit('http://127.0.0.1:8080/index.html');
  });

  it('Doit activer et désactiver les notifications Email et SMS', function () {
    const user = this.usersData.loginUser;

    // ---------------------------
    // Connexion
    // ---------------------------
    loginPage.login(user.email, user.password);
    dashboardPage.dashboardGreeting().should('be.visible');

    // ---------------------------
    // Aller sur l'onglet Sécurité
    // ---------------------------
    cy.get('[data-testid="tab-security"]').click();
    cy.contains('Paramètres de sécurité').should('be.visible');

    // ---------------------------
    // Notifications Email
    // ---------------------------
    cy.get('[data-testid="toggle-email-notifications"]')
      .should('be.checked')          // Vérifie qu'il est coché par défaut
      .uncheck({ force: true })      // Décocher
      .should('not.be.checked')      // Vérifie qu'il est bien décoché
      .check({ force: true })        // Re-cocher
      .should('be.checked');         // Vérifie qu'il est bien coché

    // ---------------------------
    // Notifications SMS
    // ---------------------------
    cy.get('[data-testid="toggle-sms-notifications"]')
      .should('not.be.checked')      // Vérifie qu'il est décoché par défaut
      .check({ force: true })        // Cocher
      .should('be.checked')          // Vérifie qu'il est bien coché
      .uncheck({ force: true })      // Décocher
      .should('not.be.checked');     // Vérifie qu'il est bien décoché
  });
});
