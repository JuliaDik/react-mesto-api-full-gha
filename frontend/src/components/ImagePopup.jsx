import Popup from "./Popup";

function ImagePopup({ card, onClose, type }) {
  return (
    <Popup isOpen={card} onClose={onClose} type={type}>
      <img
        className="popup__image"
        src={card ? card.link : "#"}
        alt={card ? card.name : "#"}
      />
      <p className="popup__caption">{card ? card.name : ""}</p>
    </Popup>
  );
}

export default ImagePopup;
