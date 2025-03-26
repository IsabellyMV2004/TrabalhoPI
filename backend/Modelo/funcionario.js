import FuncionarioDAO from "../Persistencia/funcionarioDAO.js";

export default class Funcionario {
    // Atributos privados
    #codigo;
    #nome;
    #cpf;
    #nivel;
    #cargo;

    // Construtor da classe
    constructor(codigo = null, nome = "", cpf = "", cargo = "", nivel = "") {
        this.#codigo = codigo; // Código gerado automaticamente pelo banco
        this.#nome = nome;
        this.#cpf = cpf;
        this.#cargo = cargo;
        this.#nivel = nivel;
    }

    // Métodos GET e SET
    get codigo() {
        return this.#codigo;
    }

    get nome() {
        return this.#nome;
    }

    set nome(value) {
        this.#nome = value;
    }

    get cpf() {
        return this.#cpf;
    }

    set cpf(value) {
        this.#cpf = value;
    }

    get cargo() {
        return this.#cargo;
    }

    set cargo(value) {
        this.#cargo = value;
    }

    get nivel() {
        return this.#nivel;
    }

    set nivel(value) {
        this.#nivel = value;
    }

    // Método toJSON para conversão em JSON
    toJSON() {
        return {
            "codigo": this.#codigo,
            "nome": this.#nome,
            "cpf": this.#cpf,
            "cargo": this.#cargo,
            "nivel": this.#nivel
        };
    }

    // Métodos para manipulação no banco de dados
    async incluir() {
        const funcDAO = new FuncionarioDAO();
        this.#codigo = await funcDAO.incluir(this); // Recebe o código gerado pelo banco
    }

    async consultar(termo) {
        const funcDAO = new FuncionarioDAO();
        return await funcDAO.consultar(termo);
    }

    async excluir() {
        const funcDAO = new FuncionarioDAO();
        await funcDAO.excluir(this);
    }

    async alterar() {
        const funcDAO = new FuncionarioDAO();
        await funcDAO.alterar(this);
    }
}
