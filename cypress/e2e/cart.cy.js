describe("testing cart", () => {
    beforeEach(() => {
        cy.intercept(
            'GET',
            'http://localhost:9000/notifications', {
                fixture: 'notifications.json',
            },
        );
        cy.login();
        cy.visit("/");
    });

    it("add to cart", () => {
        cy.visit('/');
        cy.get('[data-cy=addButton]').first().click({
            force: true
        });
        cy.get('[data-cy=navCart]').click();
        cy.get('[data-cy=cartItem]').should('have.length', 1);
        cy.get('[data-cy=cartCount]').should('contain', "1");
    });

    it("remove from winkelmand", () => {
        window.localStorage.setItem('cart', '[{"id":"CL003","wantedQuantity":1}]')
        cy.visit('/cart');

        cy.get('[data-cy=cartRemove]').first().click();
        cy.get('[data-cy=empty]').should('exist');
        cy.get('[data-cy=cartCount]').should('not.exist');
    });

    it("placing order should not continue to next step untill everything is filled in", {
        scrollBehavior: false
    }, () => {
        cy.reload();
        window.localStorage.setItem('cart', '[{"id":"CL003","wantedQuantity":3}]')
        cy.wait(500).log('wait for cart to be set')
        cy.get('[data-cy=navCart]').click();
        cy.get('[data-cy=orderButton]').click({
            force: true
        });

        cy.get('[data-cy=input-country]').clear({
            force: true
        });
        cy.get('[data-cy=input-zipCode]').clear({
            force: true
        });
        cy.get('[data-cy=input-city]').clear({
            force: true
        });
        cy.get('[data-cy=input-street]').clear({
            force: true
        });
        cy.get('[data-cy=input-houseNum]').clear({
            force: true
        });


        cy.get('[data-cy=next]').click({
            force: true
        });

        cy.get('[data-cy=previous-button]').should('not.exist');

    });

    it("placing order ", {
        scrollBehavior: false
    }, () => {

        cy.reload();
        window.localStorage.setItem('cart', '[{"id":"CL003","wantedQuantity":3}]')
        cy.wait(500).log('wait for cart to be set')
        cy.get('[data-cy=navCart]').click();
        cy.get('[data-cy=orderButton]').click({
            force: true
        });
        cy.get('[data-cy=input-country]').clear({
            force: true
        });
        cy.get('[data-cy=input-zipCode]').clear({
            force: true
        });
        cy.get('[data-cy=input-city]').clear({
            force: true
        });
        cy.get('[data-cy=input-street]').clear({
            force: true
        });
        cy.get('[data-cy=input-houseNum]').clear({
            force: true
        });
        cy.get('[data-cy=input-country]').type('Fantasialand');
        cy.get('[data-cy=input-zipCode]').type(5205);
        cy.get('[data-cy=input-city]').type('city');
        cy.get('[data-cy=input-street]').type('street');
        cy.get('[data-cy=input-houseNum]').type('1&', {
            force: true
        });


        cy.get('[data-cy=next]').click({
            force: true
        });

        cy.get('[data-cy=invoiceSent]').should('contain', 'Invoice sent');
        cy.get('[data-cy=cartCount]').should('not.exist');
    });




});