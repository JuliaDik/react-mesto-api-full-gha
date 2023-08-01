import Popup from "./Popup";
import successIcon from "../images/succes-icon.svg";
import failIcon from "../images/fail-icon.svg";

function InfoTooltip({ isOpen, onClose, isSucceeded }) {
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className="popup__info-container">
        <img
          className="popup__info-image"
          src={isSucceeded ? successIcon : failIcon}
          alt={isSucceeded ? "Успешно" : "Ошибка"}
        />
        <p className="popup__info-message">
          {isSucceeded
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так! Попробуйте еще раз."}
        </p>
      </div>
    </Popup>
  );
}

export default InfoTooltip;
