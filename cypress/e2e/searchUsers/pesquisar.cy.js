import { faker } from '@faker-js/faker';
import CadastroPage from '../../support/pages/cadastro.page';
import PaginaInicial from '../../support/pages/paginaInicial.page';
import PaginaEdicao from '../../support/pages/paginaEdicao.page';

describe('Pesquisa de Usuários', function () {
    var nome;
    var email;
    var cadastroPagina = new CadastroPage();
    var paginaInicial = new PaginaInicial();
    var paginaEdicao = new PaginaEdicao();

    beforeEach(function () {
        cy.visit('https://rarocrud-frontend-88984f6e4454.herokuapp.com/users');
    });

    describe('Pesquisa por nome', function () {
        it.only('Deve permitir pesquisar usuários pelo nome', function () {
            nome = 'Joao';
            email = faker.internet.email().toLowerCase();

            cy.intercept('POST', '/api/v1/users', {
                statusCode: 201,
                body: {
                    id: "4c31d974-da0c-429a-9442-40a5ca6a9d80",
                    name: nome,
                    email: email,
                    updatedAt: "2024-04-30T14:58:42.324Z",
                    createdAt: "2024-04-30T14:58:42.324Z"
                },
            },
            ).as('postUsers');

            cy.intercept('GET', '/api/v1/users', {
                statusCode: 200,
                body: [
                    {
                        id: "4c31d974-da0c-429a-9442-40a5ca6a9d80",
                        name: nome,
                        email: email,
                        updatedAt: "2024-04-30T14:58:42.324Z",
                        createdAt: "2024-04-30T14:58:42.324Z"
                    },
                ],
            }).as('getUsers');

            cy.intercept('GET', '/api/v1/users/4c31d974-da0c-429a-9442-40a5ca6a9d80', {
                statusCode: 200,
                body:
                {
                    id: "4c31d974-da0c-429a-9442-40a5ca6a9d80",
                    name: nome,
                    email: email,
                    updatedAt: "2024-04-30T14:58:42.324Z",
                    createdAt: "2024-04-30T14:58:42.324Z"
                },
            }).as('getUserId');

            // cy.intercept('GET', 'https://rarocrud-80bf38b38f1f.herokuapp.com/api/v1/search?value=' + nome, {
            //     statusCode: 200,
            //     body: [
            //         {
            //             id: "4c31d974-da0c-429a-9442-40a5ca6a9d80",
            //             name: nome,
            //             email: email,
            //             updatedAt: "2024-04-30T14:58:42.324Z",
            //             createdAt: "2024-04-30T14:58:42.324Z"
            //         }
            //     ]
            // }).as('getUserName');

            paginaInicial.clickButtonNovo();

            // criando usuário para pesquisar depois
            cadastroPagina.typeNome(nome);
            cadastroPagina.typeEmail(email);

            cadastroPagina.clickButtonSalvar();
            cy.wait('@postUsers');

            cadastroPagina.clickButtonVoltar();
            cy.wait('@getUsers');

            paginaInicial.clickButtonPesquisa(nome);
            // cy.wait('@getUserName');

            paginaInicial.clickButtonVerDetalhes();
            cy.wait('@getUserId');

            cy.get(paginaEdicao.inputNome).should('be.visible').invoke('val').should('equal', nome);
            cy.get(paginaEdicao.inputEmail).should('be.visible').invoke('val').should('equal', email);
        });

        it('Não deve aparecer nenhum usuário ao pesquisar por nome não cadastrado', function () {
            cy.fixture('./sixMoreUsers.json').then(function (usuariosCriados) {
                cy.intercept('GET', '/api/v1/users', {
                    statusCode: 200,
                    body: usuariosCriados
                }).as('getUsers');
            });

            cy.wait('@getUsers');

            paginaInicial.clickButtonPesquisa('Nome que nao existe');

            cy.get('h3').invoke('text').should('equal', 'Ops! Não existe nenhum usuário para ser exibido.');
            cy.get('p').invoke('text').should('equal', 'Cadastre um novo usuário');
        });
    });

    describe('Pesquisa por email', function () {
        it('Deve permitir pesquisar usuários pelo email', function () {
            nome = faker.person.firstName();
            email = faker.internet.email().toLowerCase();

            cy.intercept('POST', '/api/v1/users').as('postUsers');

            paginaInicial.clickButtonNovo();

            // criando usuário para pesquisar depois
            cadastroPagina.typeNome(nome);
            cadastroPagina.typeEmail(email);
            cadastroPagina.clickButtonSalvar();
            cy.wait('@postUsers');

            cadastroPagina.clickButtonVoltar();

            paginaInicial.clickButtonPesquisa(email);
            cy.wait(2000);
            paginaInicial.clickButtonVerDetalhes();
            cy.get(paginaEdicao.inputNome).should('be.visible').invoke('val').should('equal', nome);
            cy.get(paginaEdicao.inputEmail).should('be.visible').invoke('val').should('equal', email);
        });

        it('Não deve aparecer nenhum usuário ao pesquisar por email não cadastrado', function () {
            cy.fixture('./sixMoreUsers.json').then(function (usuariosCriados) {
                cy.intercept('GET', '/api/v1/users', {
                    statusCode: 200,
                    body: usuariosCriados
                }).as('getUsers');
            });

            cy.wait('@getUsers');

            paginaInicial.clickButtonPesquisa('emailinexistente@gmail.com');

            cy.get('h3').invoke('text').should('equal', 'Ops! Não existe nenhum usuário para ser exibido.');
            cy.get('p').invoke('text').should('equal', 'Cadastre um novo usuário');
        });
    });
})