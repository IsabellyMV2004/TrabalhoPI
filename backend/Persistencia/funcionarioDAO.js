import Funcionario from "../Modelo/funcionario.js";
import conectar from "./Conexao.js";

export default class FuncionarioDAO {
    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar(); 
            const sql = `
                CREATE TABLE IF NOT EXISTS funcionario (
                    codigo INT AUTO_INCREMENT PRIMARY KEY,
                    func_nome VARCHAR(50) NOT NULL,
                    func_cpf VARCHAR(14) NOT NULL UNIQUE,
                    func_cargo VARCHAR(30) NOT NULL,
                    func_nivel VARCHAR(12) NOT NULL
                )
            `;
            await conexao.execute(sql);
            await conexao.release();
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async incluir(funcionario) {
        if (funcionario instanceof Funcionario) {
            if (!funcionario.nome || !funcionario.cpf || !funcionario.cargo || !funcionario.nivel) {
                throw new Error("Todos os campos obrigatórios devem ser preenchidos.");
            }

            const conexao = await conectar();
            const sql = `
                INSERT INTO funcionario (func_nome, func_cpf, func_cargo, func_nivel)
                VALUES (?, ?, ?, ?)
            `;
            const parametros = [funcionario.nome, funcionario.cpf, funcionario.cargo, funcionario.nivel];
            const [resultado] = await conexao.execute(sql, parametros);
            await conexao.release();

            return resultado.insertId; // Retorna o código gerado
        } else {
            throw new Error("O objeto funcionario não é válido.");
        }
    }

    async alterar(funcionario) {
        if (funcionario instanceof Funcionario) {
            if (!funcionario.nome || !funcionario.cpf || !funcionario.cargo || !funcionario.nivel) {
                throw new Error("Todos os campos obrigatórios devem ser preenchidos.");
            }

            const conexao = await conectar();
            const sql = `
                UPDATE funcionario SET func_nome = ?, func_cargo = ?, func_nivel = ?
                WHERE func_cpf = ?
            `;
            const parametros = [funcionario.nome, funcionario.cargo, funcionario.nivel, funcionario.cpf];
            await conexao.execute(sql, parametros);
            await conexao.release();
        } else {
            throw new Error("O objeto funcionario não é válido.");
        }
    }

    async consultar(termo) {
        const conexao = await conectar();
        let sql = "";
        let parametros = [];

        if (termo.includes(".")) { // CPF contém pontos e traços, então é string
            sql = `SELECT * FROM funcionario WHERE func_cpf = ?`;
            parametros = [termo];
        } else {
            sql = `SELECT * FROM funcionario WHERE func_nome LIKE ?`;
            parametros = ['%' + termo + '%'];
        }

        const [linhas] = await conexao.execute(sql, parametros);
        let listaFuncionarios = [];
        for (const linha of linhas) {
            const funcionario = new Funcionario(
                linha['codigo'], // Adiciona o código do funcionário
                linha['func_nome'],
                linha['func_cpf'],
                linha['func_cargo'],
                linha['func_nivel']
            );
            listaFuncionarios.push(funcionario);
        }
        await conexao.release();
        return listaFuncionarios;
    }

    async excluir(funcionario) {
        if (funcionario instanceof Funcionario && funcionario.cpf) {
            const conexao = await conectar();
            const sql = `DELETE FROM funcionario WHERE func_cpf = ?`;
            const parametros = [funcionario.cpf]; 
            await conexao.execute(sql, parametros);
            await conexao.release();
        } else {
            throw new Error('Funcionário ou CPF inválido para exclusão.');
        }
    }
}
