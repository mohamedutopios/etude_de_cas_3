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

  it('Doit effectuer un virement vers un bénéficiaire avec IBAN valide', function () {
    const user = this.usersData.balanceUser;
    const validBeneficiary = this.beneficiariesData[3].validBeneficiarytest; // beneficiaire avec IBAN valide

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
    // Ajouter un bénéficiaire avec IBAN valide
    // ---------------------------
    // Saisir le nom du bénéficiaire
    cy.get('[data-testid="input-beneficiary-name"]')
      .should('be.visible')
      .type(validBeneficiary.name)
      .should('have.value', validBeneficiary.name);

    // Saisir l'IBAN valide
    
    cy.get('[data-testid="input-beneficiary-iban"]')
      .should('be.visible')
      .type(validBeneficiary.iban)
      .invoke('val')
      .then((ibanValue) => {
        expect(ibanValue).to.not.equal('');

        const normalizedIban = String(ibanValue).replace(/\s+/g, '');
        expect(normalizedIban).to.match(/^FR76\d{23}$/);
        expect(normalizedIban.length).to.eq(27);
  });
  
    // Cliquer sur le bouton "Ajouter"
    cy.get('[data-testid="btn-save-beneficiary"]')
      .should('be.visible')
      .click();

    // Vérifier que le bénéficiaire a bien été ajouté
    cy.get('div.beneficiary-name')
      .contains(validBeneficiary.name)
      .should('be.visible');
  });
});
