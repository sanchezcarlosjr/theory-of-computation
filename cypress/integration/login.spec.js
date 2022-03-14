describe('Login', () => {
    beforeEach(() => {
        cy.clear_browser();
    });
    it('should login with Email and Password', () => {
        cy.login();
        cy.url().should('include', '/#/grammars');
    });
});