import Form from "./Form";
import Input from "./Input";
import useFormAndValidation from "../hooks/useFormAndValidation";

function AuthForm({ name, title, buttonText, onSubmitClick, children }) {
  const { values, errors, isValid, handleChange } = useFormAndValidation({
    email: "",
    password: "",
  });

  function handleSubmit(evt) {
    evt.preventDefault();
    if (isValid) {
      onSubmitClick(values.email, values.password);
    }
  }

  return (
    <>
      <Form
        name={name}
        title={title}
        isValid={isValid}
        buttonText={buttonText}
        onSubmit={handleSubmit}
        location="authentication"
      >
        <div className="authentication__input-container">
          <Input
            type="email"
            name="email"
            value={values.email || ""}
            handleChange={handleChange}
            minLength="2"
            maxLength="30"
            location="authentication"
            errorMessage={errors.email}
          />
          <Input
            type="password"
            name="password"
            value={values.password || ""}
            handleChange={handleChange}
            minLength="6"
            location="authentication"
            errorMessage={errors.password}
          />
        </div>
      </Form>
      {children}
    </>
  );
}

export default AuthForm;
