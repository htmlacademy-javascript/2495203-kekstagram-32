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
const commentsToLoadAmount = 5;
const commentsCollection = commentsListElement.children;

const createFirstComments = (lowerCommentIndex, upperCommentIndex, commentsData) => {
  for (let i = lowerCommentIndex; i < upperCommentIndex; i++) {
    const { avatar, message, name } = commentsData[i];
    const newCommentElement = commentElement.cloneNode(true);
    const commentImageElement = newCommentElement.querySelector('.social__picture');
    const commentTextElement = newCommentElement.querySelector('.social__text');

    commentImageElement.src = avatar;
    commentImageElement.alt = name;
    commentTextElement.textContent = message;
    commentsListElement.append(newCommentElement);
  }
};

const renderComments = (commentsData) => {
  commentsTotalCountElement.textContent = commentsData.length;

  if (commentsData.length === 0) {
    commentsLoaderElement.classList.add('hidden');
    shownCommentsCountElement.textContent = commentsData.length;
  } else if (commentsData.length <= commentsToLoadAmount) {

    createFirstComments(0, commentsData.length, commentsData);
    shownCommentsCountElement.textContent = commentsData.length;
    commentsLoaderElement.classList.add('hidden');
  } else {

    createFirstComments(0, commentsToLoadAmount, commentsData);
    const newShownCommentsAmount = commentsCollection.length;
    shownCommentsCountElement.textContent = newShownCommentsAmount;

    commentsLoaderElement.classList.remove('hidden');
    commentsLoaderElement.onclick = function () {
      onCommentsLoaderClick(commentsData);
    };
  }

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
      const miniaturesArray = Array.from(document.querySelectorAll('.picture__img'));
      const targetElementIndex = miniaturesArray.indexOf(evt.target);
      const targetPhotoData = photosData[targetElementIndex];

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
  if (evt.key === 'Escape') {
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
  const upperCommentToLoadIndex = (lastShownCommentIndex + commentsToLoadAmount >= lastDataArrayIndex) ? lastDataArrayIndex : lastShownCommentIndex + commentsToLoadAmount;

  for (let i = lowerCommentToLoadIndex; i <= upperCommentToLoadIndex; i++) {
    const { avatar, message, name } = commentsData[i];
    const newCommentElement = commentElement.cloneNode(true);
    const commentImageElement = newCommentElement.querySelector('.social__picture');
    const commentTextElement = newCommentElement.querySelector('.social__text');

    commentImageElement.src = avatar;
    commentImageElement.alt = name;
    commentTextElement.textContent = message;
    commentsListElement.append(newCommentElement);
  }

  const newShownCommentsAmount = commentsCollection.length;
  shownCommentsCountElement.textContent = newShownCommentsAmount;

  if (upperCommentToLoadIndex === lastDataArrayIndex) {
    commentsLoaderElement.classList.add('hidden');
  }
}

export { onMiniatureClick };
