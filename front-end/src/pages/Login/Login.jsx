import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import './styles.css'

function Input() {
  const [isLogin, setIsLogin] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin) {
      navigate("/register");
    }
  }, [isLogin, navigate]);

  function handleSubmit(e) {
    e.preventDefault(); 
    setIsLogin(true);
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

      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer' }}>
        Não tem conta? <span className="other-way-enter">Criar uma</span>
      </p>

    </section>
  )
}

export default Input