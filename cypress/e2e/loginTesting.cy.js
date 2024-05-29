/*
Login Test: This test verifies that users can successfully 
log into the application using valid usernames and passwords. It ensures that the 
authentication process functions smoothly and that users can access appropriate resources 
after logging in.
*/


describe('Login Test', () => {
  it('Should successfully login with correct username and password', () => {
    // Visit the login page
    cy.visit('http://localhost:3000/auth/login')

    // Type the username and password into the corresponding fields
    cy.get('input[type="email"]').type('demo@unizar.es');
    cy.get('input[type="password"]').type('asd123');
    cy.get('button[class="btn btn-dark"]').click();
    cy.wait(2000);
    // Submit the login form
    cy.contains('Login invalid').should('not.exist')

  })

  it('Should display an error message with incorrect credentials', () => {
    // Visit the login page
    cy.visit('http://localhost:3000/auth/login')

    // Type incorrect credentials
    cy.get('input[type="email"]').type('incorrect@user.es')
    cy.get('input[type="password"]').type('incorrectpassword')

    // Submit the login form
    cy.get('button[class="btn btn-dark"]').click();

    // Check if an error message is displayed
    cy.contains('Login invalid').should('be.visible')
  })
})