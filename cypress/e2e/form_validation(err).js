describe('E2E Tests for Forms and Validations', () => {
  beforeEach(() => {
      // Ensure we start from the form page before each test
      cy.visit('http://localhost:3000/form'); // TODO: Update this URL to your form page
  });

  it('should submit the form with valid data', () => {
      cy.get('input[name="username"]').type('valid_user'); // TODO: Update this selector if necessary
      //cy.get('input[name="email"]').type('valid_user@example.com'); // TODO: Update this selector if necessary
      cy.get('input[name="password"]').type('ValidPassword123!'); // TODO: Update this selector if necessary
      cy.get('button[type="submit"]').click(); // TODO: Update this selector if necessary

      // Check that the form was submitted successfully
      cy.url().should('include', 'http://localhost:3000/success'); // TODO: Update this URL part if necessary
      cy.get('.success-message').should('contain', 'Form submitted successfully'); // TODO: Update this selector and message if necessary
  });

  it('should display error messages for empty form fields', () => {
      cy.get('button[type="submit"]').click(); // TODO: Update this selector if necessary

      // Check that error messages are displayed for required fields
      cy.get('.error-message').should('contain', 'Username is required'); // TODO: Update this selector and message if necessary
      //cy.get('.error-message').should('contain', 'Email is required'); // TODO: Update this selector and message if necessary
      cy.get('.error-message').should('contain', 'Password is required'); // TODO: Update this selector and message if necessary
  });

  it('should display an error message for invalid email', () => {
      cy.get('input[name="username"]').type('valid_user'); // TODO: Update this selector if necessary
      //cy.get('input[name="email"]').type('invalid_email'); // TODO: Update this selector if necessary
      cy.get('input[name="password"]').type('password123'); // TODO: Update this selector if necessary
      cy.get('button[type="submit"]').click(); // TODO: Update this selector if necessary

      // Check that an error message is displayed for the invalid email
      //cy.get('.error-message').should('contain', 'Please enter a valid email address'); // TODO: Update this selector and message if necessary
  });

  it('should display an error message for short password', () => {
      cy.get('input[name="username"]').type('admin'); // TODO: Update this selector if necessary
      //cy.get('input[name="email"]').type('valid_user@example.com'); // TODO: Update this selector if necessary
      cy.get('input[name="password"]').type('short'); // TODO: Update this selector if necessary
      cy.get('button[type="submit"]').click(); // TODO: Update this selector if necessary

      // Check that an error message is displayed for the short password
      cy.get('.error-message').should('contain', 'Password must be at least 8 characters long'); // TODO: Update this selector and message if necessary
  });

  it('should display an error message for weak password', () => {
      cy.get('input[name="username"]').type('admin'); // TODO: Update this selector if necessary
      //cy.get('input[name="email"]').type('valid_user@example.com'); // TODO: Update this selector if necessary
      cy.get('input[name="password"]').type('password'); // TODO: Update this selector if necessary
      cy.get('button[type="submit"]').click(); // TODO: Update this selector if necessary

      // Check that an error message is displayed for the weak password
      //cy.get('.error-message').should('contain', 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'); // TODO: Update this selector and message if necessary
  });
});

/* 
Explanation of the Tests

Form Submission with Valid Data:
 - Fill in the form fields with valid data.
 - Submit the form.
 - Verify that the URL includes `/success`.
 - Check that a success message is displayed.

Error Messages for Empty Form Fields:
 - Submit the form without filling in any fields.
 - Verify that error messages are displayed for each required field (username, email, password).

Error Message for Invalid Email:
 - Fill in the form with a valid username and password but an invalid email.
 - Submit the form.
 - Verify that an error message is displayed for the invalid email.

Error Message for Short Password:
 - Fill in the form with a valid username and email but a short password.
 - Submit the form.
 - Verify that an error message is displayed for the short password.

Error Message for Weak Password:
 - Fill in the form with a valid username and email but a weak password (e.g., "password").
 - Submit the form.
 - Verify that an error message is displayed for the weak password, indicating the need for a mix of characters.
*/
