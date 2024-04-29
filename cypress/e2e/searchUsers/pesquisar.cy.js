describe('Pesquisa de Usuários', function () {
    beforeEach(function () {
        cy.visit('');
    });
    describe('Pesquisa por nome', function () {
        it('Deve permitir pesquisar usuários pelo nome', function () {
            cy.fixture('./multipleUsers.json').then(function (usuariosCriados) {
                cy.intercept('GET', '/api/v1/users', {
                    statusCode: 200,
                    body: usuariosCriados
                }).as('getUsers');
            });

            cy.wait('@getUsers');

            cy.get('.sc-gsFSXq').click().type('Coxinha');
            cy.wait(2000);
            cy.get('#userDataDetalhe').should('be.visible').click();
            cy.get('[name="id"]').should('be.visible').invoke('val').should('equal', '5ba50491-e2ba-4641-874c-41ec413e09a2');
            cy.get('#userName').should('be.visible').invoke('val').should('equal', 'Coxinha');;
            cy.get('#userEmail').should('be.visible').invoke('val').should('equal', 'coxinha@dog.com');
        });

        it('Não deve aparecer nenhum usuário ao pesquisar por nome não cadastrado', function () {
            cy.fixture('./sixMoreUsers.json').then(function (usuariosCriados) {
                cy.intercept('GET', '/api/v1/users', {
                    statusCode: 200,
                    body: usuariosCriados
                }).as('getUsers');
            });

            cy.wait('@getUsers');

            cy.get('.sc-gsFSXq').click().type('Nome que nao existe');

            cy.get('h3').invoke('text').should('equal', 'Ops! Não existe nenhum usuário para ser exibido.');
            cy.get('p').invoke('text').should('equal', 'Cadastre um novo usuário');
        });
    });

    describe('Pesquisa por email', function () {
        it('Deve permitir pesquisar usuários pelo email', function () {
            cy.fixture('./sixMoreUsers.json').then(function (usuariosCriados) {
                cy.intercept('GET', '/api/v1/users', {
                    statusCode: 200,
                    body: usuariosCriados
                }).as('getUsers');
            });

            cy.wait('@getUsers');

            cy.get('.sc-gsFSXq').type('albina.mayert45@gmail.com');
            cy.wait(2000);
            cy.get('#userDataDetalhe').should('be.visible').click();
            cy.get('[name="id"]').should('be.visible').invoke('val').should('equal', '8d3822ed-6f52-42a4-bea6-c02dd576b8e7');
            cy.get('#userName').should('be.visible').invoke('val').should('equal', 'Harry');;
            cy.get('#userEmail').should('be.visible').invoke('val').should('equal', 'albina.mayert45@gmail.com');
        });

        it('Não deve aparecer usuário ao pesquisar por email não cadastrado', function () {
            cy.fixture('./sixMoreUsers.json').then(function (usuariosCriados) {
                cy.intercept('GET', '/api/v1/users', {
                    statusCode: 200,
                    body: usuariosCriados
                }).as('getUsers');
            });

            cy.wait('@getUsers');

            cy.get('.sc-gsFSXq').click().type('emailinexistente@gmail.com');

            cy.get('h3').invoke('text').should('equal', 'Ops! Não existe nenhum usuário para ser exibido.');
            cy.get('p').invoke('text').should('equal', 'Cadastre um novo usuário');
        });
    });
})