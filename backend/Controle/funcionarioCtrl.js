//É a classe responsável por traduzir requisições HTTP e produzir respostas HTTP
import Funcionario from "../Modelo/funcionario.js";

export default class FuncionarioCtrl {

    gravar(requisicao, resposta) {
        //preparar o destinatário que a resposta estará no formato JSON
        resposta.type("application/json");
        //Verificando se o método da requisição é POST e conteúdo é JSON
        if (requisicao.method == 'POST' && requisicao.is("application/json")) {
            const nome = requisicao.body.nome;
            const cpf = requisicao.body.cpf;
            const nivel = requisicao.body.nivel;

            if (nome && cpf  &&
                nivel && cpf) {
                //gravar o funcionario

                const funcionario = new Funcionario(0,
                    nome, cpf, nivel);

                funcionario.incluir()
                    .then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Funcionario adicionado com sucesso!",
                            "codigo": funcionario.codigo
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível incluir o funcionario: " + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json(
                    {
                        "status": false,
                        "mensagem": "Informe corretamente todos os dados de um funcionario conforme documentação da API."
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

    editar(requisicao, resposta) {
        //preparar o destinatário que a resposta estará no formato JSON
        resposta.type("application/json");
        //Verificando se o método da requisição é POST e conteúdo é JSON
        if ((requisicao.method == 'PUT' || requisicao.method == 'PATCH') && requisicao.is("application/json")) {
            //o código será extraída da URL (padrão REST)
            const codigo = requisicao.params.codigo;
            const nome = requisicao.body.nome;
            const cpf = requisicao.body.cpf;
            const nivel = requisicao.body.nivel;

            if (codigo > 0 && nome && cpf &&
                nivel) {
                //gravar o funcionario

                const funcionario = new Funcionario(codigo,
                    nome, cpf, nivel);

                funcionario.alterar()
                    .then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Funcionario adicionado com sucesso!",
                            "codigo": funcionario.codigo
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível incluir o funcionario: " + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json(
                    {
                        "status": false,
                        "mensagem": "Informe corretamente todos os dados de um funcionario conforme documentação da API."
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

    excluir(requisicao, resposta) {
        //preparar o destinatário que a resposta estará no formato JSON
        resposta.type("application/json");
        //Verificando se o método da requisição é POST e conteúdo é JSON
        if (requisicao.method == 'DELETE') {
            //o código será extraída da URL (padrão REST)
            const codigo = requisicao.params.codigo;
            //pseudo validação
            if (codigo > 0) {
                //alterar o funcionario
                const funcionario = new Funcionario(codigo);
                funcionario.excluir()
                    .then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Funcionario excluído com sucesso!",
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível excluir o funcionario: " + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json(
                    {
                        "status": false,
                        "mensagem": "Informe um código válido de um funcionario conforme documentação da API."
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
            let codigo = requisicao.params.codigo;
            //evitar que código tenha valor undefined
            if (isNaN(codigo)) {
                codigo = "";
            }

            const funcionario = new Funcionario();
            //método consultar retorna uma lista de funcionarios
            funcionario.consultar(codigo)
                .then((listaFuncionarios) => {
                    resposta.status(200).json(listaFuncionarios
                        /*{
                            "status": true,
                            "listaFuncionarios": listaFuncionarios
                        }*/
                    );
                })
                .catch((erro) => {
                    resposta.status(500).json(
                        {
                            "status": false,
                            "mensagem": "Erro ao consultar funcionarios: " + erro.message
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