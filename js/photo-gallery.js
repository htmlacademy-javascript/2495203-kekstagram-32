import { onMiniatureClick } from './image-fullsize-mode.js';
import { renderPhotoMiniatures } from './photo-miniatures.js';

const ERROR_MESSAGE_TIME = 5000;

const createPhotoGallery = (photosData) => {
  renderPhotoMiniatures(photosData);
  onMiniatureClick(photosData);
};

const onPhotosGettingError = () => {
  const errorMessageTemplateClone = document.querySelector('#data-error').content.cloneNode(true);
  document.body.append(errorMessageTemplateClone);
  const errorMessageElement = document.querySelector('.data-error');

  setTimeout(() => {
    errorMessageElement.remove();
  }, ERROR_MESSAGE_TIME);
};

export { createPhotoGallery, onPhotosGettingError };
