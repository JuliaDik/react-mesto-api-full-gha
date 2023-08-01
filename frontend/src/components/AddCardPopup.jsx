import { useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import Input from "./Input";
import useFormAndValidation from "../hooks/useFormAndValidation";

function AddCardPopup({ isOpen, onClose, onAddCard, isLoading }) {
  const { values, errors, isValid, handleChange, resetForm } = useFormAndValidation({
    name: "",
    link: "",
  });

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  function handleSubmit(evt) {
    evt.preventDefault();
    if (isValid) {
      onAddCard(values.name, values.link);
    }
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      name="card-add"
      title="Новое место"
      isValid={isValid}
      buttonText={isLoading ? "Сохранение..." : "Создать"}
      onSubmit={handleSubmit}
    >
      <div className="popup__input-container">
        <Input
          type="text"
          name="name"
          value={values.name || ""}
          handleChange={handleChange}
          minLength="2"
          maxLength="30"
          placeholder="Название"
          location="popup"
          errorMessage={errors.name}
        />
        <Input
          type="url"
          name="link"
          value={values.link || ""}
          handleChange={handleChange}
          placeholder="Ссылка на картинку"
          location="popup"
          errorMessage={errors.link}
        />
      </div>
    </PopupWithForm>
  );
}

export default AddCardPopup;
