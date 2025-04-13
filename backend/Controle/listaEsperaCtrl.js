//É a classe responsável por traduzir requisições HTTP e produzir respostas HTTP
import ListaEspera from "../Modelo/listaEspera.js";
import Aluno from "../Modelo/aluno.js";

export default class ListaEsperaCtrl {

    /*gravar(requisicao, resposta) {
        //preparar o destinatário que a resposta estará no formato JSON
        resposta.type("application/json");
        //Verificando se o método da requisição é POST e conteúdo é JSON
        if (requisicao.method == 'POST' && requisicao.is("application/json")) {
            const numProtocolo = requisicao.body.numProtocolo;
            const nome = requisicao.body.nome;
            const dataInsercao = requisicao.body.dataInsercao;
            const aluno = requisicao.body.aluno || {};
            if (!aluno || !aluno.numProtocolo) {
                return resposta.status(400).json({
                    "status": false,
                    "mensagem": "Aluno não informado ou inválido."
                });
            }
            const alu = new Aluno(aluno.numProtocolo);
            alu.consultar(aluno.numProtocolo).then((listaAlunos) => {
                if (listaAlunos.length > 0) {
                    //pseudo validação
                    if (numProtocolo > 0 && nome && dataInsercao && aluno.numProtocolo > 0) {
                        //gravar o listaEspera

                        const listaEspera = new ListaEspera(0,
                            numProtocolo, nome, dataInsercao, alu);

                        listaEspera.incluir()
                            .then(() => {
                                resposta.status(200).json({
                                    "status": true,
                                    "mensagem": "ListaEspera adicionado com sucesso!",
                                    "id": listaEspera.id
                                });
                            })
                            .catch((erro) => {
                                resposta.status(500).json({
                                    "status": false,
                                    "mensagem": "Não foi possível incluir o listaEspera: " + erro.message
                                });
                            });
                    }
                    else {
                        resposta.status(400).json(
                            {
                                "status": false,
                                "mensagem": "Informe corretamente todos os dados de um listaEspera conforme documentação da API."
                            }
                        );
                    }
                }
                else {
                    resposta.status(400).json({
                        "status": false,
                        "mensagem": "A aluno informada não existe!"
                    });
                }
            }).catch((erro) => {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Não foi possível validar a aluno: " + erro.message
                });
            });
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });

        }

    }*/



        gravar(requisicao, resposta) {
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
        
                alu.consultar(aluno.numProtocolo)
                    .then((listaAlunos) => {
                        if (listaAlunos.length > 0) {
                            const listaEspera = new ListaEspera(0, numProtocolo, nome, dataInsercao, alu);
                            listaEspera.incluir()
                                .then(() => {
                                    resposta.status(200).json({
                                        status: true,
                                        mensagem: "Lista de espera adicionada com sucesso!",
                                        id: listaEspera.id
                                    });
                                })
                                .catch((erro) => {
                                    resposta.status(500).json({
                                        status: false,
                                        mensagem: "Não foi possível incluir a lista de espera: " + erro.message
                                    });
                                });
                        } else {
                            resposta.status(400).json({
                                status: false,
                                mensagem: "O aluno informado não existe!"
                            });
                        }
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            status: false,
                            mensagem: "Erro ao consultar o aluno: " + erro.message
                        });
                    });
        
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Requisição inválida! Consulte a documentação da API."
                });
            }
        }
        

    excluir(requisicao, resposta) {
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
                listaEspera.excluir()
                    .then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "ListaEspera excluído com sucesso!",
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível excluir o listaEspera: " + erro.message
                        });
                    });
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

    consultar(requisicao, resposta) {
            resposta.type("application/json");
            if (requisicao.method == "GET") {
                let nome = requisicao.params.nome;
    
                //evitar que código tenha valor undefined
                if (!nome) {
                    nome = "";
                }
    
                const LisaEspera = new ListaEspera();
                //método consultar retorna uma lista de produtos
                LisaEspera.consultar(nome)
                    .then((listaListaEspera) => {
                        resposta.status(200).json(listaListaEspera);
                    })
                    .catch((erro) => {
                        resposta.status(500).json(
                            {
                                "status": false,
                                "mensagem": "Erro ao consultar LisaEsperas: " + erro.message
                            }
                        );
                    });
    
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