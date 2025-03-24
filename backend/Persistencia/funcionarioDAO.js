import Fornecedor from "../Modelo/funcionario.js";
import conectar from "./Conexao.js";

export default class FornecedorDAO {
    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar(); 
            const sql = `
                CREATE TABLE IF NOT EXISTS funcionario(
                    func_codigo INT NOT NULL AUTO_INCREMENT,
                    func_nome VARCHAR(50) NOT NULL,
                    func_cpf VARCHAR(14) NOT NULL,
                    func_nivel VARCHAR(12) NOT NULL,
                    CONSTRAINT pk_funcionario PRIMARY KEY(func_codigo)
                )
            `;
            await conexao.execute(sql);
            await conexao.release();
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async incluir(funcionario) {
        if (funcionario instanceof Fornecedor)
            {
            if (!funcionario.nome || !funcionario.cpf || !funcionario.nivel) 
                throw new Error("Todos os campos obrigatórios devem ser preenchidos.");
            

            const conexao = await conectar();
            const sql = `
                INSERT INTO funcionario(func_nome, func_cpf, func_nivel)
                VALUES(?, ?, ?, ?)
            `;
            const parametros = [funcionario.nome, funcionario.cpf, funcionario.nivel];
            const resultado = await conexao.execute(sql, parametros);
            funcionario.codigo = resultado[0].insertId;
            await conexao.release();
        } else
            throw new Error("O objeto funcionario não é válido.");
        
    }

    async alterar(funcionario) {
        if (funcionario instanceof Fornecedor) {
            if (!funcionario.nome || !funcionario.cpf || !funcionario.nivel) {
                throw new Error("Todos os campos obrigatórios devem ser preenchidos.");
            }

            const conexao = await conectar();
            const sql = `
                UPDATE funcionario SET func_nome=?, func_cpf=?, func_nivel=?=?
                WHERE func_codigo = ?
            `;
            const parametros = [funcionario.nome, funcionario.cpf, funcionario.nivel, funcionario.codigo];
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
        if (isNaN(parseInt(termo))) {
            sql = `SELECT * FROM funcionario WHERE func_nome LIKE ?`;
            parametros = ['%' + termo + '%'];
        } else {
            sql = `SELECT * FROM funcionario WHERE func_codigo = ?`;
            parametros = [termo];
        }

        const [linhas] = await conexao.execute(sql, parametros);
        let listaFornecedors = [];
        for (const linha of linhas) {
            const funcionario = new Fornecedor(
                linha['func_codigo'],
                linha['func_nome'],
                linha['func_cpf'],
                linha['func_nivel']
            );
            listaFornecedors.push(funcionario);
        }
        await conexao.release();
        return listaFornecedors;
    }

    async excluir(funcionario) {
        if (funcionario instanceof Fornecedor && funcionario.codigo) {
            const conexao = await conectar();
            const sql = `DELETE FROM funcionario WHERE func_codigo = ?`;
            let parametros = [funcionario.codigo]; // Garantir que o código esteja definido
            await conexao.execute(sql, parametros);
            await conexao.release(); // Libera a conexão
        } else {
            console.error('Fornecedor ou código inválido para exclusão:', funcionario);
        }
    }
        
}