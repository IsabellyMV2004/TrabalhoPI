import { Alert, Form, Button } from "react-bootstrap";
import "../../css/telaFuncionario.css";
import { useState, useEffect } from "react";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function FormCadFuncionario() {
    const [id, setID] = useState("");
    const [nome, setNome] = useState("");
    const [cpf, setCPF] = useState("");
    const [cargo, setCargo] = useState("");
    const [nivel, setNivel] = useState("");
    const [mensagem, setMensagem] = useState("");
    const location = useLocation();
    const [editando, setEditando] = useState(false);
    const [funcionario, setFuncionario] = useState(nome, cpf, cargo, nivel);


    useEffect(() => {
        if (location.state && location.state.nome && location.state.cpf && location.state.cargo && location.state.nivel) {
            location.id = 0;
            setID(location.state.id);
            setNome(location.state.nome);
            setCPF(location.state.cpf);
            setCargo(location.state.cargo);
            setNivel(location.state.nivel);
            setEditando(true);  // Ativa o modo de edição
        }
    }, [location.state]);

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0, resto;

        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault(); // Evita recarregar a página

        // Verifica se os campos estão preenchidos
        if (!nome || !cpf || !cargo || !nivel) {
            setMensagem("Preencha todos os campos!");
            return;
        }

        if(!validarCPF(cpf) || cpf[3]!="." || cpf[7]!="." || cpf[11]!="-" || cpf.length!=14){
            setMensagem("CPF invalido");
            setTimeout(() => setMensagem(""), 5000);
            return;
        }

        const funcionario = { id, nome, cpf, cargo, nivel }; // Monta o objeto para enviar ao backend
        const url = editando ? `http://localhost:3000/funcionarios/${cpf}` : "http://localhost:3000/funcionarios";
        const method = editando ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(funcionario),
            });

            if (response.ok) {
                setMensagem(editando ? "Funcionario atualizada com sucesso!" : "Funcionario cadastrada com sucesso!");
            } else {
                setMensagem("Erro ao cadastrar a funcionario.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    return (
        <div>
            <PaginaGeral>
            <Alert className="mt-2 mb-2 text-center" variant="dark">
                <h2>Funcionarios</h2>
            </Alert>

            {mensagem && <Alert variant="info">{mensagem}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Informe o Nome do Funcionario"
                        value={funcionario.nome}
                        onChange={(e) => setNome(e.target.value)}
                        disabled={editando}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>CPF</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Informe o CPF do Funcionario"
                        value={funcionario.cpf}
                        onChange={(e) => setCPF(e.target.value)}
                        disabled={editando}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Cargo</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Informe o Cargo do Funcionario"
                        value={funcionario.cargo}
                        onChange={(e) => setCargo(e.target.value)}
                        disabled={editando}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Nivel</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Informe o Nivel do Funcionario"
                        value={funcionario.nivel}
                        onChange={(e) => setNivel(e.target.value)}
                        disabled={editando}
                    />
                </Form.Group>

                <Button as={Link} to="/telaFuncionario" className="botaoPesquisa" variant="secondary">
                                Voltar
                        </Button>
                <Button className="botaoPesquisa" variant="primary" type="submit">
                    {editando ? "Atualizar" : "Cadastrar"}
                </Button>
            </Form>
            </PaginaGeral>
        </div>
    );
}
