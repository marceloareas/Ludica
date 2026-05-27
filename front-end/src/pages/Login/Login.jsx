import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import styles from './login.module.css'

function Input() {
  const navigate = useNavigate()

  const [nomeUsuario, setNomeUsuario] = useState('')
  const [senha, setSenha] = useState('')

  async function handleLogin(e) {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: nomeUsuario,
          password: senha
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao fazer login')
      }

      const data = await response.json()
      console.log('Login bem-sucedido:', data)

      localStorage.setItem('token', data.token);
      localStorage.setItem('id_user', data.user.id);
      localStorage.setItem('userName', data.user.userName);
      localStorage.setItem('email', data.user.email);
      localStorage.setItem('nome_completo', data.user.nome_completo);
      localStorage.setItem('data_nascimento', data.user.data_nascimento);

      navigate("/home")

    } catch (err) {
      console.error(err)
      alert('Erro no login')
    }


  }

  return (
    <section className={styles.center}>
      
      <div className={styles.h1TextMain}>
        <h1>Entrar</h1>
      </div>

      <form className={styles.form} onSubmit={handleLogin}>

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

        <button type="submit" className={styles.enterLogin}>
          Entrar
        </button>

      </form>

      <p onClick={() => navigate("/register")}>
        Não tem conta?{" "}
        <span className={styles.otherWayEnter}>
          Criar uma
        </span>
      </p>

    </section>
  )
}

export default Input