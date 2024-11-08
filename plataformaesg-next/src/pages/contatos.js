// pages/contatos.js

"use client";

import React, { useState } from 'react';
import InputForms from '../components/inputForms/inputForms';
import Api from '../services/axiosConfig';
import styles from './contatos.module.css';

const Contatos = () => {
    const [cep, setCep] = useState('');
    const [Rua, setRua] = useState('');
    const [Bairro, setBairro] = useState('');
    const [Cidade, setCidade] = useState('');
    const [Nome, setNome] = useState('');
    const [Email, setEmail] = useState('');
    const [Comentario, setComentario] = useState('');

    function buscarEndereco(cep) {
        if (cep.trim() === '') return;

        Api.get(`${cep}/json/`)
            .then(response => {
                const dados = response.data;
                setRua(dados.logradouro);
                setBairro(dados.bairro);
                setCidade(dados.localidade);
            })
            .catch(error => {
                console.error('Erro ao buscar endereço:', error.message);
            });
    }

    const pegarEmail = (e) => setEmail(e.target.value);
    const pegarNome = (e) => setNome(e.target.value);
    const pegarComentario = (e) => setComentario(e.target.value);

    function enviarForms() {
        if (!Nome || !Email || !cep || !Rua || !Bairro || !Cidade || !Comentario) {
            return alert('É necessário preencher todos os campos obrigatórios');
        }

        fetch('https://sheetdb.io/api/v1/703t37bahsr8a', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer jp9c4un7y60ag5erf7a4sij8i21op4m9yfy5ht2b'
            },
            body: JSON.stringify({
                data: [
                    {
                        Nome,
                        Email,
                        CEP: cep.startsWith(0) ? `'${cep}` : cep,
                        Rua,
                        Bairro,
                        Cidade,
                        Comentario,
                    }
                ]
            })
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .then(() => window.location.reload());
        alert('Informações enviadas, obrigado!');
    }

    return (
        <div className={styles.divContatos}>
            <div className={styles.bodyContatos}>
                <h1>Preencha seus dados para entrarmos em contato!</h1>
                <InputForms label="Nome" type="text" placeholder="Digite seu nome" id="Nome" value={Nome} onChange={pegarNome} />
                <InputForms label="E-mail" type="email" placeholder="Digite seu e-mail" id="Email" value={Email} onChange={pegarEmail} />
                <InputForms
                    label="CEP"
                    type="text"
                    placeholder="Digite seu CEP"
                    value={cep}
                    id="Cep"
                    onInput={(e) => {
                        const novoCep = e.target.value;
                        setCep(novoCep);
                        buscarEndereco(novoCep);
                    }}
                />
                <InputForms label="Rua" type="text" placeholder="Digite sua Rua" value={Rua} id="Rua" onInput={(e) => setRua(e.target.value)} />
                <InputForms label="Bairro" type="text" placeholder="Digite seu Bairro" value={Bairro} id="Bairro" onInput={(e) => setBairro(e.target.value)} />
                <InputForms label="Cidade" type="text" placeholder="Digite sua cidade" value={Cidade} id="Cidade" onInput={(e) => setCidade(e.target.value)} />
                <div className={styles.inputComentario}>
                    <label>Comentário</label>
                    <textarea name="Comentario" placeholder="Deixe sua dúvida aqui" cols="30" rows="5" id="Comentario" onChange={pegarComentario} />
                </div>
                <button onClick={enviarForms} className={styles.botaoContatos}>Pronto!</button>
            </div>
        </div>
    );
}

export default Contatos;
