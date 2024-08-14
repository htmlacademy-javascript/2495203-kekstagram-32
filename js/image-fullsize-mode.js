import { isEscape } from './utils.js';

const COMMENTS_TO_LOAD_AMOUNT = 5;

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
const commentsCollection = commentsListElement.children;

const createCommentElement = (commentsData, index) => {
  const { avatar, message, name } = commentsData[index];
  const newCommentElement = commentElement.cloneNode(true);
  const commentImageElement = newCommentElement.querySelector('.social__picture');
  const commentTextElement = newCommentElement.querySelector('.social__text');

  commentImageElement.src = avatar;
  commentImageElement.alt = name;
  commentTextElement.textContent = message;
  commentsListElement.append(newCommentElement);
};

const createFirstComments = (lowerCommentIndex, firstCommentsAmount, commentsData) => {
  for (let i = lowerCommentIndex; i < firstCommentsAmount; i++) {
    createCommentElement(commentsData, i);
  }
};

const renderComments = (commentsData) => {
  commentsTotalCountElement.textContent = commentsData.length;

  if (commentsData.length > COMMENTS_TO_LOAD_AMOUNT) {

    createFirstComments(0, COMMENTS_TO_LOAD_AMOUNT, commentsData);
    const newShownCommentsAmount = commentsCollection.length;
    shownCommentsCountElement.textContent = newShownCommentsAmount;
    commentsLoaderElement.classList.remove('hidden');
    commentsLoaderElement.onclick = function () {
      onCommentsLoaderClick(commentsData);
    };
    return;
  }

  createFirstComments(0, commentsData.length, commentsData);
  shownCommentsCountElement.textContent = commentsData.length;
  commentsLoaderElement.classList.add('hidden');

};

const showBigPicture = () => {
  bigPictureSection.classList.remove('hidden');
  commentCountElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const hideBigPicture = () => {
  bigPictureSection.classList.add('hidden');
  commentCountElement.classList.remove('hidden');
  commentsLoaderElement.classList.remove('hidden');
  document.body.classList.remove('modal-open');

  bigPictureImgElement.src = '';
  likesCountElement.textContent = '';
  shownCommentsCountElement.textContent = '';
  commentsTotalCountElement.textContent = '';
  captionElement.textContent = '';

  document.removeEventListener('keydown', onDocumentKeyDown);
  bigPictureCloseButton.removeEventListener('click', onCrossClick);
  commentsLoaderElement.onclick = '';
};

const onMiniatureClick = (photosData) => {

  const miniaturesListElement = document.querySelector('.pictures');
  miniaturesListElement.addEventListener('click', (evt) => {

    if (evt.target.matches('.picture__img')) {
      const parentElement = evt.target.closest('.picture');
      const targetElementId = Number(parentElement.dataset.photoId);
      const targetPhotoData = photosData.find((photoItem) => photoItem.id === targetElementId);

      bigPictureImgElement.src = targetPhotoData.url;
      likesCountElement.textContent = targetPhotoData.likes;
      captionElement.textContent = targetPhotoData.description;
      commentsListElement.innerHTML = '';
      renderComments(targetPhotoData.comments);
      showBigPicture();

      bigPictureCloseButton.addEventListener('click', onCrossClick);
      document.addEventListener('keydown', onDocumentKeyDown);
    }
  });
};

function onCrossClick() {
  hideBigPicture();
}

function onDocumentKeyDown(evt) {
  if (isEscape(evt)) {
    evt.preventDefault();
    if (!bigPictureSection.classList.contains('hidden')) {
      hideBigPicture();
    }
  }
}

function onCommentsLoaderClick(commentsData) {

  const lastShownCommentIndex = commentsCollection.length - 1;
  const lastDataArrayIndex = commentsData.length - 1;
  const lowerCommentToLoadIndex = lastShownCommentIndex + 1;
  const upperCommentToLoadIndex = (lastShownCommentIndex + COMMENTS_TO_LOAD_AMOUNT >= lastDataArrayIndex) ? lastDataArrayIndex : lastShownCommentIndex + COMMENTS_TO_LOAD_AMOUNT;

  for (let i = lowerCommentToLoadIndex; i <= upperCommentToLoadIndex; i++) {
    createCommentElement(commentsData, i);
  }

  const newShownCommentsAmount = commentsCollection.length;
  shownCommentsCountElement.textContent = newShownCommentsAmount;

  if (upperCommentToLoadIndex === lastDataArrayIndex) {
    commentsLoaderElement.classList.add('hidden');
  }
}

export { onMiniatureClick };
