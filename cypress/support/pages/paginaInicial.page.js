export default class PaginaInicial {
    buttonPesquisa = 'input.sc-gsFSXq.mUpIH';
    buttonVerDetalhes = '#userDataDetalhe';
    buttonNextPage = '#paginacaoProximo';
    buttonPreviousPage = '#paginacaoVoltar';
    buttonActualPage = '#paginacaoAtual';
    buttonNovoUser = 'a[href="/users/novo"]';
    listaUsuarios = '#listaUsuarios';
    logoRaro = '.sc-eqUAAy';

    clickButtonPesquisa(pesquisa) {
        cy.get(this.buttonPesquisa).should('be.visible').click().type(pesquisa);
    }
    clickButtonVerDetalhes() {
        cy.get(this.buttonVerDetalhes).should('be.visible').click();
    }
    getListaUsuarios() {
        return cy.get(this.listaUsuarios).should('be.visible');
    }
    clickNextPage() {
        cy.get(this.buttonNextPage).should('be.enabled').click();
    }
    clickPreviousPage() {
        cy.get(this.buttonPreviousPage).should('be.enabled').click();
    }
    clickLogoRaro() {
        cy.get(this.logoRaro).should('be.visible').click();
    }
    clickButtonNovo() {
        cy.get(this.buttonNovoUser).should('be.visible').click();
    }
}