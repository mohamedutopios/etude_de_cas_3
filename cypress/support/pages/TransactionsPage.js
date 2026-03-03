// cypress/support/pages/TransactionsPage.js
class TransactionsPage {
    recentTransactionsTitle() {
        return cy.get('h3.card-title').contains('Dernières transactions');
    }

    transactionsList() {
        return cy.get('.transaction-description');
    }

    transactionDescription(index) {
        return cy.get('.transaction-description').eq(index);
    }

    transactionAmount(index) {
        return cy.get('.transaction-amount').eq(index);
    }

    transactionDate(index) {
        return cy.get('.transaction-date').eq(index);
    }

    verifyTransaction(index, description, amount, date) {
        this.transactionDescription(index)
            .invoke('text')
            .then((t) => {
                expect(t.trim().replace(/\u00A0/g, ' ')).to.include(description);
            });
        this.transactionAmount(index)
            .invoke('text')
            .then((t) => {
                expect(t.trim().replace(/\u00A0/g, ' ')).to.equal(amount);
            });
        this.transactionDate(index)
            .invoke('text')
            .then((t) => {
                expect(t.trim().replace(/\u00A0/g, ' ')).to.include(date);
            });
    }
}

export default TransactionsPage;
