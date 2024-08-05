import { renderPhotoMiniatures } from './photo-miniatures.js';
import { debounce, getRandomArrayElement } from './utils.js';
import { onMiniatureClick } from './image-fullsize-mode.js';

const RANDOM_PHOTOS_AMOUNT = 10;
const RENDER_TIMEOUT_DELAY = 500;

const filterButtonsElement = document.querySelector('.img-filters');

const renderRandomPhotos = (photosData) => {
  const filteredPhotosArray = [];

  for (let i = 0; i < RANDOM_PHOTOS_AMOUNT; i++) {
    let randomPhoto = getRandomArrayElement(photosData);

    while (filteredPhotosArray.includes(randomPhoto)) {
      randomPhoto = getRandomArrayElement(photosData);
    }
    filteredPhotosArray.push(randomPhoto);
  }

  renderPhotoMiniatures(filteredPhotosArray);
};

const compareCommentsAmount = (photoA, photoB) => {
  const commentsAmountA = photoA.comments.length;
  const commentsAmountB = photoB.comments.length;
  return commentsAmountB - commentsAmountA;
};

const renderDiscussedPhotos = (photosData) => {
  const sortedPhotosArray = photosData.slice().sort(compareCommentsAmount);
  renderPhotoMiniatures(sortedPhotosArray);
};

const changeButtonsHighlight = (evt) => {
  const activeButton = document.querySelector('.img-filters__button--active');

  activeButton.classList.remove('img-filters__button--active');
  evt.target.classList.add('img-filters__button--active');
};

const clearMiniatures = () => {
  const existingMiniatures = document.querySelectorAll('.picture');
  existingMiniatures.forEach((miniature) => {
    miniature.remove();
  });
};

const rerenderMiniatures = (evt, photosData) => {

  const clickedButtonId = evt.target.id;
  clearMiniatures();
  if (evt.target.matches('.img-filters__button')) {
    switch (clickedButtonId) {
      case 'filter-default':
        return renderPhotoMiniatures(photosData);

      case 'filter-random':
        return renderRandomPhotos(photosData);

      case 'filter-discussed':
        return renderDiscussedPhotos(photosData);
    }
  }
};

const rerenderDebounced = debounce((evt, photosData) => {
  rerenderMiniatures(evt, photosData);
}, RENDER_TIMEOUT_DELAY);

const onFilterButtonsClick = (evt, photosData) => {
  changeButtonsHighlight(evt);
  rerenderDebounced(evt, photosData);
};

const initializeMiniatures = (photosData) => {
  filterButtonsElement.classList.remove('img-filters--inactive');
  renderPhotoMiniatures(photosData);
  onMiniatureClick(photosData);

  filterButtonsElement.addEventListener('click', (evt) => {
    onFilterButtonsClick(evt, photosData);
  });
};

export { initializeMiniatures };
