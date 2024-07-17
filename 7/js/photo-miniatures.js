import { generatePhotosArray } from './mock-data.js';

const photosDataArray = generatePhotosArray();

const renderPhotoMiniatures = (photosData) => {
  const photoMiniatureTemplate = document.querySelector('#picture').content;
  const photoMiniaturesFragment = document.createDocumentFragment();
  const picturesSection = document.querySelector('.pictures');

  photosData.forEach(({url, description, likes, comments}) => {
    const miniatureItemLayout = photoMiniatureTemplate.cloneNode(true);
    const imageElement = miniatureItemLayout.querySelector('.picture__img');
    imageElement.src = url;
    imageElement.alt = description;
    miniatureItemLayout.querySelector('.picture__likes').textContent = likes;
    miniatureItemLayout.querySelector('.picture__comments').textContent = comments.length;
    photoMiniaturesFragment.append(miniatureItemLayout);
  });

  picturesSection.append(photoMiniaturesFragment);
};

renderPhotoMiniatures(photosDataArray);

export { photosDataArray, renderPhotoMiniatures };
