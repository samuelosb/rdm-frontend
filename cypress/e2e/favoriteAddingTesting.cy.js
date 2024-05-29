describe('Favorite Recipe Functionality', () => {
  before(() => {
    // Visit the login page and authenticate
    cy.visit('http://localhost:3000/auth/login');
    cy.get('input[name="email"]').type('demo@unizar.es');
    cy.get('input[name="password"]').type('asd123');
    cy.get('button[type="submit"]').click();
  });

  it('should add a recipe to favorites', () => {
    // Visit the specific recipe page
    cy.visit('/viewRecipe?r=pizza-dough-90bb7ec3d3c94c41809d5c871d4421b1/search=Pizza+Dough'); // Change with the actual recipe ID you want to test

    // Click the button to add the recipe to favorites
    cy.get('button').contains('Add to favorites').click(); // Ensure this selector matches your code
    cy.get('img[src="heart.png"]').should('exist'); // Verify that the heart icon is present

    // Go to the favorites page
    cy.visit('http://localhost:3000/favorites');

    // Verify that the recipe is present in the favorites list
    cy.get('a[href="/viewRecipe?r=pizza-dough-90bb7ec3d3c94c41809d5c871d4421b1/search=Pizza+Dough"]') // Ensure this selector matches your code
    .should('exist'); // Check if the link to the specific recipe exists in the favorites list

  });
});