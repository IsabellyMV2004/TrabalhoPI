import ListaEsperaDAO from "../Persistencia/listaEsperaDAO.js";
import Aluno from "./aluno.js";
export default class ListaEspera{   
    //atributos privados
    #id;
    #numProtocolo;
    #nome;
    #dataInsercao;
    #aluno;

    get id(){
        return this.#id;
    }

    set id(novoID){
        this.#id=novoID;
    } 

    get numProtocolo(){
        return this.#numProtocolo;
    }

    set numProtocolo(novoNumProtocolo){
        this.#numProtocolo = novoNumProtocolo;
    }

    get nome(){
        return this.#nome;
    }

    set nome(novoNome){
        this.#nome = novoNome;
    }

    get dataInsercao(){
        return this.#dataInsercao;
    }

    set dataInsercao(novaData){
        this.#dataInsercao = novaData;
    }

    get aluno(){
        return this.#aluno
    }

    set aluno(novaAluno){
        if (novaAluno instanceof Aluno){
            this.#aluno = novaAluno;
        }
    }

    //construtor (criador de um listaEspera)
    constructor(id=0, numProtocolo=0,nome="", dataInsercao="", aluno={}){
        this.#id=id;
        this.#numProtocolo=numProtocolo;
        this.#nome=nome;
        this.#dataInsercao=dataInsercao;            
        this.#aluno = aluno;
    }

    toJSON(){
        return {
            "id":this.#id,
            "numProtocolo":this.#numProtocolo,
            "nome":this.#nome,
            "dataInsercao":this.#dataInsercao,
            "aluno":this.#aluno.toJSON()
        }
    }

    async incluir(conexao){
            const listaEspDAO = new ListaEsperaDAO();
            await listaEspDAO.incluir(this, conexao); //this,conexao
        }
    
        async consultar(termo, conexao){
            const listaEspDAO = new ListaEsperaDAO();
            return await listaEspDAO.consultar(termo, conexao);
        }
    
        async excluir(conexao){
            const listaEspDAO = new ListaEsperaDAO();
            await listaEspDAO.excluir(this, conexao);
        }
    
        async alterar(conexao){
            const listaEspDAO = new ListaEsperaDAO();
            await listaEspDAO.alterar(this, conexao);
        }
}