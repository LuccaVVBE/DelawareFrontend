describe('Categories test', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.intercept(
            'GET',
            'http://localhost:9000/product-categories', {
                fixture: 'categories.json',
            },
        );
        cy.intercept(
            'GET',
            'http://localhost:9000/products/&language=en', {
                fixture: 'products.json',
            },
        );
    })

    it('displays all categories and "All products" option', () => {
        cy.get('[data-cy="nav-category-selector"]').should('exist')
        cy.get('[data-cy="nav-category-selector"]').select(0).invoke('val').should('eq', '0')
        cy.get('[data-cy="nav-category-selector"]').contains('Electronics')
        cy.get('[data-cy="nav-category-selector"]').contains('Sports & Outdoors')
    })

    it('can select a category', () => {
        cy.get('[data-cy="nav-category-selector"]').select('2')
        cy.get('[data-cy="nav-category-selector"]').should('have.value', '2')
        cy.get('[data-cy="category-option-2"]').should('be.selected')
    })

    // BUG: not working in chrome
    // it('can navigate to home page when "All products" option is selected', () => {
    //     cy.visit('/products/CL003/') // go to a product page
    //     cy.get('[data-cy="nav-category-selector"]').select(0) // select "All products" option
    //     cy.url().should('eq', '/') // make sure the URL is the home page
    // })

    it('select category should only show products from that category', () => {
        cy.get('[data-cy="nav-category-selector"]').select('1')
        cy.get('[data-cy=product-card]').should('have.length', 4)
        cy.get('[data-cy=product-card-infoEL001]').should('exist')
        cy.get('[data-cy=product-card-infoEL002]').should('exist')
        cy.get('[data-cy=product-card-infoEL003]').should('exist')
        cy.get('[data-cy=product-card-infoEL004]').should('exist')
    })
})