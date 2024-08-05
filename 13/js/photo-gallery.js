import { initializeMiniatures } from './photo-filtration.js';

const ERROR_MESSAGE_TIME = 5000;

const createPhotoGallery = (photosData) => {
  initializeMiniatures(photosData);
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
