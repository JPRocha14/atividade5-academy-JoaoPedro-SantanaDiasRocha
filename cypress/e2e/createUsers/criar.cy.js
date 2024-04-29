import { faker } from '@faker-js/faker';

describe('Cadastro de usuário', function () {
    beforeEach(function () {
        cy.visit('');

        cy.contains('a[href="/users/novo"]', 'Novo').should('be.visible').click();
    })

    describe('Cenário válido de cadastro de usuário', function () {

        // este cenário realmente cria um usuário na API,
        // os demais foram feitos com o intercept
        it('Deve permitir cadastrar um usuário', function () {
            const name = 'Joao Pedro';
            const email = faker.internet.email().toLowerCase();

            cy.intercept('POST', '/api/v1/users').as('postUsers');

            cy.get('#name').type(name);
            cy.get('#email').type(email);
            cy.get('.sc-dAlyuH').click();

            cy.wait('@postUsers');

            cy.get('.go2072408551').invoke('text').should('equal', 'Usuário salvo com sucesso!');
            cy.contains('a[href="/users"]', 'Voltar').should('be.visible').click();
            cy.get('.sc-gsFSXq').should('be.visible').click().type(email);

            cy.wait(1000);
            cy.get('#userDataDetalhe').should('be.visible').click();
            cy.get('#userEmail').invoke('val').should('equal', email);
        });

        it('Deve permitir cadastrar um usuário com campo nome com 100 caracteres', function () {
            const name = 'Joao Pedro';
            const email2 = faker.internet.email().toLowerCase();
            // intercept para mochar a criação de um usuário com 100 caracteres
            cy.intercept('POST', '/api/v1/users').as('postUsers');

            cy.get('#name').type(name.repeat(10));
            cy.get('#email').type(email2);
            cy.get('.sc-dAlyuH').click();

            cy.wait('@postUsers');
            cy.get('.go2072408551').invoke('text').should('equal', 'Usuário salvo com sucesso!');
            cy.contains('a[href="/users"]', 'Voltar').should('be.visible').click();
            cy.get('.sc-gsFSXq').should('be.visible').click().type(email2);
            cy.wait(2000);

            cy.get('#userDataDetalhe').should('be.visible').click();
            cy.get('#userName').invoke('val').should('equal', name.repeat(10));
            cy.get('#userEmail').invoke('val').should('equal', email2);

        });

        it('Deve permitir cadastrar um usuário com campo nome com 4 caracteres', function () {
            const email3 = faker.internet.email().toLowerCase();
            // intercept para mochar a criação de um usuário com 4 caracteres
            cy.intercept('POST', '/api/v1/users').as('postUsers');

            cy.get('#name').type('Joao');
            cy.get('#email').type(email3);
            cy.get('.sc-dAlyuH').click();

            cy.wait('@postUsers');
            cy.get('.go2072408551').invoke('text').should('equal', 'Usuário salvo com sucesso!');
            cy.contains('a[href="/users"]', 'Voltar').should('be.visible').click();
            cy.get('.sc-gsFSXq').should('be.visible').click().type(email3);
            cy.wait(2000);

            cy.get('#userDataDetalhe').should('be.visible').click();
            cy.get('#userName').invoke('val').should('equal', 'Joao');
            cy.get('#userEmail').invoke('val').should('equal', email3);
        });

        it('Deve permitir cadastrar um usuário com campo email com menos de 60 caracteres', function () {
            const name = 'Joao Pedro';
            const email4 = faker.internet.email().toLowerCase();
            // intercept para mochar a criação de um usuário com 60 caracteres no email
            cy.intercept('POST', '/api/v1/users').as('postUsers');

            cy.get('#name').type(name);
            cy.get('#email').type(email4);
            cy.get('.sc-dAlyuH').click();

            cy.wait('@postUsers');
            cy.get('.go2072408551').invoke('text').should('equal', 'Usuário salvo com sucesso!');
            cy.contains('a[href="/users"]', 'Voltar').should('be.visible').click();
            cy.get('.sc-gsFSXq').should('be.visible').click().type(email4);
            cy.wait(2000);

            cy.get('#userDataDetalhe').should('be.visible').click();
            cy.get('#userName').invoke('val').should('equal', name);
            cy.get('#userEmail').invoke('val').should('equal', email4);
        });
    });

    describe('Cenários inválidos de cadastro de usuário', function () {
        describe('Cenários inválidos do campo nome', function () {
            const emailValido = 'email123@gmail.com'
            it('Não deve permitir cadastrar um usuário com campo nome vazio', function () {
                cy.get('#email').type(emailValido);
                cy.get('.sc-dAlyuH').click();

                cy.get('.sc-jEACwC').invoke('text').should('equal', 'O campo nome é obrigatório.');
            });

            it('Não deve permitir cadastrar um usuário com campo nome maior que 100 caracteres', function () {
                const nome = 'J';
                cy.get('#name').type(nome.repeat(101));
                cy.get('#email').type(emailValido);
                cy.get('.sc-dAlyuH').click();

                cy.get('.sc-jEACwC').invoke('text').should('equal', 'Informe no máximo 100 caracteres para o nome');
            });

            it('Não deve permitir cadastrar um usuário com campo nome menor que 4 caracteres', function () {
                cy.get('#name').type('Ana');
                cy.get('#email').type(emailValido);
                cy.get('.sc-dAlyuH').click();

                cy.get('.sc-jEACwC').invoke('text').should('equal', 'Informe pelo menos 4 letras para o nome.');
            });

            it('Não deve permitir cadastrar um usuário com campo nome apenas com espaços', function () {
                cy.intercept('POST', '/api/v1/users', {
                    statusCode: 400
                }).as('postUsers');

                cy.get('#name').type('          ');
                cy.get('#email').type(emailValido);
                cy.get('.sc-dAlyuH').click();

                cy.wait('@postUsers');

                cy.get('h2').invoke('text').should('equal', 'Erro');
                cy.get('p').invoke('text').should('equal', 'Não foi possível cadastrar o usuário!');
                cy.contains('button', 'Cancelar').click();
            });

            it('Não deve permitir cadastrar um usuário com campo nome com emojis', function () {
                cy.get('#name').type('😂😂😁😂');
                cy.get('#email').type(emailValido);
                cy.get('.sc-dAlyuH').click();

                cy.get('.sc-jEACwC').invoke('text').should('equal', 'Formato do nome é inválido.');
            });

            it('Não deve permitir cadastrar um usuário com campo nome com caracteres especiais', function () {
                cy.get('#name').type('Joao@$%');
                cy.get('#email').type(emailValido);
                cy.get('.sc-dAlyuH').click();

                cy.get('.sc-jEACwC').invoke('text').should('equal', 'Formato do nome é inválido.');
            });

            it('Não deve permitir cadastrar um usuário com campo nome preenchido com números', function () {
                cy.get('#name').type(123456);
                cy.get('#email').type(emailValido);
                cy.get('.sc-dAlyuH').click();

                cy.get('.sc-jEACwC').invoke('text').should('equal', 'Formato do nome é inválido.');
            });
        });

        describe('Cenários inválidos do campo email', function () {
            const nomeValido = 'João Pedro';

            it('Não deve permitir cadastrar um usuário com campo email vazio', function () {
                cy.get('#name').type(nomeValido);
                cy.get('.sc-dAlyuH').click();

                cy.get('.sc-jEACwC').invoke('text').should('equal', 'O campo e-mail é obrigatório.');
            });

            it('Não deve permitir cadastrar um usuário com campo formato de email inválido', function () {
                cy.get('#name').type(nomeValido);
                cy.get('#email').type('testeteste.com')
                cy.get('.sc-dAlyuH').click();

                cy.get('.sc-jEACwC').invoke('text').should('equal', 'Formato de e-mail inválido');
            });

            it('Não deve permitir cadastrar um usuário com um email já existente', function () {
                // intercept para mochar a criação de um usuário com email já existente
                cy.intercept('POST', '/api/v1/users', {
                    statusCode: 422,
                    body: {
                        error: "User already exists."
                    }
                }).as('postUsuario');

                cy.get('#name').type(nomeValido);
                cy.get('#email').type('teste@teste.com');
                cy.get('.sc-dAlyuH').click();

                cy.wait('@postUsuario');

                cy.get('h2').invoke('text').should('equal', 'Erro');
                cy.get('p').invoke('text').should('equal', 'Este e-mail já é utilizado por outro usuário.');
                cy.contains('button', 'Cancelar').click();
            });

            it('Não deve permitir cadastrar um usuário com campo email maior que 60 caracteres', function () {
                cy.get('#name').type(nomeValido);
                cy.get('#email').type('teste'.repeat(11) + '@a.com')
                cy.get('.sc-dAlyuH').click();

                cy.get('.sc-jEACwC').invoke('text').should('equal', 'Informe no máximo 60 caracteres para o e-mail');
            });

            it('Não deve permitir cadastrar um usuário com campo email com emojis', function () {
                cy.get('#name').type(nomeValido);
                cy.get('#email').type('😂😂🤣🤣@a.com')
                cy.get('.sc-dAlyuH').click();

                cy.get('.sc-jEACwC').invoke('text').should('equal', 'Formato de e-mail inválido');
            });
        });
    });
})
