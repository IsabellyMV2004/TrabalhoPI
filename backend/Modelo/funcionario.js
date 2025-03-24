import FuncionarioDAO from "../Persistencia/funcionarioDAO.js";

export default class Funcionario {
    // Atributos privados usando a sintaxe #
    #nome;
    #cpf;
    #nivel;

    // Construtor da classe
    constructor(nome="",cpf="",nivel=""){
            this.#nome=nome;
            this.#cpf=cpf;
            this.#nivel=nivel;
    }

    // Método get para o atributo nome
    get nome() {
        return this.#nome;
    }

    // Método set para o atributo nome
    set nome(value) {
        this.#nome = value;
    }

    get cpf() {
        return this.#cpf;
    }

    // Método set para o atributo cpf
    set cpf(value) {
        this.#cpf = value;
    }

    get nivel() {
        return this.#nivel;
    }

    // Método set para o atributo nivel
    set nivel(value) {
        this.#nivel = value;
    }

    // Método toJSON para conversão em JSON
    toJSON() {
        return {
            "nome": this.#nome,
            "cpf": this.#cpf,
            "nivel": this.#nivel
        };
    }

    async incluir(){
        const funcDAO = new FuncionarioDAO();
        await funcDAO.incluir(this); 
    }

    async consultar(termo){
        const funcDAO = new FuncionarioDAO();
        return await funcDAO.consultar(termo);
    }

    async excluir(){
        const funcDAO = new FuncionarioDAO();
        await funcDAO.excluir(this);
    }

    async alterar(){
        const funcDAO = new FuncionarioDAO();
        await funcDAO.alterar(this);
    }
}