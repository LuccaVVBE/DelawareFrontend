describe('Order test', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.login();
        cy.reload()
    });

    it('raadpleeg laatste order', () => {
        cy.intercept('GET', 'http://localhost:9000/orders/?language=en', {
            fixture: 'orders.json'
        });
        cy.get('[data-cy=navOrders]').click();
        cy.get('[data-cy=orderCard]').first().should('exist');
        cy.get('[data-cy=orderInfoButton]').first().click({force: true});
        cy.get('[data-cy=orderInfo]').should('exist');
        cy.get('[data-cy="amountItemsOrder"]').should('contain', `1 ITEM`);
        cy.get('[data-cy="orderProductName"]').first().should('contain', `Samsung Galaxy S22 Ultra`);
    });

    it('very slow response', () => {
        cy.intercept(
            'http://localhost:9000/orders/?language=en',
            (req) => {
                req.on('response', (res) => {
                    res.setDelay(1000);
                });
            },
        ).as('slowResponse');
        cy.get('[data-cy=navOrders]').click();

        cy.get('[data-cy=loading]').should('be.visible');
        cy.wait('@slowResponse');
        cy.get('[data-cy=loading]').should('not.exist');
    });

    it('error from backend', () => {
        cy.intercept(
            'GET',
            'http://localhost:9000/orders/?language=en',

            {
                statusCode: 500,
                body: {
                    error: 'internal server error',
                },
            },
        );
        cy.get('[data-cy=navOrders]').click();

        cy.get('[data-cy=error').should('be.visible');
    });
        
    })