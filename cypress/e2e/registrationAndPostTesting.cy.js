


describe('Login, Visit Post, Add Comment', () => {
 
    beforeEach(() => {
      cy.restoreLocalStorage();
    });
    //Keep cookies for login state
    afterEach(() => {
      cy.saveLocalStorage();
    });

    it('Should visit a post, add a comment, and delete the comment', () => {
     
    cy.visit('http://localhost:3000/auth/login')

    // Type the username and password into the corresponding fields
    cy.get('input[type="email"]').type('demo@unizar.es');
    cy.get('input[type="password"]').type('asd123');
    cy.get('button[class="btn btn-dark"]').click();

    cy.wait(5000);
    // Visit a specific post (assuming the post ID and category are known)
    const postId = 18; 
    const category = 'equipamiento'; 
    cy.visit(`http://localhost:3000/forum/viewThread?thread=${postId}&category=${category}`);

    cy.wait(1000);
    cy.get('button').contains('Responder').click(); // Open reply modal
      cy.wait(1000);
    cy.get('textarea[id="emailCtrl"]').type('This is a comment from CYPRESS');
      cy.wait(1000);
    cy.get('button').contains('☑ Enviar').click(); // Submit comment

    //Check if comment is posted
    cy.get('.card').contains('This is a comment from CYPRESS').should('exist');

  })});
   
