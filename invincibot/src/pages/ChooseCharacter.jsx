import backgroundImage from '../assets/Choose-Your-Character.jpg';
import '../pages/ChooseCharacter.css';
import "../App.css";

export default function ChooseCharacter() {
  return (
    <div className="choose-character flex flex-col items-center justify-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="title"> Invincibot </div>
      <div className="subtitle"> Choose Your Character </div>
      <div className="character-options">
        <button className="character-button">Warrior</button>
        <button className="character-button">Mage</button>
        <button className="character-button">Rogue</button>
      </div>
    </div>
  )
}