import { renderPhotoMiniatures } from './photo-miniatures.js';
import { debounce, getRandomArrayElement } from './utils.js';
import { onMiniatureClick } from './image-fullsize-mode.js';

const RANDOM_PHOTOS_AMOUNT = 10;
const RENDER_TIMEOUT_DELAY = 500;

const filterButtonsElement = document.querySelector('.img-filters');

const renderRandomPhotos = (photosData) => {
  const filteredPhotosArray = [];

  for (let i = 0; i < RANDOM_PHOTOS_AMOUNT; i++) {
    let randomPhoto = getRandomArrayElement(photosData)[0];

    while (filteredPhotosArray.includes(randomPhoto)) {
      randomPhoto = getRandomArrayElement(photosData)[0];
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

const changeButtonsState = (evt) => {
  const activeButton = document.querySelector('.img-filters__button--active');

  activeButton.classList.remove('img-filters__button--active');
  evt.target.classList.add('img-filters__button--active');
};

const rerenderMiniatures = (evt, photosData) => {

  const clickedButtonId = evt.target.id;
  const existingMiniatures = document.querySelectorAll('.picture');

  if (evt.target.matches('.img-filters__button')) {

    existingMiniatures.forEach((miniature) => {
      miniature.remove();
    });
    switch (clickedButtonId) {
      case 'filter-default':
        renderPhotoMiniatures(photosData);
        break;

      case 'filter-random':
        renderRandomPhotos(photosData);
        break;

      case 'filter-discussed':
        renderDiscussedPhotos(photosData);
        break;
    }
  }
};

const onFilterButtonsClick = (evt, photosData) => {
  changeButtonsState(evt);
  rerenderMiniatures(evt, photosData);
};

const filterPhotos = (photosData) => {
  filterButtonsElement.classList.remove('img-filters--inactive');
  renderPhotoMiniatures(photosData);
  onMiniatureClick(photosData);

  filterButtonsElement.addEventListener('click', debounce((evt) => {
    onFilterButtonsClick(evt, photosData);
  }, RENDER_TIMEOUT_DELAY));
};

export { filterPhotos };
