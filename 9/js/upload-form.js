const MIN_SCALE_VALUE = 25;
const MAX_SCALE_VALUE = 100;
const SCALE_CHANGING_STEP = 25;
const COMMENT_MAX_LENGTH = 140;
const HASHTAG_PATTERN = /^#[a-zа-яё0-9]{1,19}$/i;
const MAX_HASHTAGS_AMOUNT = 5;


const uploadInputElement = document.querySelector('.img-upload__input');
const editWindow = document.querySelector('.img-upload__overlay');
const uploadForm = document.querySelector('.img-upload__form');
const editWindowCloseButton = editWindow.querySelector('.img-upload__cancel');
const previewImage = document.querySelector('.img-upload__preview img');
// const effectsPreviewElements = document.querySelectorAll('.effects__preview');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');
const effectsLevelInput = document.querySelector('.effect-level__value');
const effectSliderContainer = document.querySelector('.effect-level__slider');
const effectsContainer = document.querySelector('.effects');
const scaleDowngradeButton = document.querySelector('.scale__control--smaller');
const scaleUpgradeButton = document.querySelector('.scale__control--bigger');
const scaleInput = document.querySelector('.scale__control--value');
const hashtagsInput = uploadForm.querySelector('.text__hashtags');
const commentTextarea = uploadForm.querySelector('.text__description');


const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
  errorTextParent: 'img-upload__field-wrapper'
});

const validateHashtagsFormat = () => {
  const hashtagValue = hashtagsInput.value;
  if (hashtagValue === '') {
    return true;
  }
  const hashtagsArray = hashtagValue.split(' ');
  return hashtagsArray.every((hashtag) => HASHTAG_PATTERN.test(hashtag));
};

const validateHashtagsUniqueness = () => {
  let isValid = true;
  const hashtagsArray = hashtagsInput.value.split(' ').map((hashtag) => hashtag.toLowerCase());
  const usedHashtags = [];
  hashtagsArray.forEach((hashtag) => {
    if (usedHashtags.includes(hashtag)) {
      isValid = false;
    }
    usedHashtags.push(hashtag);
  });
  return isValid;
};

const validateHashtagsAmount = () => {
  const hashtagsArray = hashtagsInput.value.split(' ');
  return hashtagsArray.length <= MAX_HASHTAGS_AMOUNT;
};

const validateCommentLength = () => commentTextarea.value.length <= COMMENT_MAX_LENGTH;

pristine.addValidator(hashtagsInput, validateHashtagsFormat, 'Неверный формат хэштега', 1, true);
pristine.addValidator(hashtagsInput, validateHashtagsUniqueness, 'Хэштеги должны быть уникальными', 2, true);
pristine.addValidator(hashtagsInput, validateHashtagsAmount, 'Должно быть не больше 5 хэштегов', 3, true);
pristine.addValidator(commentTextarea, validateCommentLength, 'Максимальная длина комментария 140 символов');


const useFilter = (minValue, maxValue, step, filterName, units) => {

  effectLevelContainer.classList.remove('hidden');

  effectSliderContainer.noUiSlider.on('update', () => {
    const sliderValue = parseFloat(effectSliderContainer.noUiSlider.get(), 1);
    effectsLevelInput.setAttribute('value', sliderValue);
    previewImage.style.filter = `${filterName}(${sliderValue}${units})`;
  });

  effectSliderContainer.noUiSlider.updateOptions({
    range: {
      min: minValue,
      max: maxValue
    },
    step: step,
    start: maxValue
  });
};

const changeImageScale = (scalePercentage) => {
  const cssScalePropertyValue = scalePercentage / 100;
  scaleInput.setAttribute('value', `${scalePercentage}%`);
  previewImage.style.transform = `scale(${cssScalePropertyValue})`;
};

const hideEditWindow = () => {
  editWindow.classList.add('hidden');
  document.body.classList.remove('modal-open');
  uploadForm.reset();
  // previewImage.src = '';
  // effectsPreviewElements.forEach((previewElement) => {
  //   previewElement.style.backgroundImage = '';
  // });
  scaleInput.setAttribute('value', '100%');
  scaleDowngradeButton.disabled = false;
  scaleUpgradeButton.disabled = false;
  previewImage.removeAttribute('style');

  pristine.reset();
  effectSliderContainer.noUiSlider.destroy();

  editWindowCloseButton.removeEventListener('click', onCrossButtonClick);
  document.removeEventListener('keydown', onDocumentKeydown);
  scaleDowngradeButton.removeEventListener('click', onScaleControllersClick);
  scaleUpgradeButton.removeEventListener('click', onScaleControllersClick);
  effectsContainer.removeEventListener('change', onEffectChange);
  uploadForm.removeEventListener('submit', onFormSubmit);
  commentTextarea.removeEventListener('focus', onCommentTextareaFocus);
  commentTextarea.removeEventListener('keydown', onEditFieldsKeydown);
  hashtagsInput.addEventListener('focus', onHashtagsInputFocus);
  hashtagsInput.removeEventListener('keydown', onEditFieldsKeydown);
};

const showEditWindow = () => {
  // const uploadingImagePath = uploadInputElement.value;
  editWindow.classList.remove('hidden');
  document.body.classList.add('modal-open');
  // previewImage.src = uploadingImagePath;
  // effectsPreviewElements.forEach((previewElement) => {
  //   previewElement.style.backgroundImage = `url(${uploadingImagePath})`;
  // });

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

  editWindowCloseButton.addEventListener('click', onCrossButtonClick);
  document.addEventListener('keydown', onDocumentKeydown);
  scaleDowngradeButton.addEventListener('click', onScaleControllersClick);
  scaleUpgradeButton.addEventListener('click', onScaleControllersClick);
  effectsContainer.addEventListener('change', onEffectChange);
  uploadForm.addEventListener('submit', onFormSubmit);
  commentTextarea.addEventListener('focus', onCommentTextareaFocus);
  hashtagsInput.addEventListener('focus', onHashtagsInputFocus);
};

const onUploadInputChange = () => {
  showEditWindow();
};

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    if (!editWindow.classList.contains('hidden')) {
      hideEditWindow();
    }
  }
}

function onCrossButtonClick() {
  hideEditWindow();
}

function onScaleControllersClick(evt) {
  const currentInputValue = parseInt(scaleInput.value, 10);
  let newImagePercentage = currentInputValue;

  if (evt.target.matches('.scale__control--smaller')) {
    scaleUpgradeButton.disabled = false;
    newImagePercentage = currentInputValue - SCALE_CHANGING_STEP;
    changeImageScale(newImagePercentage);

    if (newImagePercentage === MIN_SCALE_VALUE) {
      scaleDowngradeButton.disabled = true;
    }
    return;
  }

  scaleDowngradeButton.disabled = false;
  newImagePercentage = currentInputValue + SCALE_CHANGING_STEP;
  changeImageScale(newImagePercentage);

  if (newImagePercentage === MAX_SCALE_VALUE) {
    scaleUpgradeButton.disabled = true;
  }
}

function onEffectChange(evt) {

  if (evt.target.matches('.effects__radio')) {
    switch (evt.target.value) {
      case 'none':
        previewImage.style.filter = '';
        effectLevelContainer.classList.add('hidden');
        break;

      case 'chrome':
        useFilter(0, 1, 0.1, 'grayscale', '');
        break;

      case 'sepia':
        useFilter(0, 1, 0.1, 'sepia', '');
        break;

      case 'marvin':
        useFilter(0, 100, 1, 'invert', '%');
        break;

      case 'phobos':
        useFilter(0, 3, 0.1, 'blur', 'px');
        break;

      case 'heat':
        useFilter(1, 3, 0.1, 'brightness', '');
        break;
    }
  }
}

function onFormSubmit(evt) {
  evt.preventDefault();
  pristine.validate();
}

function onEditFieldsKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
}

function onCommentTextareaFocus() {
  commentTextarea.addEventListener('keydown', onEditFieldsKeydown);
}

function onHashtagsInputFocus() {
  hashtagsInput.addEventListener('keydown', onEditFieldsKeydown);
}

uploadInputElement.addEventListener('change', onUploadInputChange);
