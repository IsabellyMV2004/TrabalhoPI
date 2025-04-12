//É a classe responsável por traduzir requisições HTTP e produzir respostas HTTP
import Funcionario from "../Modelo/funcionario.js";

export default class FuncionarioCtrl {

    gravar(requisicao, resposta){
        //preparar o destinatário que a resposta estará no formato JSON
        resposta.type("application/json");
        //Verificando se o método da requisição é POST e conteúdo é JSON
        if (requisicao.method == 'POST' && requisicao.is("application/json")){
            const nome  = requisicao.body.nome;
            const cpf = requisicao.body.cpf;
            const cargo = requisicao.body.cargo;
            const nivel = requisicao.body.nivel;
            const email = requisicao.body.email;
            const senha = requisicao.body.senha;
            //pseudo validação
            if (nome && cpf && cargo && nivel && email && senha)
            {
                //gravar a categoria
                const funcionario = new Funcionario(nome, cpf, cargo, nivel, email, senha);
                funcionario.incluir()
                .then(()=>{
                    resposta.status(200).json({
                        "status":true,
                        "mensagem":"Funcionario adicionada com sucesso!",
                        "cor": funcionario.cor
                    });
                })
                .catch((erro)=>{
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Não foi possível incluir a funcionario: " + erro.message
                    });
                });
            }
            else
            {
                resposta.status(400).json(
                    {
                        "status":false,
                        "mensagem":"Informe corretamente todos os dados de uma funcionario conforme documentação da API."
                    }
                );
            }

        }
        else
        {
            resposta.status(400).json({
                "status":false,
                "mensagem":"Requisição inválida! Consulte a documentação da API."
            });

        }

    }

    editar(requisicao, resposta) {
        resposta.type("application/json");
    
        if ((requisicao.method == 'PUT' || requisicao.method == 'PATCH') && requisicao.is("application/json")) {
            const cpf = requisicao.params.cpf; // CPF vem da URL (padrão REST)
            const nome = requisicao.body.nome;
            const cargo = requisicao.body.cargo;
            const nivel = requisicao.body.nivel;
            const email = requisicao.body.email;
            const senha = requisicao.body.senha;
    
            if (nome && cargo && nivel && email && senha) {
                // Verifica se o CPF enviado no corpo da requisição é o mesmo da URL
                if (requisicao.body.cpf && requisicao.body.cpf !== cpf) {
                    return resposta.status(400).json({
                        "status": false,
                        "mensagem": "O CPF não pode ser alterado.   222222"
                    });
                }
    
                const funcionario = new Funcionario(nome, cpf, cargo, nivel, email, senha);
                funcionario.alterar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Funcionário alterado com sucesso!",
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível alterar o funcionário: " + erro.message
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
        //preparar o destinatário que a resposta estará no formato JSON
        resposta.type("application/json");
        //Verificando se o método da requisição é POST e conteúdo é JSON
        if (requisicao.method == 'DELETE') {
            //o código será extraída da URL (padrão REST)
            const cpf = requisicao.params.cpf;
            //pseudo validação
            if (cpf) {
                //alterar o produto
                const funcionario = new Funcionario("", cpf, "", "", "", "");
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
                            "mensagem": "Não foi possível excluir a funcionario: " + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json(
                    {
                        "status": false,
                        "mensagem": "Informe um código válido de um produto conforme documentação da API."
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

            const funcionario = new Funcionario();
            //método consultar retorna uma lista de produtos
            funcionario.consultar(nome)
                .then((listaFuncionario) => {
                    resposta.status(200).json(listaFuncionario);
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