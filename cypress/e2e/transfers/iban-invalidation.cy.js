import LoginPage from '../../support/pages/LoginPage';
import DashboardPage from '../../support/pages/DashboardPage';
import TransferPage from '../../support/pages/TransferPage';

describe('Virement vers un bénéficiaire tiers', () => {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();
  const transferPage = new TransferPage();

  beforeEach(() => {
    cy.fixture('users').as('usersData'); // charger la fixture des utilisateurs
    cy.fixture('beneficiaries').as('beneficiariesData'); // charger la fixture des bénéficiaires
    cy.visit('http://127.0.0.1:8080/index.html'); // page de connexion
  });

  it('Doit afficher un message d\'erreur pour un IBAN invalide', function () {
    const user = this.usersData.balanceUser;
    const invalidBeneficiary = this.beneficiariesData[4].invalidBeneficiary; // Julie Grande avec IBAN invalide

    // ---------------------------
    // Connexion
    // ---------------------------
    loginPage.login(user.email, user.password);

    // Vérification message de bienvenue
    dashboardPage.verifyGreeting('Utilisateur 👋');

    // ---------------------------
    // Aller sur l'onglet Virements
    // ---------------------------
    transferPage.transferTab().click();

    // Vérifier qu'on est sur la page de virement
    transferPage.transferTitle().should('be.visible');

    // ---------------------------
    // Effectuer un virement vers un bénéficiaire
    // ---------------------------
    transferPage.clickTransferToThirdParty(); // Cliquer sur "Vers un tiers"

    // Cliquer sur le bouton "Ajouter un bénéficiaire"
    cy.get('[data-testid="btn-add-beneficiary"]') 
      .should('be.visible') // Vérifier que l'élément est bien visible
      .click(); // Cliquer sur le bouton

    // Vérifier qu'on est bien sur la fenêtre "Ajouter un bénéficiaire"
    cy.get('h3.modal-title').contains('Ajouter un bénéficiaire').should('be.visible');

    // ---------------------------
    // Ajouter un bénéficiaire avec IBAN invalide
    // ---------------------------
    // Saisir le nom du bénéficiaire
    cy.get('[data-testid="input-beneficiary-name"]')
      .should('be.visible')
      .type(invalidBeneficiary.name)
      .should('have.value', invalidBeneficiary.name);

    // Saisir l'IBAN invalide
    cy.get('[data-testid="input-beneficiary-iban"]')
      .should('be.visible')
      .type(invalidBeneficiary.iban)
      .should('have.value', invalidBeneficiary.iban);

    // Cliquer sur le bouton "Ajouter"
    cy.get('[data-testid="btn-save-beneficiary"]')
      .should('be.visible')
      .click();

    // Vérifier que l'alerte IBAN invalide s'affiche
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('IBAN invalide. Format attendu: FR76 XXXX XXXX XXXX XXXX XXXX XXX');
    });
  });
});
