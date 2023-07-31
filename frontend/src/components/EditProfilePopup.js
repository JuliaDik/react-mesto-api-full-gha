import { useEffect, useContext } from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import useFormAndValidation from "../hooks/useFormAndValidation";
import Input from "./Input";

function EditProfilePopup({ isOpen, onClose, onUpdateInfo, isLoading }) {
  const currentUser = useContext(CurrentUserContext);

  const { values, errors, isValid, setIsValid, handleChange, setValues } = useFormAndValidation({
      name: "",
      about: "",
    });

  useEffect(() => {
    setValues({
      name: currentUser.name,
      about: currentUser.about,
    });
    setIsValid(true);
  }, [setValues, setIsValid, currentUser, isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();
    if (isValid) {
      onUpdateInfo(values.name, values.about);
    }
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      name="profile-edit"
      title="Редактировать профиль"
      isValid={isValid}
      buttonText={isLoading ? "Сохранение..." : "Сохранить"}
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
          placeholder="Имя"
          location="popup"
          errorMessage={errors.name}
        />
        <Input
          type="text"
          name="about"
          value={values.about || ""}
          handleChange={handleChange}
          minLength="2"
          maxLength="30"
          placeholder="О себе"
          location="popup"
          errorMessage={errors.name}
        />
      </div>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
