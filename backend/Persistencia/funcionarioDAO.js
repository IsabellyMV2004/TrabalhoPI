//DAO - Data Access Object
import Funcionario from "../Modelo/funcionario.js";

import conectar from "./Conexao.js";
export default class FuncionarioDAO {
    constructor() {
        this.init();
    }

    async init() {
        try 
        {
            const conexao = await conectar(); //retorna uma conexão
            const sql = `
            CREATE TABLE IF NOT EXISTS funcionario(
                func_nome VARCHAR(50) NOT NULL,
                func_cpf INTEGER NOT NULL UNIQUE,
                func_cargo VARCHAR(20) NOT NULL,
                func_nivel VARCHAR(20) NOT NULL,
                func_email VARCHAR(50) NOT NULL,
                func_senha VARCHAR(15) NOT NULL,

                CONSTRAINT pk_funcionario PRIMARY KEY(func_cpf)
            );
        `;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async incluir(funcionario) {
        if (funcionario instanceof Funcionario) {
            const conexao = await conectar();
            const sql = `INSERT INTO funcionario(func_nome,func_cpf,func_cargo, func_nivel,func_email, func_senha)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            let parametros = [
                funcionario.nome,
                funcionario.cpf,
                funcionario.cargo,
                funcionario.nivel,
                funcionario.email,
                funcionario.senha
            ]; 
            await conexao.execute(sql, parametros);
            await conexao.release(); //libera a conexão
        }
    }

    async alterar(funcionario) {
        if (funcionario instanceof Funcionario) {
            const conexao = await conectar();
            const sql = `UPDATE funcionario SET func_nome = ?,func_cargo = ? , func_nivel = ? , func_email = ?, func_senha = ? 
                WHERE  func_cpf = ?
            `;
            let parametros = [
                funcionario.nome,
                funcionario.cargo,
                funcionario.nivel,
                funcionario.email,
                funcionario.senha,
                funcionario.cpf
            ]; 
            await conexao.execute(sql, parametros);
            await conexao.release(); //libera a conexão
        }
    }
    
    async consultar(termo) {
        //resuperar as linhas da tabela produto e transformá-las de volta em produtos
        const conexao = await conectar();
        let sql = "";
        let parametros = [];
        if (!termo) {
            sql = `SELECT * FROM funcionario t
                   WHERE func_nome LIKE ?`;
            parametros = ['%' + termo + '%'];
        }
        else {
            sql = `SELECT * FROM funcionario t
                   WHERE func_nome = ?`
            parametros = [termo];
        }
        const [linhas, campos] = await conexao.execute(sql, parametros);
        let listaFuncionario = [];
        for (const linha of linhas) {
            const funcionario = new Funcionario(
                linha['func_nome'],
                linha['func_cpf'],
                linha['func_cargo'],
                linha['func_nivel'],
                linha['func_email'],
                linha['func_senha']
            );
            listaFuncionario.push(funcionario);
        }
        await conexao.release();
        return listaFuncionario;
    }

    async excluir(funcionario) {
        if (funcionario instanceof Funcionario) {
            const conexao = await conectar();
            const sql = `DELETE FROM funcionario WHERE func_cpf = ?`;
            let parametros = [
                funcionario.cpf
            ];
            await conexao.execute(sql, parametros);
            await conexao.release(); //libera a conexão
        }
    }
}