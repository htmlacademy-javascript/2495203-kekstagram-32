
const getPhotosData = (onSuccess, onError) => {
  fetch('https://32.javascript.htmlacademy.pro/kekstagram/data')
    .then((response) => response.json())
    .then((data) => {
      onSuccess(data);
    })
    .catch(() => onError());
};

const uploadPhoto = (onSuccess, onError, formData, lockSubmitButton, unlockSubmitButton) => {
  lockSubmitButton();

  fetch('https://32.javascript.htmlacademy.pro/kekstagram', {
    method: 'POST',
    body: formData
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      onSuccess();
    })
    .catch(() => {
      onError();
    })
    .finally(() => {
      unlockSubmitButton();
    });
};

export { getPhotosData, uploadPhoto };
