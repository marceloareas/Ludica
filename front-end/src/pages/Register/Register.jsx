import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import styles from './register.module.css'

function Input() {
  const [goToLogin, setGoToLogin] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (goToLogin) {
      navigate("/")
    }
  }, [goToLogin, navigate])

  function handleSubmit(e) {
    e.preventDefault()
    setGoToLogin(true)
  }

  return (
    <section className={styles.center}>
      
      <div className={styles.h1TextMain}>
        <h1>Criar uma conta</h1>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input className={styles.input} type="email" placeholder="E-mail" />
        <input className={styles.input} type="text" placeholder="Nome completo" />
        <input className={styles.input} type="text" placeholder="Nome de usuário" />
        <input className={styles.input} type="password" placeholder="Senha" />
        <input className={styles.input} type="date" />

        <button className={styles.enterLogin}>
          Criar conta
        </button>
      </form>

      <p onClick={() => setGoToLogin(true)}>
        Já tem uma conta?{" "}
        <span className={styles.otherWayEnter}>
          Entrar
        </span>
      </p>

    </section>
  )
}

export default Input