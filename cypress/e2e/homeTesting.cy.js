describe('Home Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/home');
    });
  
    // Verify the loading of top-rated recipes
    it('should load the top-rated recipes', () => {
      cy.contains('h2', 'Top Rated Recipes').should('be.visible'); // Check if the title is visible
      cy.get('.scrollable-row').eq(0).within(() => { // Select the first scrollable row
        cy.get('.card').should('have.length.greaterThan', 0); // Check if there are any cards
      });
    });
  
    // Verify the loading of latest forum posts
    it('should load the latest forum posts', () => {
      cy.contains('h2', 'Latest Forum Posts').should('be.visible'); // Check if the title is visible
      cy.get('.scrollable-row').eq(1).within(() => { // Select the second scrollable row
        cy.get('.card').should('have.length.greaterThan', 0); // Check if there are any cards
      });
    });


  // Verify the loading of random recipes
  it('should load the random recipes', () => {
    cy.contains('h2', 'Random Recipes').should('be.visible'); // Check if the title is visible
    cy.get('.scrollable-row').eq(2).within(() => { // Select the third scrollable row
      cy.get('.card').should('have.length.greaterThan', 0); // Check if there are any cards
    });
  });

  // Verify the loading of most commented posts
  it('should load the most commented posts', () => {
    cy.contains('h2', 'Most Commented Posts').should('be.visible'); // Check if the title is visible
    cy.get('.scrollable-row').eq(3).within(() => { // Select the fourth scrollable row
      cy.get('.card').should('have.length.greaterThan', 0); // Check if there are any cards
    });
  });
});