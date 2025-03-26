import Funcionario from "../Modelo/funcionario.js";

export default class FuncionarioCtrl {

    gravar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method == 'POST' && requisicao.is("application/json")) {
            const { nome, cpf, nivel, cargo } = requisicao.body;

            if (nome && cpf && nivel && cargo) {
                // Criar objeto sem código (o banco gera automaticamente)
                const funcionario = new Funcionario(null, nome, cpf, nivel, cargo);

                funcionario.incluir()
                    .then((codigoGerado) => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Funcionário adicionado com sucesso!",
                            "codigo": codigoGerado, // Retorna o código gerado pelo banco
                            "cpf": funcionario.cpf
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível incluir o funcionário: " + erro.message
                        });
                    });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe corretamente todos os dados de um funcionário conforme documentação da API."
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    editar(requisicao, resposta) {
        resposta.type("application/json");

        if ((requisicao.method == 'PUT' || requisicao.method == 'PATCH') && requisicao.is("application/json")) {
            const cpf = requisicao.params.cpf;
            const { nome, nivel, cargo } = requisicao.body;

            if (cpf && nome && nivel && cargo) {
                const funcionario = new Funcionario(null, nome, cpf, nivel, cargo);

                funcionario.alterar()
                    .then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Funcionário atualizado com sucesso!",
                            "cpf": funcionario.cpf
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível atualizar o funcionário: " + erro.message
                        });
                    });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe corretamente todos os dados de um funcionário conforme documentação da API."
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method == 'DELETE') {
            const cpf = requisicao.params.cpf;

            if (cpf) {
                const funcionario = new Funcionario(null, "", cpf, "", "");

                funcionario.excluir()
                    .then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Funcionário excluído com sucesso!"
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível excluir o funcionário: " + erro.message
                        });
                    });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe um CPF válido de um funcionário conforme documentação da API."
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    consultar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method == "GET") {
            const cpf = requisicao.params.cpf || "";

            const funcionario = new Funcionario();
            funcionario.consultar(cpf)
                .then((listaFuncionarios) => {
                    resposta.status(200).json(listaFuncionarios);
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao consultar funcionários: " + erro.message
                    });
                });
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

}
