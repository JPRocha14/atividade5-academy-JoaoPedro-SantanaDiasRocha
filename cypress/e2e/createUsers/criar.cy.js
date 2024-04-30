import { faker } from '@faker-js/faker';
import CadastroPage from '../../support/pages/cadastro.page';
import PaginaInicial from '../../support/pages/paginaInicial.page';
import PaginaEdicao from '../../support/pages/paginaEdicao.page';

describe('Cadastro de usuário', function () {
    var paginaCadastro = new CadastroPage();
    var paginaInicial = new PaginaInicial();
    var paginaEdicao = new PaginaEdicao();
    var name;
    var novoEmail;

    beforeEach(function () {
        cy.visit('');

        cy.contains('a[href="/users/novo"]', 'Novo').should('be.visible').click();
    })

    describe('Cenário válido de cadastro de usuário', function () {

        // este cenário realmente cria um usuário na API,
        // os demais foram feitos com o intercept
        it('Deve permitir cadastrar um usuário', function () {
            name = 'Joao Pedro';
            novoEmail = faker.internet.email().toLowerCase();

            cy.intercept('POST', '/api/v1/users').as('postUsers');

            paginaCadastro.typeNome(name);
            paginaCadastro.typeEmail(novoEmail);
            paginaCadastro.clickButtonSalvar();

            cy.wait('@postUsers');

            cy.get(paginaCadastro.messageUsuarioSalvo).invoke('text').should('equal', 'Usuário salvo com sucesso!');
            paginaCadastro.clickButtonVoltar();
            cy.get('.sc-gsFSXq').should('be.visible').click().type(novoEmail);

            cy.wait(2000);
            paginaInicial.clickButtonVerDetalhes();
            cy.get(paginaEdicao.inputEmail).invoke('val').should('equal', novoEmail);
        });

        it('Deve permitir cadastrar um usuário com campo nome com 100 caracteres', function () {
            name = 'Joao Pedro'.repeat(10);
            novoEmail = faker.internet.email().toLowerCase();
            // intercept para mochar a criação de um usuário com 100 caracteres
            cy.intercept('POST', '/api/v1/users').as('postUsers');

            paginaCadastro.typeNome(name);
            paginaCadastro.typeEmail(novoEmail);
            paginaCadastro.clickButtonSalvar();

            cy.wait('@postUsers');
            cy.get(paginaCadastro.messageUsuarioSalvo).invoke('text').should('equal', 'Usuário salvo com sucesso!');
            paginaCadastro.clickButtonVoltar();
            cy.get('.sc-gsFSXq').should('be.visible').click().type(novoEmail);
            cy.wait(2000);

            paginaInicial.clickButtonVerDetalhes();

            cy.get(paginaEdicao.inputEmail).invoke('val').should('equal', novoEmail);
            cy.get(paginaEdicao.inputNome).invoke('val').should('equal', name);

        });

        it('Deve permitir cadastrar um usuário com campo nome com 4 caracteres', function () {
            novoEmail = faker.internet.email().toLowerCase();
            // intercept para mochar a criação de um usuário com 4 caracteres
            cy.intercept('POST', '/api/v1/users').as('postUsers');

            paginaCadastro.typeNome('Joao');
            paginaCadastro.typeEmail(novoEmail);
            paginaCadastro.clickButtonSalvar();

            cy.wait('@postUsers');
            cy.get(paginaCadastro.messageUsuarioSalvo).invoke('text').should('equal', 'Usuário salvo com sucesso!');
            paginaCadastro.clickButtonVoltar();
            cy.get('.sc-gsFSXq').should('be.visible').click().type(novoEmail);
            cy.wait(2000);

            paginaInicial.clickButtonVerDetalhes();

            cy.get(paginaEdicao.inputEmail).invoke('val').should('equal', novoEmail);
            cy.get(paginaEdicao.inputNome).invoke('val').should('equal', 'Joao');
        });

        it('Deve permitir cadastrar um usuário com campo email com menos de 60 caracteres', function () {
            name = 'Joao Pedro';
            novoEmail = faker.internet.email().toLowerCase();
            // intercept para mochar a criação de um usuário com 60 caracteres no email
            cy.intercept('POST', '/api/v1/users').as('postUsers');

            paginaCadastro.typeNome(name);
            paginaCadastro.typeEmail(novoEmail);
            paginaCadastro.clickButtonSalvar();

            cy.wait('@postUsers');
            cy.get(paginaCadastro.messageUsuarioSalvo).invoke('text').should('equal', 'Usuário salvo com sucesso!');
            paginaCadastro.clickButtonVoltar();
            cy.get('.sc-gsFSXq').should('be.visible').click().type(novoEmail);
            cy.wait(2000);

            paginaInicial.clickButtonVerDetalhes();

            cy.get(paginaEdicao.inputEmail).invoke('val').should('equal', novoEmail);
            cy.get(paginaEdicao.inputNome).invoke('val').should('equal', name);
        });
    });

    describe('Cenários inválidos de cadastro de usuário', function () {
        describe('Cenários inválidos do campo nome', function () {
            const emailValido = 'email123@gmail.com';

            it('Não deve permitir cadastrar um usuário com campo nome vazio', function () {
                paginaCadastro.typeEmail(emailValido);
                paginaCadastro.clickButtonSalvar();

                cy.get(paginaCadastro.messageError).invoke('text').should('equal', 'O campo nome é obrigatório.');
            });

            it('Não deve permitir cadastrar um usuário com campo nome maior que 100 caracteres', function () {
                const nome = 'J'.repeat(101);
                paginaCadastro.typeNome(nome);
                paginaCadastro.typeEmail(emailValido);
                paginaCadastro.clickButtonSalvar();

                cy.get(paginaCadastro.messageError).invoke('text').should('equal', 'Informe no máximo 100 caracteres para o nome');
            });

            it('Não deve permitir cadastrar um usuário com campo nome menor que 4 caracteres', function () {
                paginaCadastro.typeNome('Ana');
                paginaCadastro.typeEmail(emailValido);
                paginaCadastro.clickButtonSalvar();

                cy.get(paginaCadastro.messageError).invoke('text').should('equal', 'Informe pelo menos 4 letras para o nome.');
            });

        });

        describe('Cenários inválidos do campo email', function () {
            const nomeValido = 'João Pedro';

            it('Não deve permitir cadastrar um usuário com campo email vazio', function () {
                paginaCadastro.typeNome(nomeValido);
                paginaCadastro.clickButtonSalvar();

                cy.get(paginaCadastro.messageError).invoke('text').should('equal', 'O campo e-mail é obrigatório.');
            });

            it('Não deve permitir cadastrar um usuário com campo formato de email inválido', function () {
                paginaCadastro.typeNome(nomeValido);
                paginaCadastro.typeEmail('testeteste.com');
                paginaCadastro.clickButtonSalvar();

                cy.get(paginaCadastro.messageError).invoke('text').should('equal', 'Formato de e-mail inválido');
            });

            it('Não deve permitir cadastrar um usuário com um email já existente', function () {
                // intercept para mochar a criação de um usuário com email já existente
                cy.intercept('POST', '/api/v1/users', {
                    statusCode: 422,
                    body: {
                        error: "User already exists."
                    }
                }).as('postUsuario');

                paginaCadastro.typeNome(nomeValido);
                paginaCadastro.typeEmail('teste@teste.com');
                paginaCadastro.clickButtonSalvar();

                cy.wait('@postUsuario');

                cy.get('h2').invoke('text').should('equal', 'Erro');
                cy.get('p').invoke('text').should('equal', 'Este e-mail já é utilizado por outro usuário.');
                cy.contains('button', 'Cancelar').click();
            });

            it.only('Não deve permitir cadastrar um usuário com campo email maior que 60 caracteres', function () {
                novoEmail = 'teste'.repeat(11) + '@a.com';
                paginaCadastro.typeNome(nomeValido);
                paginaCadastro.typeEmail(novoEmail);
                paginaCadastro.clickButtonSalvar();

                cy.get(paginaCadastro.messageError).invoke('text').should('equal', 'Informe no máximo 60 caracteres para o e-mail');
            });
        });
    });
})
