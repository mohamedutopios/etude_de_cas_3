// cypress/support/pages/TransactionsPage.js
class TransactionsPage {

    // Titre "Dernières transactions"
    recentTransactionsTitle() {
      return cy.get('h3.card-title').contains('Dernières transactions');
    }
  
    // Récupérer la liste des transactions
    transactionsList() {
      return cy.get('.transaction-description'); // toutes les descriptions
    }
  
    // Transaction individuelle par index
    transactionDescription(index) {
      return cy.get('.transaction-description').eq(index);
    }
  
    transactionAmount(index) {
      return cy.get('.transaction-amount').eq(index);
    }
  
    transactionDate(index) {
      return cy.get('.transaction-date').eq(index);
    }
  
    // Vérifier une transaction spécifique
    verifyTransaction(index, description, amount, date) {
      this.transactionDescription(index).should('contain.text', description);
      this.transactionAmount(index).should('contain.text', amount);
      this.transactionDate(index).should('contain.text', date);
    }
  }
  
  export default TransactionsPage;
  