//É a classe responsável por traduzir requisições HTTP e produzir respostas HTTP
import ListaEspera from "../Modelo/listaEspera.js";
import Aluno from "../Modelo/aluno.js";
import conectar from "./Conexao.js";

export default class ListaEsperaCtrl {

    async gravar(requisicao, resposta) {

        const conexao = await conectar();

        resposta.type("application/json");
    
        if (requisicao.method === 'POST' && requisicao.is("application/json")) {
            const numProtocolo = parseInt(requisicao.params.numProtocolo); // Vem da URL
            const { nome, dataInsercao, aluno } = requisicao.body;
    
            if (!aluno || !aluno.numProtocolo) {
                return resposta.status(400).json({
                    status: false,
                    mensagem: "Aluno não informado ou inválido."
                });
            }
    
            if (!nome || !dataInsercao || isNaN(numProtocolo) || numProtocolo <= 0) {
                return resposta.status(400).json({
                    status: false,
                    mensagem: "Informe corretamente todos os dados de uma lista de espera conforme documentação da API."
                });
            }
    
            const alu = new Aluno(aluno.numProtocolo);
            try{
                await conexao.query('BEGIN');
                const listaAlunos = await aluno.consultar(numProtocolo, conexao);
                if (listaAlunos.length > 0) {
                    await conexao.query('COMMIT');
                    const listaEspera = new ListaEspera(0, numProtocolo, nome, dataInsercao, alu);
                    try{
                        await conexao.query('BEGIN');
                            if(listaEspera.incluir(conexao)){
                            await conexao.query('COMMIT');
                            //await conexao.release();
    
                            resposta.status(200).json({
                                "status":true,
                                "mensagem":"Aluno adicionado a Lista de Espera com sucesso!"
                            });
                        }
                        else{
                            await conexao.query('ROLLBACK');
                            //await conexao.release();
                            resposta.status(500).json({
                                "status":false,
                                "mensagem":"Não foi possível incluir o funcionario: "
                            });
                        }
                    }
                    catch (e) {
                        await conexao.query('ROLLBACK');
                        throw e
                    }
                }else {
                        resposta.status(400).json({
                            status: false,
                            mensagem: "O aluno informado não existe!"
                        });
                }
            }catch (e) {
                await conexao.query('ROLLBACK');
                throw e
            }finally {
                conexao.release();
            }
    
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida! Consulte a documentação da API."
            });
        }
    }
    

    async excluir(requisicao, resposta) {
        //preparar o destinatário que a resposta estará no formato JSON
        resposta.type("application/json");
        //Verificando se o método da requisição é POST e conteúdo é JSON
        if (requisicao.method == 'DELETE') {
            //o código será extraída da URL (padrão REST)
            const id = requisicao.params.id;
            //pseudo validação
            if (id > 0) {
                //alterar o listaEspera
                const listaEspera = new ListaEspera(id);
                try{
                    await conexao.query('BEGIN');
                        if(listaEspera.excluir(conexao)){
                        await conexao.query('COMMIT');
                        //await conexao.release();

                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Aluno excluido da Lista de Espera com sucesso!"
                        });
                    }
                    else{
                        await conexao.query('ROLLBACK');
                        //await conexao.release();
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Não foi possível excluir o aluno da lista de espera: "
                        });
                    }
                }
                catch (e) {
                    await conexao.query('ROLLBACK');
                    throw e
                }
                finally {
                    conexao.release();
                }
            }
            else {
                resposta.status(400).json(
                    {
                        "status": false,
                        "mensagem": "Informe um código válido de um listaEspera conforme documentação da API."
                    }
                );
            }

        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });

        }
    }

    async consultar(requisicao, resposta) {
            resposta.type("application/json");
            if (requisicao.method == "GET") {
                let nome = requisicao.params.nome;
    
                //evitar que código tenha valor undefined
                if (!nome) {
                    nome = "";
                }
    
                const LisaEspera = new ListaEspera();
                //método consultar retorna uma lista de produtos
                try{
                    await conexao.query('BEGIN');
                    const LisaEspera = await funcionario.consultar(nome, conexao);
                    if (Array.isArray(LisaEspera)) {
                        await conexao.query('COMMIT');
                        resposta.status(200).json(LisaEspera);
                    } else {
                        await conexao.query('ROLLBACK');
                        resposta.status(500).json({ status: false, mensagem: "Formato inesperado na resposta" });
                    }
                    
                   /* if(listaFuncionario){
                        await conexao.query('COMMIT');
                        //await conexao.release();
                            
                        resposta.status(200).json(listaFuncionario);
                    }
                    else{
                        await conexao.query('ROLLBACK');
                        //await conexao.release();
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao consultar funcionarios: "
                        });
                    }*/
                }
                catch (e) {
                    await conexao.query('ROLLBACK');
                    throw e
                }
                finally {
                    conexao.release();
                }
    
            }
            else {
                resposta.status(400).json(
                    {
                        "status": false,
                        "mensagem": "Requisição inválida! Consulte a documentação da API."
                    }
                );
            }
        }

}