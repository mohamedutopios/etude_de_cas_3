import LoginPage from '../../support/pages/LoginPage';
import DashboardPage from '../../support/pages/DashboardPage';

describe('Tests de connexion et messages d\'erreur', () => {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  beforeEach(() => {
    cy.fixture('users').as('usersData');          // Charger la fixture des utilisateurs
    cy.fixture('error-message').as('errorsData'); // Charger la fixture des messages d'erreur
    cy.visit('http://127.0.0.1:8080/index.html');                        // Page de connexion
  });

  // Test de connexion avec email et mot de passe valides
  it('Doit se connecter avec email et mot de passe valides et vérifier le dashboard', function () {
    const user = this.usersData.loginUser;

    // Étape 1 : Remplir l'email
    loginPage.emailInput().should('be.visible').type(user.email);

    // Étape 2 : Remplir le mot de passe
    loginPage.passwordInput().should('be.visible').type(user.password);

    // Étape 3 : Cliquer sur le bouton Se connecter
    loginPage.loginButton().should('be.visible').scrollIntoView().click({ force: true });

    // Étape 4 : Vérifier qu'on est bien sur le dashboard
    dashboardPage.dashboardGreeting().should('be.visible').and('contain.text', 'Bonjour, Utilisateur');
  });

  // Tests pour les messages d'erreur de connexion

  it('Doit afficher un message d\'erreur pour un email incorrect', function () {
    const user = this.usersData.invalidEmailUser;
    const errorMsg = this.errorsData.login.invalidEmail;

    loginPage.emailInput().type(user.email);
    loginPage.passwordInput().type(user.password);
    loginPage.loginButton().click();

    // Vérifier le message d'erreur
    cy.get('#login-error').should('be.visible').and('contain.text', errorMsg);
  });

  it('Doit afficher un message d\'erreur pour un mot de passe incorrect', function () {
    const user = this.usersData.invalidPasswordUser;
    const errorMsg = this.errorsData.login.invalidPassword;

    loginPage.emailInput().type(user.email);
    loginPage.passwordInput().type(user.password);
    loginPage.loginButton().click();

    // Vérifier le message d'erreur
    cy.get('#login-error').should('be.visible').and('contain.text', errorMsg);
  });
});
