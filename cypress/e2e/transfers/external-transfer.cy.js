import LoginPage from '../../support/pages/LoginPage';
import DashboardPage from '../../support/pages/DashboardPage';
import TransferPage from '../../support/pages/TransferPage';

describe('Virement vers un bénéficiaire tiers', () => {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();
  const transferPage = new TransferPage();

  beforeEach(() => {
    cy.fixture('transfer').as('transferData'); // Charger la fixture de transfert
    cy.fixture('beneficiaries').as('beneficiariesData'); // Charger la fixture des bénéficiaires
    cy.fixture('users').as('usersData'); // Charger la fixture des utilisateurs
    cy.fixture('success-message').as('successMessage'); // Charger la fixture des messages de succès
    cy.fixture('error-message').as('errorMessage'); // Charger la fixture des messages d'erreur
    cy.visit('http://127.0.0.1:8080/index.html'); // Page de connexion
  });

  it('Doit effectuer un virement du compte courant vers un bénéficiaire', function () {
    const user = this.usersData.loginUser; // Récupérer les données utilisateur depuis users.json
    const transferAmount = this.transferData.balanceUser.transfer.amount; // Montant à transférer depuis transfer.json
    const beneficiaryIban = this.beneficiariesData[0].iban; // IBAN du premier bénéficiaire depuis beneficiaries.json
    const successMessage = this.successMessage.transfer.success; // Récupérer le message de succès depuis success-message.json

    // ---------------------------
    // Connexion
    // ---------------------------
    loginPage.login(user.email, user.password);

    // Vérification du message de bienvenue
    dashboardPage.verifyGreeting('Utilisateur 👋');

    // ---------------------------
    // Aller sur l'onglet Virements
    // ---------------------------
    transferPage.transferTab().click();

    // Vérifier qu'on est sur la page de virement
    transferPage.transferTitle().should('be.visible');

    // ---------------------------
    // Effectuer le virement vers un bénéficiaire
    // ---------------------------
    transferPage.clickTransferToThirdParty(); // Cliquer sur "Vers un tiers"

    // Sélectionner le compte débiteur par valeur (index ou valeur d'option)
    cy.get('[data-testid="select-from-account"]').select('4'); // Sélectionner le compte (ici par index)

    // Sélectionner le bénéficiaire par IBAN
    transferPage.selectBeneficiary(beneficiaryIban);  // Utiliser l'IBAN du bénéficiaire depuis la fixture

    // Saisir le montant
    transferPage.enterAmount(transferAmount);

    // Soumettre le virement
    transferPage.submitTransfer();

    // ---------------------------
    // Vérifier le message de succès
    // ---------------------------
    cy.get('#transfer-success')  // Sélectionner l'élément contenant le message de succès
      .should('be.visible') // Vérifier que l'élément est visible
      .and('contain.text', successMessage); // Vérifier que le texte est correct
  });

  it('Doit afficher un message d\'erreur si aucun bénéficiaire n\'est sélectionné', function () {
    const user = this.usersData.loginUser; // Récupérer les données utilisateur depuis users.json
    const transferAmount = this.transferData.balanceUser.transfer.amount; // Montant à transférer depuis transfer.json
    const errorMessage = this.errorMessage.transfer.noBeneficiarySelected; // Récupérer le message d'erreur depuis error-message.json

    // ---------------------------
    // Connexion
    // ---------------------------
    loginPage.login(user.email, user.password);

    // Vérification du message de bienvenue
    dashboardPage.verifyGreeting('Utilisateur 👋');

    // ---------------------------
    // Aller sur l'onglet Virements
    // ---------------------------
    transferPage.transferTab().click();

    // Vérifier qu'on est sur la page de virement
    transferPage.transferTitle().should('be.visible');

    // ---------------------------
    // Essayer d'effectuer un virement sans sélectionner de bénéficiaire
    // ---------------------------
    transferPage.clickTransferToThirdParty(); // Cliquer sur "Vers un tiers"

    // Sélectionner le compte débiteur par valeur (index ou valeur d'option)
    cy.get('[data-testid="select-from-account"]').select('4'); // Sélectionner le compte (ici par index)

    // Ne pas sélectionner de bénéficiaire
    // On passe directement à la saisie du montant sans sélectionner un bénéficiaire

    // Saisir le montant
    transferPage.enterAmount(transferAmount);

    // Soumettre le virement
    transferPage.submitTransfer();

    // ---------------------------
    // Vérifier le message d'erreur
    // ---------------------------
    cy.get('#transfer-error')  // Sélectionner l'élément contenant le message d'erreur
      .should('be.visible') // Vérifier que l'élément est visible
      .and('contain.text', errorMessage); // Vérifier que le texte est correct
  });
});
