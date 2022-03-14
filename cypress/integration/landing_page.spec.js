describe('landing page', () => {
    before(() => {
        cy.clear_browser();
    });
    it('should render landing page', () => {
        cy.visit('https://theory-of-computation-uabc.sanchezcarlosjr.com');
        cy.get('h1').should('include.text', 'Learn about Theory of computation, doing.')
    });
    it('should visit app when user clicks login', () => {
        cy.visit('https://theory-of-computation-uabc.sanchezcarlosjr.com');
        cy.contains('Sign in free').click();
        cy.url().should('include', '/app/#/login');
    });
});