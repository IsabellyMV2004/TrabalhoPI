

// src/pages/TelaPrincipal.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TelaPrincipal() {
    const navigate = useNavigate();
    const irParaCadastro = () => {
        navigate('/cadastro_funcionarios');
    }
  return (
    <div>
      <h1>Tela Principal</h1>
      <button onClick={irParaCadastro}>Ir para Cadastro de Funcionários</button>
    </div>
  );
}
