import { mascotOne, mascotTwo } from '../assets/images';

const RANDOM_MASCOT_IMAGE = Math.random() < 0.5 ? mascotOne : mascotTwo;

export const CursorMascot = () => (
  <div className="cursor-mascot" aria-hidden="true">
    <img src={RANDOM_MASCOT_IMAGE} alt="" draggable={false} />
  </div>
);
