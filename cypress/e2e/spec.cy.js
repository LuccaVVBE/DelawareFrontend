describe("spec", () => {

  // beforeEach(() => {
  //   cy.login();
  // });

  it("draait de applicatie", () => {
    cy.visit('/');
    cy.get('header').should('exist');
  });
});