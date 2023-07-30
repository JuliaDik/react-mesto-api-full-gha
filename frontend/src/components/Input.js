function Input({
  type,
  name,
  value,
  handleChange,
  minLength,
  maxLength,
  placeholder,
  location,
  errorMessage,
}) {
  return (
    <>
      <input
        className={`${location}__input ${
          errorMessage && `${location}__input_type_error`
        }`}
        type={type}
        name={name}
        value={value || ""}
        onChange={handleChange}
        minLength={minLength}
        maxLength={maxLength}
        autoComplete="on"
        placeholder={placeholder}
        required
      />
      <span className={`${location}__error-message`}>{errorMessage}</span>
    </>
  );
}

export default Input;
