import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import styles from './register.module.css'

function Input() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [nomeUsuario, setNomeUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [tipoUsuario, setTipoUsuario] = useState('Aluno')

  async function handleSubmit(e) {
    e.preventDefault()

    if (senha !== confirmarSenha) {
      alert('As senhas precisam ser iguais')
      return
    }

    try {
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nomeCompleto,
          userName: nomeUsuario,
          email,
          password: senha,
          birthDate: dataNascimento,
          tipoUsuario
        })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Erro ao criar conta')
      }

      alert('Conta criada!')
      navigate("/")

    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  return (
    <section className={styles.center}>

      <div className={styles.h1TextMain}>
        <h1>Criar uma conta</h1>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>

        <input
          className={styles.input}
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className={styles.input}
          type="text"
          placeholder="Nome completo"
          value={nomeCompleto}
          onChange={(e) => setNomeCompleto(e.target.value)}
        />

        <p className={styles.gametarg}>Nome que será exibido para os outros usuários</p>
        <input
          className={styles.inputGametarg}
          type="text"
          placeholder="Gametarg"
          value={nomeUsuario}
          onChange={(e) => setNomeUsuario(e.target.value)}
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Confirme sua senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
        />

        <input
          className={styles.input}
          type="date"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
        />

        <p className={styles.gametarg}>Você é:</p>
        <select
          className={styles.input}
          value={tipoUsuario}
          onChange={(e) => setTipoUsuario(e.target.value)}
        >
          <option value="Aluno">Aluno</option>
          <option value="Professor">Professor</option>
        </select>

        <button type="submit" className={styles.enterLogin}>
          Criar conta
        </button>

      </form>

      <p>
        Já tem uma conta?{" "}
        <span
          className={styles.otherWayEnter}
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          Entrar
        </span>
      </p>

    </section>
  )
}

export default Input