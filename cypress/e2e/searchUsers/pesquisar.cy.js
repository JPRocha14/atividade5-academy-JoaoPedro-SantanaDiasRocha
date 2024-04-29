import { faker } from '@faker-js/faker';

describe('Pesquisa de Usuários', function () {
    beforeEach(function () {
        cy.visit('https://rarocrud-frontend-88984f6e4454.herokuapp.com/users');
    });

    var nome;
    var email;

    describe('Pesquisa por nome', function () {
        it('Deve permitir pesquisar usuários pelo nome', function () {
            nome = faker.person.firstName();
            email = faker.internet.email().toLowerCase();

            cy.intercept('POST', '/api/v1/users').as('postUsers');

            cy.contains('a[href="/users/novo"]', 'Novo').should('be.visible').click();

            cy.get('#name').type(nome);
            cy.get('#email').type(email);
            cy.get('.sc-dAlyuH').click();
            cy.wait('@postUsers');

            cy.contains('Voltar').should('be.visible').click();

            cy.get('.sc-gsFSXq').click().type(nome);
            cy.wait(2000);
            cy.get('#userDataDetalhe').should('be.visible').click();
            cy.get('#userName').should('be.visible').invoke('val').should('equal', nome);
            cy.get('#userEmail').should('be.visible').invoke('val').should('equal', email);
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
            nome = faker.person.firstName();
            email = faker.internet.email().toLowerCase();

            cy.intercept('POST', '/api/v1/users').as('postUsers');

            cy.contains('a[href="/users/novo"]', 'Novo').should('be.visible').click();

            cy.get('#name').type(nome);
            cy.get('#email').type(email);
            cy.get('.sc-dAlyuH').click();
            cy.wait('@postUsers');

            cy.contains('Voltar').should('be.visible').click();

            cy.get('.sc-gsFSXq').click().type(email);
            cy.wait(2000);
            cy.get('#userDataDetalhe').should('be.visible').click();
            cy.get('#userName').should('be.visible').invoke('val').should('equal', nome);
            cy.get('#userEmail').should('be.visible').invoke('val').should('equal', email);
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