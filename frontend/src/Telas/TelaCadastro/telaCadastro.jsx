import React from 'react';
import './telaCadastro.css';

export default function TelaCadastro() {
    return (
        <div className="cadastro-wrapper">
            <div className="cadastro-container">
                <h1>Cadastro de Funcionario</h1>
                
                <label>Nome</label>
                <input type="text" placeholder="Informe o nome completo" id="nome"/>
                
                <label>CPF</label>
                <input type="text" placeholder="000.000.000-00" id="cpf"/>
                
                <label>Cargo</label>
                <input type="text" placeholder="Informe o cargo" id="cargo"/>
                
                <label>Nivel de Acesso</label>
                <input type="text" placeholder="MédInforme o nivel" id="nivel"/>
                
                <button>CONTINUAR</button>
            </div>
        </div>
    );
}