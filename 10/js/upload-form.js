const MIN_SCALE_VALUE = 25;
const MAX_SCALE_VALUE = 100;
const SCALE_CHANGING_STEP = 25;
const COMMENT_MAX_LENGTH = 140;
const HASHTAG_PATTERN = /^#[a-zа-яё0-9]{1,19}$/i;
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

const validateHashtagsFormat = (inputValue) => {
  if (inputValue === '') {
    return true;
  }
  const hashtagsArray = inputValue.trim().split(' ');
  return hashtagsArray.every((hashtag) => HASHTAG_PATTERN.test(hashtag));
};

const validateHashtagsUniqueness = (inputValue) => {
  let isValid = true;
  const hashtagsArray = inputValue.trim().split(' ').map((hashtag) => hashtag.toLowerCase());
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
  const hashtagsArray = inputValue.trim().split(' ');
  return hashtagsArray.length <= MAX_HASHTAGS_AMOUNT;
};

const validateCommentLength = (textareaValue) => textareaValue.trim().length <= COMMENT_MAX_LENGTH;

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

const changeImageScale = (scalePercentage) => {
  const cssScalePropertyValue = scalePercentage / 100;
  scaleInput.setAttribute('value', `${scalePercentage}%`);
  previewImage.style.transform = `scale(${cssScalePropertyValue})`;
};

const resetEditWindow = () => {
  uploadForm.reset();
  // previewImage.src = '';
  // effectsPreviewElements.forEach((previewElement) => {
  //   previewElement.style.backgroundImage = '';
  // });
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

  document.addEventListener('keydown', onDocumentKeydown);
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

editWindowCloseButton.addEventListener('click', onCrossButtonClick);
scaleDowngradeButton.addEventListener('click', onScaleControllersClick);
scaleUpgradeButton.addEventListener('click', onScaleControllersClick);
effectsContainer.addEventListener('change', onEffectChange);
uploadForm.addEventListener('submit', onFormSubmit);
commentTextarea.addEventListener('focus', onCommentTextareaFocus);
hashtagsInput.addEventListener('focus', onHashtagsInputFocus);

uploadInputElement.addEventListener('change', onUploadInputChange);
