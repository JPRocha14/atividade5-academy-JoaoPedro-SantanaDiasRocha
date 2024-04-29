import { faker } from '@faker-js/faker';

describe('Listagem de Usuários', function () {
    const name = 'Joao Pedro';
    const email = faker.internet.email().toLowerCase();

    beforeEach(function () {
        cy.visit('');
    });

    describe('Cenário em que usuários estão cadastrados', function () {
        it('Deve permitir visualizar o nome e email dos usuários cadastrados ao entrar no site', function () {
            cy.fixture('./twoUsers.json').then(function (doisUsuarios) {
                // intercept para mochar 2 usuários na lista
                cy.intercept('GET', '/api/v1/users', {
                    statusCode: 200,
                    body: doisUsuarios
                }).as('visibleList');
            });

            cy.wait('@visibleList');

            cy.get('#listaUsuarios').should('be.visible');
            cy.get('.iTvMOa > .sc-dAbbOL > [data-test="userDataName"]').invoke('text').should('equal', 'Nome: Maynard');
            cy.get('.iTvMOa > .sc-dAbbOL > [data-test="userDataEmail"]').invoke('text').should('equal', 'E-mail: ramon80@yahoo.com');;
            cy.get('.cMeuCM > .sc-dAbbOL > [data-test="userDataName"]').invoke('text').should('equal', 'Nome: Name Surname');;
            cy.get('.cMeuCM > .sc-dAbbOL > [data-test="userDataEmail"]').invoke('text').should('equal', 'E-mail: user@example.com');;
        });

    });

    describe('Cenário em que não há usuários cadastrados', function () {
        it('Deve existir a opção de cadastro de usuário se não houver nenhum usuário', function () {
            // intercept para mochar uma lista de usuários vazia
            cy.intercept('GET', '/api/v1/users', {
                statusCode: 200,
                body: [],
            }).as('emptyList');

            cy.wait('@emptyList');

            cy.get('h3').invoke('text').should('equal', 'Ops! Não existe nenhum usuário para ser exibido.');
            cy.get('p').invoke('text').should('equal', 'Cadastre um novo usuário');
            cy.contains('a', 'Cadastre um novo usuário').should('be.visible').click();

            cy.get('#name').type(name);
            cy.get('#email').type(email);
            cy.get('.sc-dAlyuH').should('be.visible').click();

            cy.get('.go3958317564').invoke('text').should('equal', 'Usuário salvo com sucesso!')
        });
    });


    describe('Cenário de validação das páginas de listagem de usuário', function () {
        it('Deve permitir a navegação entre páginas para ver os usuários cadastrados', function () {
            // intercept para mochar mais de 6 usuários e testar a paginação
            cy.fixture('./sixMoreUsers').then(function (usuariosCriados) {
                cy.intercept('GET', '/api/v1/users', {
                    statusCode: 200,
                    body: usuariosCriados
                }).as('nextPage');

            });

            cy.wait('@nextPage');

            cy.get('#listaUsuarios').should('be.visible');

            cy.get('#paginacaoVoltar').should('be.disabled');
            cy.get('#paginacaoAtual').invoke('text').should('equal', '1 de 2');
            cy.get('#paginacaoProximo').should('be.enabled').click();

            cy.get('#listaUsuarios').should('be.visible');

            cy.get('#paginacaoAtual').invoke('text').should('equal', '2 de 2');
            cy.get('#paginacaoProximo').should('be.disabled');
            cy.get('#paginacaoVoltar').should('be.enabled').click();

            cy.get('#listaUsuarios').should('be.visible');
        });

        it('Deve permitir voltar à tela inicial clicando no ícone da Raro no canto superior esquerdo', function () {
            cy.fixture('./multipleUsers.json').then(function (variosUsuarios) {
                cy.intercept('GET', '/api/v1/users', {
                    statusCode: 200,
                    body: variosUsuarios,
                }).as('usuarios');
            });

            cy.wait('@usuarios');

            cy.get('#listaUsuarios').should('be.visible');
            cy.get('#listaUsuarios > :nth-child(1)').should('be.visible');

            cy.get('#paginacaoVoltar').should('be.disabled');
            cy.get('#paginacaoAtual').invoke('text').should('equal', '1 de 3');
            cy.get('#paginacaoProximo').should('be.enabled').dblclick();

            cy.get('#paginacaoAtual').invoke('text').should('equal', '3 de 3');

            cy.get('.sc-eqUAAy').should('be.visible').click();

            cy.wait('@usuarios');
            cy.get('#listaUsuarios > :nth-child(1)').should('be.visible');
        });
    });
})