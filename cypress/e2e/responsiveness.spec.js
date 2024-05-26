describe('E2E Tests for Responsiveness', () => {
  const viewports = [
    { device: 'Desktop', width: 1280, height: 800 },
    { device: 'Tablet', width: 768, height: 1024 },
    { device: 'Mobile', width: 375, height: 667 }
  ];

  viewports.forEach(viewport => {
    context(`Testing on ${viewport.device}`, () => {
      beforeEach(() => {
        // Set the viewport size for the device
        cy.viewport(viewport.width, viewport.height);
        // Visit the home page before each test
        // TODO: Update the URL to match your homepage URL
        //cy.visit('/');
        cy.visit('http://localhost:3000'); 
      });

      it(`should display the navbar correctly on ${viewport.device}`, () => {
        // Check the visibility and layout of the navbar
        // TODO: Update 'nav' to match the selector for your navbar
        cy.get('nav').should('be.visible'); 
        if (viewport.device === 'Mobile') {
          // TODO: Update '.menu-toggle' to match the selector for your mobile menu toggle button
          cy.get('nav .menu-toggle').should('be.visible'); 
        } else {
          // TODO: Update '.menu' to match the selector for your full menu
          cy.get('nav .menu').should('be.visible'); 
        }
      });

      it(`should display the home page content correctly on ${viewport.device}`, () => {
        // Check the visibility and layout of the home page content
        // TODO: Update '.hero', '.main-content', and '.footer' to match the selectors for your content sections
        cy.get('.hero').should('be.visible'); 
        cy.get('.main-content').should('be.visible'); 
        cy.get('.footer').should('be.visible'); 
      });

      it(`should display the form correctly on ${viewport.device}`, () => {
        // Navigate to the form page
        // TODO: Update the URL to match your form page URL
        //cy.visit('/form'); 
        cy.visit('http://localhost:3000/form');
        // Check the form fields and button layout
        cy.get('form').should('be.visible');
        // TODO: Update the input selectors to match the names of your form fields
        cy.get('input[name="username"]').should('be.visible'); 
        //cy.get('input[name="email"]').should('be.visible'); 
        cy.get('input[name="password"]').should('be.visible'); 
        cy.get('button[type="submit"]').should('be.visible');
      });

      it(`should display the data list correctly on ${viewport.device}`, () => {
        // Navigate to the data list page
        // TODO: Update the URL to match your data list page URL
        //cy.visit('/data-list');
        cy.visit('http://localhost:3000/data-list');
        // Check the visibility and layout of the data list
        // TODO: Update '.data-list' and '.data-item' to match the selectors for your data list and items
        cy.get('.data-list').should('be.visible'); 
        cy.get('.data-item').should('have.length.at.least', 1); 
      });
    });
  });
});

/*
Explanation of the Tests

Viewport Definitions:
   - Define an array of viewports for desktop, tablet, and mobile devices with appropriate dimensions.

Context for Each Device:
   - Loop through each viewport and create a context block for each device.

Navbar Display:
   - Verify that the navbar is visible on all devices.
   - On mobile, check for the presence of a hamburger menu.
   - On desktop and tablet, check for the full menu visibility.

Home Page Content Display:
   - Verify that the main elements of the home page (hero section, main content, footer) are visible and properly laid out.

Form Display:
   - Navigate to the form page and verify the visibility and layout of form fields and the submit button.

Data List Display:
   - Navigate to the data list page and verify the visibility and layout of the data list and its items.
*/
