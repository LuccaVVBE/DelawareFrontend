describe("Notifications test", () => {

    beforeEach(() => {
        cy.intercept(
            'GET',
            'http://localhost:9000/notifications', {
                fixture: 'notifications.json',
            },
        );
        cy.login();
        cy.visit("/notifications");
    });


    it("should display unread notifications amount on homescreen", () => {
        cy.get("[data-cy=unreadNotificationsCount]").should("contain", "5");
    });


    it("should display the correct number of notifications", () => {

        cy.get("[data-cy=notifications-list]").children().should("have.length", 10);
    });

    it("should display the correct number of read notifications", () => {
        cy.get(".notification.read").should("have.length", 5);
    });

    it("should mark notification as read when 'Mark as read' is clicked", () => {
        cy.get("[data-cy=markAsRead-button]").first().click({
            force: true
        });
        cy.get(".notification.unread").should("have.length", 4);
        cy.get(".notification.read").should("have.length", 6);
    });

    it("should display the correct notification content", () => {
        cy.get(".notification").first().within(() => {
            cy.get("h3").should("contain", "Status Update");
            cy.get("p").should("contain", "Your order with order id 5 has been shipped");
        });
    });

    it("should sort new to old", () => {
        cy.get(".notification").last().within(() => {
            cy.get("h3").should("contain", "Status Update");
            cy.get("p").should("contain", "Your order with order id 1 has been shipped");
        });
    });

    it('very slow response', () => {
        cy.intercept(
            'http://localhost:9000/notifications',
            (req) => {
                req.on('response', (res) => {
                    res.setDelay(1000);
                });
            },
        ).as('slowResponse');

        cy.get('[data-cy=loading]').should('be.visible');
        cy.wait('@slowResponse');
        cy.get('[data-cy=loading]').should('not.exist');
    });

    it('error from backend', () => {
        cy.intercept(
            'GET',
            'http://localhost:9000/notifications',

            {
                statusCode: 500,
                body: {
                    error: 'internal server error',
                },
            },
        );

        cy.get('[data-cy=error').should('be.visible');
    });

});