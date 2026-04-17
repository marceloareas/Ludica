import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import './register.module.css'

function Input() {
  const [isLogin, setIsLogin] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin) {
      navigate("/login");
    }
  }, [isLogin, navigate]);

  function handleSubmit(e) {
    e.preventDefault(); 
    setIsLogin(true);
  }

  return (
    <section id="center">
      
      <div className="h1-text-main"> 
        <h1>Criar uma conta</h1>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        {(
          <> 
            <input type="email" placeholder="E-mail" />
            <input type="text" placeholder="Nome completo" />
            <input type="text" placeholder="Nome de usuário" />
            <input type="password" placeholder="Senha" />
            <input type="date" placeholder="Data de Nascimento" />
          </>
        )}

        <button className="enter-login">Entrar</button>
      </form>

      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer' }}>
        Já tem uma conta? <span className="other-way-enter">Entrar</span>
      </p>

    </section>
  )
}

export default Input