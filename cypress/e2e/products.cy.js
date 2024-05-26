    describe('Products test', () => {

        beforeEach(() => {
            cy.intercept('http://localhost:9000/products/?language=en', {
                fixture: 'products.json',
            });
            cy.visit('/');
        });

        it('should display correct content', () => {
            let products = require('../fixtures/products.json');
            products.items = products.items.sort((a, b) => {
                return a.productDescription.productName.localeCompare(b.productDescription.productName);
            });

            cy.get('[data-cy=product-list]').within(() => {
                cy.get('[data-cy=product-card]').should('have.length', 23);

                cy.get('[data-cy=product-card]').each(($card, index) => {

                    const item = products.items[index];

                    cy.wrap($card).within(() => {
                        cy.get('[data-cy=product-stock]').should('contain', `Current stock: ${item.stock}`);
                        cy.get('[data-cy=product-name]').should('contain', item.productDescription.productName);
                        cy.get('[data-cy=product-shortDescription]').should('contain', item.productDescription.productShortDescription);
                    });
                });
            });

            // Navigate to a single product page
            cy.get('[data-cy=product-card]').first().click();
            cy.url().should('include', '/products/CL003');

        });


        it('sort by price', () => {
            cy.get('[data-cy="sort-selector"]').select('price-asc');

            cy.get('[data-cy="product-card"]').then((products) => {
                const prices = [...products].map((product) => {
                    return Number(product.dataset.price);
                });
                expect(prices).to.deep.equal(prices.sort((a, b) => a - b));
            });

        });

        it('sort by name', () => {
            cy.get('[data-cy="sort-selector"]').select('name-des');
            cy.get('[data-cy="product-card"]').then((products) => {
                const names = [...products].map((product) => {
                    return product.dataset.name;
                });
                expect(names).to.deep.equal(names.sort().reverse());
            });
        });

        it('very slow response', () => {
            cy.intercept(
                'http://localhost:9000/products/?language=en',
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
                'http://localhost:9000/products/?language=en',

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