import { useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import Input from "./Input";
import useFormAndValidation from "../hooks/useFormAndValidation";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, isLoading }) {
  const { values, errors, isValid, handleChange, resetForm } = useFormAndValidation({
      avatar: "",
    });

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();
    if (isValid) {
      onUpdateAvatar(values.avatar);
    }
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      name="avatar-edit"
      title="Обновить аватар"
      isValid={isValid}
      buttonText={isLoading ? "Сохранение..." : "Сохранить"}
      onSubmit={handleSubmit}
    >
      <div className="popup__input-container">
        <Input
          type="url"
          name="avatar"
          value={values.avatar || ""}
          handleChange={handleChange}
          placeholder="Ссылка на картинку"
          location="popup"
          errorMessage={errors.avatar}
        />
      </div>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
