/*
  File for E2E Testing.
  The test must be run with the backend and the frontend up and running.
  The test opens the web application, type a recipe's name on the search bar, 
  and check if the correct results are returned 
*/

describe('Search Recipe Test', () => {
  it('Open the page, check if it renders and make a search', () => {
    
    // Opens the frontend page, 
    // and waits a couple of ms for it to load
    cy.visit('http://localhost:3000')
   

    // Check if the search bar is correctly rendered, and tries to type 'pizza' on it
    cy.get("input[type='search']").should("exist");    

    cy.get("input[type='search']").type("pizza");

    // Click on the search button
    cy.get('button[type="submit"]').click()

    //The navigation route must have changed to search/results, with the query 'pizza'
    cy.url().should("include", "/search/results");
    cy.url().should("include", "pizza");

    //A result list must be returned
    cy.contains("Pizza Dough").should("exist");
    cy.contains("Pizza Frizza").should("exist");

    //Search made correctly and results returned

  })

})