describe('Product test', () => {
    it('raadpleeg 1 product', () => {
        cy.intercept('GET', 'http://localhost:9000/products/CL003?language=en', {
            fixture: 'product.json'
        });
        cy.visit('/', {
            onBeforeLoad(win) {
                win.localStorage.setItem('cart', '[{"id":"CL003","wantedQuantity":3}]')
            },
        })
        cy.get('[data-cy=product-card-infoCL003]').click({
            force: true
        });

        cy.get('[data-cy=product-name]').should('contain', `Adidas Women's Ultraboost Running Shoes`);
        cy.get('[data-cy=product-price]').should('contain', `99.99 EUR`);
        cy.get('[data-cy="product-wantedQuantity"]').should('contain', `3`);
        cy.get('[data-cy="product-stock"]').should('contain', `Stock: 15`);
        cy.get('[data-cy="product-eta"]').should('contain', `Estimated shipping time: 10 days`);
        cy.get('[data-cy="product-description"]').should('contain', `The Adidas Women's Ultraboost Running Shoes are designed to provide comfort and support for your feet during your runs. They feature a Primeknit upper, a responsive Boost midsole, and a flexible outsole.`);
    });


    it('add and remove buttons', {
        scrollBehavior: false
    }, () => {
        cy.intercept('GET', 'http://localhost:9000/products/CL003?language=en', {
            fixture: 'product.json'
        });
        cy.intercept('GET', 'http://localhost:9000/products?language=en', {
            fixture: 'products.json'
        });
        cy.visit('/products/CL003', {
            onBeforeLoad(win) {
                win.localStorage.setItem('cart', '[{"id":"CL003","wantedQuantity":3}]')
            },
        });



        // click 16 times (allowed to go over stock as specified by the client)
        for (let i = 0; i < 13; i++) {
            cy.get('[data-cy="product-add"]').click();
        }

        // check if the wantedQuantity is 15
        cy.get('[data-cy="product-wantedQuantity"]').should('contain', `16`);

        // click remove one too many times
        for (let i = 0; i < 17; i++) {
            cy.get('[data-cy="product-remove"]').click();
        }

        // check if the wantedQuantity is 0
        cy.get('[data-cy="product-wantedQuantity"]').should('contain', `0`);
    });


    it('very slow response', () => {
        cy.intercept(
            'http://localhost:9000/products/CL003?language=en',
            (req) => {
                req.on('response', (res) => {
                    res.setDelay(2000);
                });
            },
        ).as('slowResponse');
        cy.visit('/products/CL003');
        cy.get('[data-cy=loading]').should('be.visible');
        cy.wait('@slowResponse');
        cy.get('[data-cy=loading]').should('not.exist');
    });

    it('error from backend', () => {
        cy.intercept(
            'GET',
            'http://localhost:9000/products/CL003?language=en',

            {
                statusCode: 500,
                body: {
                    error: 'internal server error',
                },
            },
        );
        cy.visit('/products/CL003');
        cy.get('[data-cy=error').should('be.visible');
    });
});