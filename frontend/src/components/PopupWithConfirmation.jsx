import PopupWithForm from "./PopupWithForm";

function PopupWithConfirmation({
  type,
  card,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) {
  function handleSubmit(evt) {
    evt.preventDefault();
    onConfirm(card);
  }

  return (
    <PopupWithForm
      type={type}
      isOpen={isOpen}
      onClose={onClose}
      name="card-delete"
      title="Вы уверены?"
      isValid={true}
      buttonText={isLoading ? "Удаление..." : "Да"}
      onSubmit={handleSubmit}
    ></PopupWithForm>
  );
}

export default PopupWithConfirmation;
