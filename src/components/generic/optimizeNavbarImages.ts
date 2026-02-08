import { getImage } from 'astro:assets';
import bannerWhite from '../../images/banner-white.svg';
import bannerBlue from '../../images/banner-blue.svg';

// Largest display size is h-14 (56px). 2x for retina = 112px height.
const NAVBAR_IMG_HEIGHT = 112;

export async function optimizeNavbarImages() {
  const [optimizedWhite, optimizedBlue] = await Promise.all([
    getImage({ src: bannerWhite, format: 'webp', height: NAVBAR_IMG_HEIGHT }),
    getImage({ src: bannerBlue, format: 'webp', height: NAVBAR_IMG_HEIGHT }),
  ]);
  return {
    bannerWhiteSrc: optimizedWhite.src,
    bannerBlueSrc: optimizedBlue.src,
  };
}
