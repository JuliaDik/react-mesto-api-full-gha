import Popup from "./Popup";
import Form from "./Form";

function PopupWithForm({
  type,
  isOpen,
  onClose,
  name,
  title,
  isValid,
  buttonText,
  onSubmit,
  children,
}) {
  return (
    <Popup type={type} isOpen={isOpen} onClose={onClose}>
      <Form
        name={name}
        title={title}
        isValid={isValid}
        buttonText={buttonText}
        onSubmit={onSubmit}
        location="popup"
        type={type}
      >
        {children}
      </Form>
    </Popup>
  );
}

export default PopupWithForm;
