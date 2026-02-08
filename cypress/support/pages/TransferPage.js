class TransferPage {

    // Onglet Virements
    transferTab() {
        return cy.get('[data-testid="tab-transfer"]'); // Onglet Virements
    }

    // Vérifie que l'on est sur la page de virement
    transferTitle() {
        return cy.get('h2.card-title').should('contain.text', 'Effectuer un virement');
    }

    // Sélectionner le compte débiteur
    selectFromAccount(accountName) {
        cy.get('[data-testid="select-from-account"]').select(accountName); // Sélectionner le compte débiteur
    }

    // Sélectionner le compte créditeur
    selectToAccount(accountName) {
        cy.get('[data-testid="select-to-account"]').select(accountName); // Sélectionner le compte créditeur
    }

    // Saisir le montant
    enterAmount(amount) {
        cy.get('[data-testid="input-amount"]').clear().type(amount); // Sélectionner le champ du montant
    }

    // Cliquer sur le bouton effectuer le virement
    submitTransfer() {
        cy.get('[data-testid="btn-submit-transfer"]').click(); // Bouton pour soumettre le virement
    }

    // -------------------------
    // Méthode complète pour faire un virement
    // -------------------------
    makeTransfer(fromAccount, toAccount, amount) {
        this.selectFromAccount(fromAccount);      // Sélectionner le compte débiteur
        this.selectToAccount(toAccount);          // Sélectionner le compte créditeur
        this.enterAmount(amount);                 // Saisir le montant
        this.submitTransfer();                    // Soumettre le virement
    }

    // Cliquer sur le bouton "Vers un tiers"
    clickTransferToThirdParty() {
        cy.get('[data-testid="btn-transfer-external"]').click(); // Sélecteur du bouton "Vers un tiers"
    }

    // Sélectionner un bénéficiaire (via son IBAN)
    selectBeneficiary(iban) {
        cy.contains('.beneficiary-iban', iban).click(); // Sélecteur de l'IBAN
    }

    // -------------------------
    // Méthode complète pour faire un virement vers un bénéficiaire tiers
    // -------------------------
    makeTransferToThirdParty(fromAccount, beneficiaryIban, amount) {
        this.selectFromAccount(fromAccount);      // Sélectionner le compte débiteur
        this.clickTransferToThirdParty();         // Cliquer sur "Vers un tiers"
        this.selectBeneficiary(beneficiaryIban);  // Sélectionner le bénéficiaire
        this.enterAmount(amount);                 // Saisir le montant
        this.submitTransfer();                    // Soumettre le virement
    }
    
}

export default TransferPage;
