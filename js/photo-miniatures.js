import { generatePhotosArray } from './mock-data.js';

const renderPhotoMiniatures = () => {
  const photosData = generatePhotosArray();
  const photoMiniatureTemplate = document.querySelector('#picture').content;
  const photoMiniaturesFragment = document.createDocumentFragment();
  const picturesSection = document.querySelector('.pictures');

  photosData.forEach(({url, description, likes, comments}) => {
    const miniatureItemLayout = photoMiniatureTemplate.cloneNode(true);
    miniatureItemLayout.querySelector('.picture__img').src = url;
    miniatureItemLayout.querySelector('.picture__img').alt = description;
    miniatureItemLayout.querySelector('.picture__likes').textContent = likes;
    miniatureItemLayout.querySelector('.picture__comments').textContent = comments.length;
    photoMiniaturesFragment.append(miniatureItemLayout);
  });

  picturesSection.append(photoMiniaturesFragment);
};

export { renderPhotoMiniatures };
