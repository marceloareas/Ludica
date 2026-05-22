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
          birthDate: dataNascimento
        })
      })

      console.log(response)

      if (!response.ok) {
        throw new Error('Erro ao criar conta')
      }

      alert('Conta criada!')
      navigate("/home")
    
    } catch (err) {
      console.error(err)
      alert('Erro ao criar conta')
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

        <input
          className={styles.input}
          type="text"
          placeholder="Nome de usuário"
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