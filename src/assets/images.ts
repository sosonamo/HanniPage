// 배포 시 생성되는 목록이 없으면 기존 사진을 사용합니다.
const generated = import.meta.glob('./generated/drive-images.json', { eager: true, import: 'default' });
const driveImages = (generated['./generated/drive-images.json'] ?? {}) as Record<string, string>;
export const driveImage = (key: string, fallback: string) =>
  driveImages[key] ? `${import.meta.env.BASE_URL}${driveImages[key]}` : fallback;

// 프로젝트 이미지 경로는 이 파일에서 관리합니다.
import mascotOneFallback from '../../assets/character_No0-1_final.png';
export const mascotOne = driveImage('mascotOne', mascotOneFallback);
import mascotTwoFallback from '../../assets/character_No0-2_final.png';
export const mascotTwo = driveImage('mascotTwo', mascotTwoFallback);
import hanniLogoFallback from '../../assets/Logo_White.png';
export const hanniLogo = driveImage('hanniLogo', hanniLogoFallback);
