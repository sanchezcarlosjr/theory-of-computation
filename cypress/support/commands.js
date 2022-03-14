Cypress.Commands.add('login', (email=Cypress.env('USER_EMAIL'), password=Cypress.env('USER_PASSWORD')) => {
    cy.visit('https://theory-of-computation-uabc.sanchezcarlosjr.com/app/#/login');
    cy.get('#username').type(email);
    cy.get('#password').type(password);
    cy.get('.MuiButtonBase-root').click();
    cy.get('div:nth-child(2) > form').submit();
});

Cypress.Commands.add('clear_browser', () => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
        win.sessionStorage.clear();
    });
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
});

