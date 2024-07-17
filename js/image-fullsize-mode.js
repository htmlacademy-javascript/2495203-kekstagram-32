import { photosDataArray } from './photo-miniatures.js';

const bigPictureSection = document.querySelector('.big-picture');
const bigPictureImgElement = bigPictureSection.querySelector('.big-picture__img img');
const likesCountElement = bigPictureSection.querySelector('.likes-count');
const shownCommentsCountElement = bigPictureSection.querySelector('.social__comment-shown-count');
const commentsTotalCountElement = bigPictureSection.querySelector('.social__comment-total-count');
const commentCountElement = bigPictureSection.querySelector('.social__comment-count');
const commentsLoaderElement = bigPictureSection.querySelector('.comments-loader');
const captionElement = bigPictureSection.querySelector('.social__caption');
const bigPictureCloseButton = bigPictureSection.querySelector('.big-picture__cancel');
const commentsListElement = bigPictureSection.querySelector('.social__comments');
const commentElement = bigPictureSection.querySelector('.social__comment');

const renderComments = (commentsData) => {
  const commentsListFragment = document.createDocumentFragment();

  commentsData.forEach(({ avatar, message, name }) => {
    const commentElementClone = commentElement.cloneNode(true);
    const commentImageElement = commentElementClone.querySelector('.social__picture');
    const commentTextElement = commentElementClone.querySelector('.social__text');
    commentImageElement.src = avatar;
    commentImageElement.alt = name;
    commentTextElement.textContent = message;
    commentsListFragment.append(commentElementClone);
  });

  commentsListElement.innerHTML = '';
  commentsListElement.append(commentsListFragment);
};

const toggleBigPicture = () => {
  bigPictureSection.classList.toggle('hidden');
  commentCountElement.classList.toggle('hidden');
  commentsLoaderElement.classList.toggle('hidden');
  document.body.classList.toggle('modal-open');
};

const closePopup = () => {
  toggleBigPicture();

  bigPictureImgElement.src = '';
  likesCountElement.textContent = '';
  shownCommentsCountElement.textContent = '';
  commentsTotalCountElement.textContent = '';
  captionElement.textContent = '';

  document.removeEventListener('keydown', onDocumentKeyDown);
  bigPictureCloseButton.removeEventListener('click', onCrossClick);
};

const onMiniatureClick = (evt) => {
  const miniaturesArray = Array.from(document.querySelectorAll('.picture__img'));
  const targetElementIndex = miniaturesArray.indexOf(evt.target);
  const { url, description, likes, comments } = photosDataArray[targetElementIndex];

  bigPictureImgElement.src = url;
  likesCountElement.textContent = likes;
  shownCommentsCountElement.textContent = comments.length;
  commentsTotalCountElement.textContent = comments.length;
  captionElement.textContent = description;
  renderComments(comments);

  bigPictureCloseButton.addEventListener('click', onCrossClick);
  document.addEventListener('keydown', onDocumentKeyDown);
  bigPictureCloseButton.addEventListener('click', onCrossClick);
  toggleBigPicture();
};

const chargeMiniatures = () => {
  const miniaturesContainer = document.querySelector('.pictures');
  miniaturesContainer.addEventListener('click', (evt) => {
    if (evt.target.matches('.picture__img')) {
      onMiniatureClick(evt);
    }
  });
};

function onCrossClick () {
  closePopup();
}

function onDocumentKeyDown (evt) {
  if (evt.key === 'Escape') {
    if (!bigPictureSection.classList.contains('hidden')) {
      closePopup();
    }
  }
}

chargeMiniatures();
