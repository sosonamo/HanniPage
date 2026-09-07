import mascotOne from '../../assets/character_No0-1_final.png';
import mascotTwo from '../../assets/character_No0-2_final.png';

const RANDOM_MASCOT_IMAGE = Math.random() < 0.5 ? mascotOne : mascotTwo;

export const CursorMascot = () => (
  <div className="cursor-mascot" aria-hidden="true">
    <img src={RANDOM_MASCOT_IMAGE} alt="" draggable={false} />
  </div>
);
