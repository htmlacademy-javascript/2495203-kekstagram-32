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

const showBigPicture = () => {
  bigPictureSection.classList.remove('hidden');
  commentCountElement.classList.add('hidden');
  commentsLoaderElement.classList.add('hidden');
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
};

const onMiniatureClick = (photosData) => {

  const miniaturesListElement = document.querySelector('.pictures');
  miniaturesListElement.addEventListener('click', (evt) => {
    if (evt.target.matches('.picture__img')) {
      const miniaturesArray = Array.from(document.querySelectorAll('.picture__img'));
      const targetElementIndex = miniaturesArray.indexOf(evt.target);
      const targetPhotoData = photosData[targetElementIndex];

      bigPictureImgElement.src = targetPhotoData.url;
      likesCountElement.textContent = targetPhotoData.likes;
      shownCommentsCountElement.textContent = targetPhotoData.comments.length;
      commentsTotalCountElement.textContent = targetPhotoData.comments.length;
      captionElement.textContent = targetPhotoData.description;
      renderComments(targetPhotoData.comments);
      showBigPicture();

      bigPictureCloseButton.addEventListener('click', onCrossClick);
      document.addEventListener('keydown', onDocumentKeyDown);
    }
  });
};

function onCrossClick () {
  hideBigPicture();
}

function onDocumentKeyDown (evt) {
  if (evt.key === 'Escape') {
    if (!bigPictureSection.classList.contains('hidden')) {
      hideBigPicture();
    }
  }
}

export { onMiniatureClick };
