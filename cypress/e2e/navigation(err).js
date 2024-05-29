describe('E2E Tests for Navigation', () => {
  beforeEach(() => {
      // Ensure we start from the home page before each test
      cy.visit('http://localhost:3000'); // TODO: Make sure this URL is correct for your home page
  });

  it('should navigate to different pages of the application', () => {
      // Test navigation to the About page
      cy.get('a[href="http://localhost:3000/about"]').click(); // TODO: Update this URL to your About page
      cy.url().should('include', '/about');
      cy.get('h1').should('contain', 'About Us'); // TODO: Make sure this header content is correct

      // Test navigation to the Contact page
      //cy.get('a[href="/contact"]').click(); // TODO: Update this URL to your Contact page
      //cy.url().should('include', '/contact');
      //cy.get('h1').should('contain', 'Contact Us'); // TODO: Make sure this header content is correct

      // Test navigation back to the Home page
      cy.get('a[href="http://localhost:3000"]').click(); // TODO: Make sure this URL is correct for your home page
      cy.url().should('include', '/');
      cy.get('h1').should('contain', 'Welcome'); // TODO: Make sure this header content is correct
  });

  it('should verify that all internal links work correctly', () => {
      // Define a list of internal links and their expected destinations
      const links = [
          { selector: 'a[href="http://localhost:3000/about"]', urlPart: '/about', header: 'About Us' }, // TODO: Update the details of this link
          //{ selector: 'a[href="/contact"]', urlPart: '/contact', header: 'Contact Us' }, // TODO: Update the details of this link
          //{ selector: 'a[href="/services"]', urlPart: '/services', header: 'Our Services' } // TODO: Update the details of this link
      ];

      // Loop through each link and perform the test
      links.forEach(link => {
          cy.get(link.selector).click();
          cy.url().should('include', link.urlPart);
          cy.get('h1').should('contain', link.header);
          cy.go('back'); // Go back to the previous page to test the next link
      });
  });

  it('should access specific pages directly via URL', () => {
      // Directly navigate to the About page
      cy.visit('http://localhost:3000/about'); // TODO: Make sure this URL is correct for your About page
      cy.url().should('include', '/about');
      cy.get('h1').should('contain', 'About Us'); // TODO: Make sure this header content is correct

      // Directly navigate to the Contact page
      //cy.visit('/contact'); // TODO: Make sure this URL is correct for your Contact page
      //cy.url().should('include', '/contact');
      //cy.get('h1').should('contain', 'Contact Us'); // TODO: Make sure this header content is correct

      // Directly navigate to the Services page
      //cy.visit('/services'); // TODO: Make sure this URL is correct for your Services page
      //cy.url().should('include', '/services');
      //cy.get('h1').should('contain', 'Our Services'); // TODO: Make sure this header content is correct
  });
});

/*
Explanation of the Tests

1. Basic Navigation:
 - Visit the home page.
 - Click on links to navigate to different pages (`/about`, `/contact`, etc.).
 - Verify that the URL changes accordingly and that the correct content is displayed on each page.
 - Navigate back to the home page and verify its content.

2. Internal Links:
 - Define a list of internal links with their selectors, expected URL parts, and headers.
 - Iterate through each link:
   - Click the link.
   - Verify that the URL includes the expected URL part.
   - Check that the page header matches the expected content.
   - Go back to the previous page to test the next link.

3. Direct URL Access:
 - Directly visit specific URLs (`/about`, `/contact`, `/services`).
 - Verify that the URL includes the expected path.
 - Check that the correct content is displayed on each page.
*/
