import { uploadPhoto } from './api.js';
import { isEscape } from './utils.js';

const MIN_SCALE_VALUE = 25;
const MAX_SCALE_VALUE = 100;
const SCALE_CHANGING_STEP = 25;
const COMMENT_MAX_LENGTH = 140;
const HASHTAG_PATTERN = /^#[a-zа-яё0-9]{1,19}$/i;
const MULTIPLE_SPACES_PATTERN = /\s{2,}/g;
const MAX_HASHTAGS_AMOUNT = 5;
const FILTERS_DICTIONARY = {
  chrome: {
    minValue: 0,
    maxValue: 1,
    step: 0.1,
    filterName: 'grayscale',
    units: ''
  },
  sepia: {
    minValue: 0,
    maxValue: 1,
    step: 0.1,
    filterName: 'sepia',
    units: ''
  },
  marvin: {
    minValue: 0,
    maxValue: 100,
    step: 1,
    filterName: 'invert',
    units: '%'
  },
  phobos: {
    minValue: 0,
    maxValue: 3,
    step: 0.1,
    filterName: 'blur',
    units: 'px'
  },
  heat: {
    minValue: 1,
    maxValue: 3,
    step: 0.1,
    filterName: 'brightness',
    units: ''
  }
};
const UPLOAD_PHOTO_ROUTE = 'https://32.javascript.htmlacademy.pro/kekstagram';

const uploadForm = document.querySelector('.img-upload__form');
const uploadInputElement = uploadForm.querySelector('.img-upload__input');
const editWindow = uploadForm.querySelector('.img-upload__overlay');
const editWindowCloseButton = editWindow.querySelector('.img-upload__cancel');
const previewImage = editWindow.querySelector('.img-upload__preview img');
const uploadFormSubmitButton = editWindow.querySelector('.img-upload__submit');
const effectsPreviewElements = editWindow.querySelectorAll('.effects__preview');
const effectLevelContainer = editWindow.querySelector('.img-upload__effect-level');
const effectsLevelInput = editWindow.querySelector('.effect-level__value');
const effectSliderContainer = editWindow.querySelector('.effect-level__slider');
const effectsContainer = editWindow.querySelector('.effects');
const scaleDowngradeButton = editWindow.querySelector('.scale__control--smaller');
const scaleUpgradeButton = editWindow.querySelector('.scale__control--bigger');
const scaleInput = editWindow.querySelector('.scale__control--value');
const hashtagsInput = editWindow.querySelector('.text__hashtags');
const commentTextarea = editWindow.querySelector('.text__description');


const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
  errorTextParent: 'img-upload__field-wrapper'
});

const validateHashtagsFormat = (inputValue) => {
  if (inputValue === '') {
    return true;
  }
  const hashtagsArray = inputValue.trim().replaceAll(MULTIPLE_SPACES_PATTERN, ' ').split(' ');
  return hashtagsArray.every((hashtag) => HASHTAG_PATTERN.test(hashtag));
};

const validateHashtagsUniqueness = (inputValue) => {
  let isValid = true;
  const hashtagsArray = inputValue.trim().replaceAll(MULTIPLE_SPACES_PATTERN, ' ').split(' ').map((hashtag) => hashtag.toLowerCase());
  const usedHashtags = [];
  hashtagsArray.forEach((hashtag) => {
    if (usedHashtags.includes(hashtag)) {
      isValid = false;
    }
    usedHashtags.push(hashtag);
  });
  return isValid;
};

const validateHashtagsAmount = (inputValue) => {
  const hashtagsArray = inputValue.trim().replaceAll(MULTIPLE_SPACES_PATTERN, ' ').split(' ');
  return hashtagsArray.length <= MAX_HASHTAGS_AMOUNT;
};

const validateCommentLength = (textareaValue) => textareaValue.trim().replaceAll(MULTIPLE_SPACES_PATTERN, ' ').length <= COMMENT_MAX_LENGTH;

pristine.addValidator(hashtagsInput, validateHashtagsFormat, 'Неверный формат хэштега', 1, true);
pristine.addValidator(hashtagsInput, validateHashtagsUniqueness, 'Хэштеги должны быть уникальными', 2, true);
pristine.addValidator(hashtagsInput, validateHashtagsAmount, 'Должно быть не больше 5 хэштегов', 3, true);
pristine.addValidator(commentTextarea, validateCommentLength, 'Максимальная длина комментария 140 символов');

const applyFilter = (filterOptionsObject) => {

  effectLevelContainer.classList.remove('hidden');

  effectSliderContainer.noUiSlider.on('update', (sliderValue) => {
    effectsLevelInput.setAttribute('value', parseFloat(sliderValue, 1));
    previewImage.style.filter = `${filterOptionsObject.filterName}(${sliderValue}${filterOptionsObject.units})`;
  });

  effectSliderContainer.noUiSlider.updateOptions({
    range: {
      min: filterOptionsObject.minValue,
      max: filterOptionsObject.maxValue
    },
    step: filterOptionsObject.step,
    start: filterOptionsObject.maxValue
  });
};

const resetEditWindow = () => {
  uploadForm.reset();
  previewImage.src = '';
  effectsPreviewElements.forEach((previewElement) => {
    previewElement.style.backgroundImage = '';
  });
  scaleInput.setAttribute('value', '100%');
  scaleDowngradeButton.disabled = false;
  scaleUpgradeButton.disabled = false;
  previewImage.removeAttribute('style');
  effectsLevelInput.setAttribute('value', '');
};

const hideEditWindow = () => {
  editWindow.classList.add('hidden');
  document.body.classList.remove('modal-open');
  resetEditWindow();
  pristine.reset();
  effectSliderContainer.noUiSlider.destroy();

  document.removeEventListener('keydown', onDocumentKeydown);
};

const showEditWindow = () => {
  const uploadingImage = uploadInputElement.files[0];
  const uploadingImagePath = URL.createObjectURL(uploadingImage);

  previewImage.src = uploadingImagePath;
  effectsPreviewElements.forEach((previewElement) => {
    previewElement.style.backgroundImage = `url(${uploadingImagePath})`;
  });
  editWindow.classList.remove('hidden');
  document.body.classList.add('modal-open');

  scaleUpgradeButton.disabled = true;
  effectLevelContainer.classList.add('hidden');
  noUiSlider.create(effectSliderContainer, {
    range: {
      min: 0,
      max: 0
    },
    step: 0,
    start: 0
  });

  document.addEventListener('keydown', onDocumentKeydown);
};

const onUploadInputChange = () => {
  showEditWindow();
};

const disableSubmitButton = () => {
  uploadFormSubmitButton.disabled = true;
  uploadFormSubmitButton.innerText = 'Отправляется...';
};

const enableSubmitButton = () => {
  uploadFormSubmitButton.disabled = false;
  uploadFormSubmitButton.innerText = 'Опубликовать';
};

function onDocumentKeydown(evt) {
  if (isEscape(evt)) {
    const successMessage = document.querySelector('.success');
    const errorMessage = document.querySelector('.error');
    evt.preventDefault();
    if (errorMessage) {
      closeErrorMessage();
      return;
    }
    if (!editWindow.classList.contains('hidden')) {
      hideEditWindow();
    }
    if (successMessage) {
      closeSuccessMessage();
    }
  }
}

function onCrossButtonClick() {
  hideEditWindow();
}

const changeImageScale = (scalePercentage) => {
  const cssScalePropertyValue = scalePercentage / 100;
  scaleInput.setAttribute('value', `${scalePercentage}%`);
  previewImage.style.transform = `scale(${cssScalePropertyValue})`;
};

function onScaleControllersClick(evt) {
  const currentInputValue = parseInt(scaleInput.value, 10);
  let newImagePercentage = currentInputValue;

  if (evt.target.matches('.scale__control--smaller')) {
    if (currentInputValue > MIN_SCALE_VALUE) {
      scaleUpgradeButton.disabled = false;
      newImagePercentage = currentInputValue - SCALE_CHANGING_STEP;
      changeImageScale(newImagePercentage);

      if (newImagePercentage <= MIN_SCALE_VALUE) {
        scaleDowngradeButton.disabled = true;
      }
    }
    return;
  }

  if (currentInputValue < MAX_SCALE_VALUE) {
    scaleDowngradeButton.disabled = false;
    newImagePercentage = currentInputValue + SCALE_CHANGING_STEP;
    changeImageScale(newImagePercentage);

    if (newImagePercentage === MAX_SCALE_VALUE) {
      scaleUpgradeButton.disabled = true;
    }
  }
}

function onEffectChange(evt) {

  if (evt.target.matches('.effects__radio')) {
    const choosenEffectValue = evt.target.value;
    if (choosenEffectValue === 'none') {
      previewImage.style.filter = '';
      effectLevelContainer.classList.add('hidden');
      effectsLevelInput.setAttribute('value', '');
      return;
    }

    applyFilter(FILTERS_DICTIONARY[choosenEffectValue]);
  }
}

function onFormSubmit(evt) {
  evt.preventDefault();
  const isFormValid = pristine.validate();
  const uploadingData = new FormData(evt.target);

  if (isFormValid) {
    uploadPhoto(UPLOAD_PHOTO_ROUTE, onFormSubmitSuccess, onFormSubmitError, uploadingData, disableSubmitButton, enableSubmitButton);
  }
}

function onEditFieldsKeydown(evt) {
  if (isEscape(evt)) {
    evt.stopPropagation();
  }
}

function onCommentTextareaFocus() {
  commentTextarea.addEventListener('keydown', onEditFieldsKeydown);
}

function onHashtagsInputFocus() {
  hashtagsInput.addEventListener('keydown', onEditFieldsKeydown);
}

const openSuccessMessage = () => {
  const submitSuccessMessageTemplate = document.querySelector('#success').content.cloneNode(true);
  document.body.append(submitSuccessMessageTemplate);
};

function closeSuccessMessage() {
  const submitSuccesMessageElement = document.querySelector('.success');
  submitSuccesMessageElement.remove();

  document.removeEventListener('keydown', onDocumentKeydown);
}

function onSuccessButtonClick() {
  closeSuccessMessage();
}

function onSuccessMessageOverlayClick(evt) {
  if (evt.target.matches('.success')) {
    closeSuccessMessage();
  }
}

function closeErrorMessage() {
  const errorMessage = document.querySelector('.error');
  errorMessage.remove();
}

const openErrorMessage = () => {
  const errorMessageTemplateClone = document.querySelector('#error').content.cloneNode(true);
  document.body.append(errorMessageTemplateClone);
};

function onErrorButtonClick() {
  closeErrorMessage();
}

function onErrorOverlayClick(evt) {
  if (evt.target.matches('.error')) {
    closeErrorMessage();
  }
}

function onFormSubmitError() {
  openErrorMessage();
  const errorButton = document.querySelector('.error__button');
  const errorMessageOverlay = document.querySelector('.error');

  errorButton.addEventListener('click', onErrorButtonClick);
  errorMessageOverlay.addEventListener('click', onErrorOverlayClick);
  document.addEventListener('keydown', onDocumentKeydown);
}

function onFormSubmitSuccess() {
  hideEditWindow();
  openSuccessMessage();
  const successButton = document.querySelector('.success__button');
  const successMessageOverlay = document.querySelector('.success');

  successMessageOverlay.addEventListener('click', onSuccessMessageOverlayClick);
  document.addEventListener('keydown', onDocumentKeydown);
  successButton.addEventListener('click', onSuccessButtonClick);
}

editWindowCloseButton.addEventListener('click', onCrossButtonClick);
scaleDowngradeButton.addEventListener('click', onScaleControllersClick);
scaleUpgradeButton.addEventListener('click', onScaleControllersClick);
effectsContainer.addEventListener('change', onEffectChange);
uploadForm.addEventListener('submit', onFormSubmit);
commentTextarea.addEventListener('focus', onCommentTextareaFocus);
hashtagsInput.addEventListener('focus', onHashtagsInputFocus);

export { uploadInputElement, onUploadInputChange };
