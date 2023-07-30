import { useEffect } from "react";

function Popup({ isOpen, onClose, type, children }) {
  // закрытие Escape
  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === "Escape") {
        onClose();
      }
    }
    // обработчик висит только при открытом попапе
    if (isOpen) {
      document.addEventListener("keydown", closeByEscape);
      return () => document.removeEventListener("keydown", closeByEscape);
    }
  }, [isOpen, onClose]);

  // закрытие overlay
  const handleOverlay = (evt) => {
    if (evt.target === evt.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`popup ${isOpen && "popup_opened"} popup_type_${type}`}
      onClick={handleOverlay}
    >
      <div className="popup__container">
        {children}
        <button
          className="popup__close-button"
          type="button"
          aria-label="кнопка-закрыть"
          onClick={onClose}
        />
      </div>
    </div>
  );
}

export default Popup;
