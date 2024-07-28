import { onMiniatureClick } from './image-fullsize-mode.js';
import { renderPhotoMiniatures } from './photo-miniatures.js';

const createPhotoGallery = (photosData) => {
  renderPhotoMiniatures(photosData);
  onMiniatureClick(photosData);
};

export { createPhotoGallery };
