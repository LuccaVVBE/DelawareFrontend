describe("Testing tracking", () => {
    it("test empty tracking", () => {
        cy.visit('/');
        cy.get('[data-cy=navTrack]').click();
        cy.get('[data-cy=submitTrack').click();
        cy.get('[data-cy=trackError').should('exist').should("contain", "Tracking number and confirmation number are required");
    });

    it("test faulty tracking", () => {
        cy.visit('/');
        cy.get('[data-cy=navTrack]').click();
        cy.get('[data-cy=trackNumber]').type("123456789");
        cy.get('[data-cy=trackConfirm]').type("123456789");
        cy.get('[data-cy=submitTrack').click();
        cy.get('[data-cy=trackError').should('exist').should("contain", "The track&trace with this id does not exist!");
    });

    it("test correct tracking", () => {
        cy.visit('/');
        cy.get('[data-cy=navTrack]').click();
        cy.get('[data-cy=trackNumber]').type("010511234567890");
        cy.get('[data-cy=trackConfirm]').type("2565");
        cy.get('[data-cy=submitTrack').click();
        cy.get('[data-cy=trackError').should('not.exist');
        cy.get('[data-cy=trackDetails').should('exist');
        cy.get('[data-cy=trackStatus').should('exist').should("contain", "Current status: Received");
        cy.wait(2000).log("Waiting for 2 seconds to see the tracking details")
        cy.get("[data-cy=trackBack]").click();
        cy.get('[data-cy=trackNumber]').should("exist");
        cy.get('[data-cy=trackError]').should("not.exist");
    });
});
        