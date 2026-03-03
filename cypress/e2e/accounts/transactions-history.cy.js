import LoginPage from '../../support/pages/LoginPage';
import TransactionsPage from '../../support/pages/TransactionsPage';

describe('Historique des transactions récentes - Compte Courant', () => {
  const loginPage = new LoginPage();
  const transactionsPage = new TransactionsPage();

  beforeEach(() => {
    cy.visit('/'); // Page de connexion
  });

  it('Doit afficher les 3 dernières transactions du compte courant', () => {

    // Charger les données depuis la fixture
    cy.fixture('users').then((users) => {
      const user = users.balanceUser;

      // Se connecter
      loginPage.login(user.email, user.password);

      // Vérifier que la page principale affiche le texte "Bonjour, Utilisateur"
      cy.contains('Bonjour, Utilisateur').should('be.visible');

      // Cliquer sur le compte courant pour afficher les transactions
      cy.get('[data-testid="balance-4"]').click();

      // Vérifier que le titre "Dernières transactions" est visible
      transactionsPage.recentTransactionsTitle().should('be.visible');

      // Vérification dynamique des transactions
      user.transactions.forEach((tx, index) => {
        transactionsPage.verifyTransaction(
          index,
          tx.description,
          tx.amount,
          tx.date
        );
      });
    });

  });
});
