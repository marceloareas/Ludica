import { useState } from 'react'
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
  const [perfilUsuario, setPerfilUsuario] = useState('Aluno')

  // Mensagem de erro exibida diretamente na página.
  const [erro, setErro] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    // Remove mensagens de uma tentativa anterior.
    setErro('')

    if (senha !== confirmarSenha) {
      setErro('As senhas precisam ser iguais')
      return
    }

    try {
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: nomeCompleto,
          userName: nomeUsuario,
          email,
          password: senha,
          birthDate: dataNascimento,
          perfil_usuario: perfilUsuario
        })
      })

      /*
       * Lê a resposta do back-end.
       * Em caso de Gamertag duplicada, por exemplo:
       *
       * {
       *   "error": "Gamertag já está em uso"
       * }
       */
      const data = await response.json()

      if (!response.ok) {
        setErro(data.error || 'Erro ao criar conta')
        return
      }

      alert('Conta criada!')
      navigate("/")

    } catch (err) {
      console.error(err)

      setErro(
        'Não foi possível conectar ao servidor. Tente novamente.'
      )
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
          onChange={(e) => {
            setEmail(e.target.value)
            setErro('')
          }}
          required
        />

        <input
          className={styles.input}
          type="text"
          placeholder="Nome completo"
          value={nomeCompleto}
          onChange={(e) => {
            setNomeCompleto(e.target.value)
            setErro('')
          }}
          required
        />

        <p className={styles.gamertag}>
          Nome que será exibido para os outros usuários
        </p>

        <input
          className={styles.inputGamertag}
          type="text"
          placeholder="Gamertag"
          value={nomeUsuario}
          onChange={(e) => {
            setNomeUsuario(e.target.value)
            setErro('')
          }}
          required
        />

        <select
          className={styles.input}
          value={perfilUsuario}
          onChange={(e) => {
            setPerfilUsuario(e.target.value)
            setErro('')
          }}
          required
        >
          <option value="Aluno">Aluno</option>
          <option value="Professor">Professor</option>
        </select>

        <input
          className={styles.input}
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => {
            setSenha(e.target.value)
            setErro('')
          }}
          required
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Confirme sua senha"
          value={confirmarSenha}
          onChange={(e) => {
            setConfirmarSenha(e.target.value)
            setErro('')
          }}
          required
        />

        <input
          className={styles.input}
          type="date"
          value={dataNascimento}
          onChange={(e) => {
            setDataNascimento(e.target.value)
            setErro('')
          }}
          required
        />

        {erro && (
          <div
            role="alert"
            className={styles.errorMessage}
          >
            {erro}
          </div>
        )}

        <button
          type="submit"
          className={styles.enterLogin}
        >
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