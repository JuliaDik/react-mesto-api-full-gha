function Form({
  name,
  title,
  isValid,
  buttonText,
  onSubmit,
  location,
  type,
  children,
}) {
  return (
    <form
      className={`${location}__form`}
      name={name}
      onSubmit={onSubmit}
      noValidate
    >
      <h2 className={`${location}__title ${location}__title_type_${type}`}>
        {title}
      </h2>
      {children}
      <button
        className={`${location}__submit-button ${
          !isValid && `${location}__submit-button_disabled`
        }`}
        type="submit"
        aria-label="кнопка отправки"
        disabled={!isValid}
      >
        {buttonText}
      </button>
    </form>
  );
}

export default Form;
