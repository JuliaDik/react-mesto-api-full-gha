import { Link } from "react-router-dom";
import AuthForm from "./AuthForm";

function Register({ onRegister }) {
  return (
    <div className="authentication">
      <AuthForm
        name="register"
        title="Регистрация"
        buttonText="Зарегистрироваться"
        onSubmitClick={onRegister}
      />
      <p className="authentication__question">
        Уже зарегистрированы? {""}
        <Link className="authentication__login-link" to="/sign-in">
          Войти
        </Link>
      </p>
    </div>
  );
}

export default Register;
