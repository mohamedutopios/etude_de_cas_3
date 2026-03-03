class DashboardPage {

    // -------------------------
    // Éléments de bienvenue
    // -------------------------
    dashboardGreeting() {
        return cy.get('h2.card-title'); // sélectionne "Bonjour, Utilisateur 👋"
    }
    
    // Pour vérifier un nom précis
    verifyGreeting(name) {
        this.dashboardGreeting()
            .should('be.visible')
            .and('contain.text', `Bonjour, ${name}`);
    }

    // -------------------------
    // Solde du compte courant
    // -------------------------
    currentAccountBalance() {
        return cy.get('[data-testid="balance-4"]');
    }

    // -------------------------
    // Solde du Livret A
    // -------------------------
    savingsAccountBalance() {
        return cy.get('[data-testid="balance-5"]');
    }

    // Méthode pour vérifier que les soldes sont visibles
    verifyBalancesAreVisible() {
        this.currentAccountBalance().should('be.visible');
        this.savingsAccountBalance().should('be.visible');
    }

    // Méthode pour vérifier les montants exacts
verifyAccountBalances(expectedCurrent, expectedSavings) {
    this.currentAccountBalance()
        .invoke('text')
        .then((text) => {
            const cleaned = text.trim().replace(/\u00A0/g, ' ').replace(/\s+/g, ' ');
            const expected = expectedCurrent.trim().replace(/\u00A0/g, ' ').replace(/\s+/g, ' ');
            expect(cleaned).to.equal(expected);
        });
    this.savingsAccountBalance()
        .invoke('text')
        .then((text) => {
            const cleaned = text.trim().replace(/\u00A0/g, ' ').replace(/\s+/g, ' ');
            const expected = expectedSavings.trim().replace(/\u00A0/g, ' ').replace(/\s+/g, ' ');
            expect(cleaned).to.equal(expected);
        });
}

    // -------------------------
    // Cliquer sur le compte courant
    // -------------------------
    clickCurrentAccount() {
        cy.get('[data-testid="balance-4"]').click();
    }

    // -------------------------
    // Vérifier les soldes après un virement
    // -------------------------
    verifyUpdatedBalances(expectedCurrent, expectedSavings) {
        this.currentAccountBalance()
            .should('be.visible')
            .and('contain.text', expectedCurrent);

        this.savingsAccountBalance()
            .should('be.visible')
            .and('contain.text', expectedSavings);
    }

} 

export default DashboardPage; 
