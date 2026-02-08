import LoginPage from '../../support/pages/LoginPage';
import DashboardPage from '../../support/pages/DashboardPage';

describe('Déconnexion', () => {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  beforeEach(() => {
    cy.fixture('users').as('usersData');
    cy.visit('http://127.0.0.1:8080/index.html');
  });

  it('Doit se déconnecter correctement avec le compte loginUser', function () {
    const user = this.usersData.loginUser;

    // ---------------------------
    // Connexion
    // ---------------------------
    loginPage.login(user.email, user.password);
    dashboardPage.dashboardGreeting().should('contain.text', 'Bonjour');

    // ---------------------------
    // Cliquer sur Déconnexion
    // ---------------------------
    cy.get('[data-testid="btn-logout"]').click();

    // ---------------------------
    // Vérifier que l’utilisateur est bien déconnecté
    // ---------------------------
    cy.get('[data-testid="header-user-name"]').should('not.exist'); // nom disparu
    cy.get('[data-testid="btn-logout"]').should('not.exist');       // bouton disparu

  });
});
