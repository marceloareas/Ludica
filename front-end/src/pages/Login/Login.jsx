import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import './Login.css'

function Input() {
  const [goToRegister, setGoToRegister] = useState(false);
  const [goToHome, setGoToHome] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (goToRegister) {
      navigate("/register");
    }
    if (goToHome) {
      navigate("/home");
    }
  }, [goToRegister, goToHome, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setGoToHome(true);
  }
  function handleGoRegister() {
    setGoToRegister(true);
  }

  return (
    <section id="center">
      
      <div className="h1-text-main"> 
        <h1>Entrar</h1>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        {(
          <>
            <input type="text" placeholder="Nome de usuário" />
            <input type="password" placeholder="Senha" />
          </>
        )}

        <button className="enter-login">Entrar</button>
      </form>

      <p onClick={handleGoRegister} style={{ cursor: 'pointer' }}>
        Não tem conta? <span className="other-way-enter">Criar uma</span>
      </p>

    </section>
  )
}

export default Input