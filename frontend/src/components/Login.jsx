import AuthForm from "./AuthForm";

function Login({ onLogin }) {
  return (
    <div className="authentication">
      <AuthForm
        name="login"
        title="Вход"
        buttonText="Войти"
        onSubmitClick={onLogin}
      />
    </div>
  );
}

export default Login;
