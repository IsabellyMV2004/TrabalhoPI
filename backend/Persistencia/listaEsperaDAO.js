//DAO - Data Access Object
import LisaEspera from "../Modelo/listaEspera.js";
import conectar from "./Conexao.js";

export default class LisaEsperaDAO {

    constructor() {
        this.init();
    }

        async init() {
            try {
                const conexao = await conectar();

                await conexao.execute(`
                    CREATE TABLE IF NOT EXISTS listaEspera (
                        listEsp_id INTEGER NOT NULL AUTOINCREMENT,
                        alu_numProtocolo INTEGER NOT NULL,
                        alu_nome VARCHAR(50) NOT NULL,
                        listEsp_dataInsercao DATE NOT NULL,
                        CONSTRAINT pk_listaEspera PRIMARY KEY(listEsp_id),
                        CONSTRAINT fk_listaEspera_protocolo FOREIGN KEY (alu_numProtocolo) REFERENCES aluno(alu_numProtocolo),
                        CONSTRAINT fk_listaEspera_nome FOREIGN KEY (alu_nome) REFERENCES aluno(alu_nome)
                    )
                `);                

                await conexao.release();
                console.log("Tabela 'listaEspera' foi recriada com sucesso.");
            } catch (e) {
                console.log("Não foi possível iniciar o banco de dados: " + e.message);
            }
        }
        
    async incluir(conexao, numProtocolo) {
        // Buscar o id do aluno correspondente ao protocolo
        const [aluno] = await conexao.execute(`
            SELECT alu_nome FROM aluno WHERE alu_numProtocolo = ?
        `, [numProtocolo]);
    
        if (!aluno || aluno.length === 0) {
            console.error('Nenhum aluno encontrado com esse protocolo.');
            return;
        }
    
        const nome = registros[0].alu_nome;
    
        // Inserir na lista de espera
        await conexao.execute(`
            INSERT INTO listaEspera (alu_numProtocolo, alu_nome, listaEsp_dataInsercao)
            VALUES (?, ?, DATE('now'))
        `, [numProtocolo, nome]);
    
        console.log('Registro inserido com sucesso!');
    }
    
    async excluir(listaEspera) {
        if (listaEspera instanceof LisaEspera) {
            try {
                const conexao = await conectar();
                const sql = `DELETE FROM listaEspera WHERE listaEsp_id = ?`;
                await conexao.execute(sql, [listaEspera.id]);
                await conexao.release();
            } catch (e) {
                throw new Error("Erro ao excluir funcionário: " + e.message);
            }
        }
    }
        async consultar(termo) {
            try {
                const conexao = await conectar();
                let sql = "";
                let parametros = [];
        
                if (!termo) {
                    sql = `SELECT * FROM listaEspera ORDER BY dataInsercao`;
                } else {
                    sql = `SELECT * FROM listaEspera WHERE nome LIKE ? ORDER BY func_nome`;
                    parametros = ['%' + termo + '%'];
                }
        
                const [linhas] = await conexao.execute(sql, parametros);
                const listaLisaEspera = linhas.map(linha => new LisaEspera(
                    linha['id'],
                    linha['numProtocolo'],
                    linha['nome'],
                    linha['dataInsercao']
                ));
                await conexao.release();
                return listaLisaEspera;
            } catch (e) {
                throw new Error("Erro ao consultar funcionários: " + e.message);
            }
        }
        
}
