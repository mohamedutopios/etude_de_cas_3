import LoginPage from '../../support/pages/LoginPage';
import DashboardPage from '../../support/pages/DashboardPage';

describe('Paramètres de sécurité - Modification du mot de passe invalide', () => {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  beforeEach(function () {
    cy.fixture('users').then((usersData) => {
      this.usersData = usersData;

      cy.visit('http://127.0.0.1:8080/index.html');

      // Connexion avec l’utilisateur ChangePasswordSecurity
      const user = usersData.ChangePasswordSecurity;
      loginPage.login(user.email, user.password);
      dashboardPage.verifyGreeting(user.name);

      // Aller sur l’onglet Sécurité
      cy.get('[data-testid="tab-security"]').click();
      cy.get('h2.card-title')
        .should('be.visible')
        .and('contain.text', 'Paramètres de sécurité');

      // Ouvrir la modale
      cy.get('[data-testid="btn-change-password"]').click();
      cy.get('#modal-change-password').should('be.visible');
      cy.get('h3.modal-title')
        .should('contain.text', 'Modifier le mot de passe');
    });
  });

  it('Erreur si le mot de passe actuel est incorrect', function () {
    const data = this.usersData.ChangePasswordInvalid.wrongCurrent;
    cy.fixture('error-message').then((errorMessages) => {
      const errorMessage = errorMessages.changePassword.wrongCurrent;

      cy.get('[data-testid="input-current-password"]').type(data.current);
      cy.get('[data-testid="input-new-password"]').type(data.new);
      cy.get('[data-testid="input-confirm-password"]').type(data.confirm);

      cy.get('[data-testid="btn-save-password"]').click();

      cy.get('#password-error')
        .should('be.visible')
        .and('contain.text', errorMessage);  // Message d'erreur depuis la fixture
    });
  });

  it('Erreur si les mots de passe ne correspondent pas', function () {
    const data = this.usersData.ChangePasswordInvalid.mismatch;
    cy.fixture('error-message').then((errorMessages) => {
      const errorMessage = errorMessages.changePassword.mismatch;

      cy.get('[data-testid="input-current-password"]').type(data.current);
      cy.get('[data-testid="input-new-password"]').type(data.new);
      cy.get('[data-testid="input-confirm-password"]').type(data.confirm);

      cy.get('[data-testid="btn-save-password"]').click();

      cy.get('#password-error')
        .should('be.visible')
        .and('contain.text', errorMessage);  // Message d'erreur depuis la fixture
    });
  });

  it('Erreur si le mot de passe ne respecte pas les critères de sécurité', function () {
    const data = this.usersData.ChangePasswordInvalid.weakPassword;
    cy.fixture('error-message').then((errorMessages) => {
      const errorMessage = errorMessages.changePassword.weakPassword;

      cy.get('[data-testid="input-current-password"]').type(data.current);
      cy.get('[data-testid="input-new-password"]').type(data.new);
      cy.get('[data-testid="input-confirm-password"]').type(data.confirm);

      cy.get('[data-testid="btn-save-password"]').click();

      cy.get('#password-error')
        .should('be.visible')
        .and('contain.text', errorMessage);  // Message d'erreur depuis la fixture
    });
  });
});
