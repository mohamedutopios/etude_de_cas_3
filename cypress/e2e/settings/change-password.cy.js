import LoginPage from '../../support/pages/LoginPage';
import DashboardPage from '../../support/pages/DashboardPage';

describe('Paramètres de sécurité - Modification du mot de passe', () => {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  beforeEach(function () {
    cy.fixture('users').as('usersData');
    cy.fixture('success-message').as('successMessages');  // Charger la fixture success-message.json
    cy.visit('http://127.0.0.1:8080/index.html');
  });

  it('Doit ouvrir la modale et vérifier les critères avant de modifier le mot de passe', function () {
    const user = this.usersData.ChangePasswordSecurity;
    const newPassword = 'NewPass123!';

    // ---------------------------
    // Connexion
    // ---------------------------
    loginPage.login(user.email, user.password);
    dashboardPage.verifyGreeting(user.name);

    // ---------------------------
    // Aller sur l'onglet Sécurité
    // ---------------------------
    cy.get('[data-testid="tab-security"]').click();
    cy.contains('Paramètres de sécurité').should('be.visible');

    // ---------------------------
    // Cliquer sur Modifier le mot de passe
    // ---------------------------
    cy.get('[data-testid="btn-change-password"]').click();
    cy.get('h3.modal-title').should('contain.text', 'Modifier le mot de passe');

    // ---------------------------
    // Remplir le formulaire avec un nouveau mot de passe
    // ---------------------------
    cy.get('[data-testid="input-current-password"]').type(user.password);
    cy.get('[data-testid="input-new-password"]').type(newPassword);
    cy.get('[data-testid="input-confirm-password"]').type(newPassword);

    // ---------------------------
    // Vérification dynamique des critères
    // ---------------------------
    cy.get('#req-length').should('contain.text', 'Au moins 8 caractères').and(() => {
      expect(newPassword.length >= 8).to.be.true;
    });
    cy.get('#req-upper').should('contain.text', 'Une majuscule').and(() => {
      expect(/[A-Z]/.test(newPassword)).to.be.true;
    });
    cy.get('#req-lower').should('contain.text', 'Une minuscule').and(() => {
      expect(/[a-z]/.test(newPassword)).to.be.true;
    });
    cy.get('#req-number').should('contain.text', 'Un chiffre').and(() => {
      expect(/\d/.test(newPassword)).to.be.true;
    });
    cy.get('#req-special').should('contain.text', 'Un caractère spécial').and(() => {
      expect(/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)).to.be.true;
    });

    // ---------------------------
    // Soumettre le formulaire
    // ---------------------------
    cy.get('[data-testid="btn-save-password"]').click();

    // ---------------------------
    // Vérifier le message de succès
    // ---------------------------
    cy.get('#security-success')
      .should('be.visible')
      .and('contain.text', this.successMessages.security.success);  // Utiliser le message de succès depuis la fixture
  });
});
