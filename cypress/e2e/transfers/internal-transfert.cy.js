import LoginPage from '../../support/pages/LoginPage';
import DashboardPage from '../../support/pages/DashboardPage';
import TransferPage from '../../support/pages/TransferPage';

describe('Virements entre comptes propres', () => {
    const loginPage = new LoginPage();
    const dashboardPage = new DashboardPage();
    const transferPage = new TransferPage();

    beforeEach(() => {
        // Charger la fixture transfer.json contenant les données nécessaires
        cy.fixture('transfer').as('transferData');
        cy.fixture('success-message').as('successMessages'); // Charger les messages de succès
        cy.visit('http://127.0.0.1:8080/index.html'); // Page de connexion
    });

    it('Doit effectuer un virement du compte courant vers le Livret A', function () {
        const user = this.transferData.balanceUser; // Accéder aux données de l'utilisateur depuis transfer.json
        const transferAmount = user.transfer.amount; // Montant du virement depuis la fixture

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
        // Effectuer le virement
        // ---------------------------
        transferPage.makeTransfer(
            'Compte Courant - 5 000,00 €',  // Compte débiteur
            'Livret A - 15 000,00 €',       // Compte créditeur
            transferAmount                   // Montant depuis la fixture
        );

        // ---------------------------
        // Vérifier le message de succès
        // ---------------------------
        cy.get('#transfer-success') 
            .should('be.visible')
            .and('contain.text', this.successMessages.transfer.success); // Vérifier que le texte est correct en utilisant la fixture
    });

    it('Doit afficher un message d\'erreur en cas de solde insuffisant', function () {
        const user = this.transferData.balanceUser; // Accéder aux données de l'utilisateur depuis transfer.json
        const insufficientAmount = this.transferData.balanceUser.insufficientBalanceTransfer.amount; // Montant du transfert avec solde insuffisant
        
        // Charger le message d'erreur depuis la fixture
        cy.fixture('error-message').then((errors) => {
            const insufficientBalanceError = errors.transfer.insufficientBalance; // Récupérer le message d'erreur de la fixture

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
            // Essayer d'effectuer le virement avec un solde insuffisant
            // ---------------------------
            transferPage.makeTransfer(
                'Compte Courant - 5 000,00 €',  // Compte débiteur
                'Livret A - 15 000,00 €',       // Compte créditeur
                insufficientAmount               // Montant du transfert avec solde insuffisant
            );

            // ---------------------------
            // Vérifier le message d'erreur de solde insuffisant
            // ---------------------------
            cy.get('#transfer-error') 
                .should('be.visible')
                .and('contain.text', insufficientBalanceError); // Message d'erreur attendu
        });
    });
});
