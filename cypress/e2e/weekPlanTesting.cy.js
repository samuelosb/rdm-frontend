describe('WeekPlan Page - Adding and Deleting Recipes', () => {
   
    beforeEach(() => {
        cy.restoreLocalStorage();
    });
    //Keep cookies for login state
    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('Login, and add a recipe to week plan', () => {
        // Login
        cy.visit('http://localhost:3000/auth/login');
        cy.get('input[type="email"]').type('demo@unizar.es');
        cy.get('input[type="password"]').type('asd123');
        cy.get('button[class="btn btn-dark"]').click();
        cy.wait(3000); // Wait to ensure login is completed

        const recipeToAdd = 'b2ebad01df2a319d259c2d3f61eb40c5'; // Replace with the URI of the recipe to add
        // Loads the details view of a selected recipe
        cy.visit(`http://localhost:3000/viewRecipe?r=${recipeToAdd}`);

        cy.wait(4000); // Wait to ensure recipe loading is completed
        cy.get('img[src="calendar.png"]').click(); 
        cy.wait(500); // Wait a bit
        //Tries to add it to the monday plan
        cy.get('img[src="mon.png"]').click(); 
        cy.wait(1000); // Wait a bit
        cy.visit('http://localhost:3000/weekPlan');

        cy.wait(2000); // Wait a bit
        // Check if recipe exixsts in week menu
        cy.get('div').contains("Margarita Pizza With Fresh Mozzarella").should('exist');


        /*// Simulate deleting a recipe from the weekPlan
        // For this test, we will use the URI as a unique identifier for the recipe.

        const recipeToDelete = 'pizza-dough-90bb7ec3d3c94c41809d5c871d4421b1/search=Pizza+Dough'; // Replace with the URI of the recipe to delete

        // Simulate deleting the recipe from the weekPlan
        cy.intercept('DELETE', '*delWeekMenu').as('deleteRecipe');
        cy.get('button').contains('Delete').click(); // Replace with the correct selector for the button to delete a recipe
        cy.wait('@deleteRecipe');
        cy.get('div').contains(recipeToDelete).should('not.exist');*/
    });
});
