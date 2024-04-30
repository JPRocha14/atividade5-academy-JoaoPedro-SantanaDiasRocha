export default class CadastroPage {
    inputNome = '#name';
    inputEmail = '#email';
    buttonSalvar = '.sc-dAlyuH';
    messageUsuarioSalvo = '.go2072408551';
    messageError = '.sc-jEACwC';
    linkVoltar = 'a[href="/users"]';

    typeNome(nome) {
        cy.get(this.inputNome).type(nome);
    }

    typeEmail(email) {
        cy.get(this.inputEmail).type(email);
    }

    clickButtonSalvar() {
        cy.get(this.buttonSalvar).click();
    }

    clickButtonVoltar() {
        cy.get(this.linkVoltar).should('be.visible').click();
    }
}