import { Alert } from "react-bootstrap";
import FormCadFuncionarios from "./Formularios/FormCadFuncionario";
import Pagina from "../layouts/Pagina";
import { useEffect, useState } from "react";
import TabelaFuncionarios from "./Tabelas/TabelaFuncionarios";
import { consultarFuncionario } from "../servicos/servicoFuncionario";

export default function TelaCadastroFuncionario(props) {
    const [exibirTabela, setExibirTabela] = useState(true);
    const [listaDeFuncionarios, setListaDeFuncionarios] = useState([]);
    const [modoEdicao, setModoEdicao] = useState(false);
    //const [usuarios, setFuncionarios] = useState([]);
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState({
        codigo:0,
        nome:"",
        cpf:"",
        cargo:"",
        nivel:""
    });

    useEffect(()=>{
        consultarFuncionario().then((lista)=>{
            setListaDeFuncionarios(lista);
        });
    },[]); //listaVazia -> didMount
   

    return (
        <div>
            <Pagina>
                |<Alert className="mt-02 mb-02 success text-center" variant="success">
                    <h2>
                        Cadastro de Funcionario
                    </h2>
                </Alert>
                {
                    exibirTabela ?
                        <TabelaFuncionarios listaDeFuncionarios={listaDeFuncionarios}
                                        setListaDeFuncionarios={setListaDeFuncionarios} 
                                        setExibirTabela={setExibirTabela}
                                        setModoEdicao={setModoEdicao}
                                        setFuncionarioSelecionado={setFuncionarioSelecionado} /> :
                        <FormCadFuncionarios listaDeFuncionarios={listaDeFuncionarios}
                                         setListaDeFuncionarios={setListaDeFuncionarios}
                                         setExibirTabela={setExibirTabela}
                                         funcionarioSelecionado={funcionarioSelecionado}
                                         setFuncionarioSelecionado={setFuncionarioSelecionado}
                                         modoEdicao={modoEdicao}
                                         setModoEdicao={setModoEdicao}

                                         />
                }
            </Pagina>
        </div>
    );

}





// PARTE DE REDUX
/*
import { useState } from "react";
import TabelaFuncionarios from "./Tabelas/TabelaFuncionarios";
import FormCadFuncionarios from "./Formularios/FormCadFuncionario";
import { useSelector } from "react-redux";

export default function TelaCadastroFuncionario() {
  const [exibirTabela, setExibirTabela] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState({
        codigo:0,
        email:"",
        senha:"",
        nome:"",
        telefone:"",
        endereco:""
  });

  const { listaDeFuncionarios } = useSelector((state) => state.funcionarioes);

  return (
    <>
      {exibirTabela ? (
        <TabelaFuncionarios
          setExibirTabela={setExibirTabela}
          setModoEdicao={setModoEdicao}
          setFuncionarioSelecionado={setFuncionarioSelecionado}
        />
      ) : (
        <FormCadFuncionarios
          listaDeFuncionarios={listaDeFuncionarios}
          setExibirTabela={setExibirTabela}
          modoEdicao={modoEdicao}
          setModoEdicao={setModoEdicao}
          funcionarioSelecionado={funcionarioSelecionado}
          setFuncionarioSelecionado={setFuncionarioSelecionado}
        />
      )}
    </>
  );
}*/
