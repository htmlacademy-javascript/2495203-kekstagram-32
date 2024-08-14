
const getPhotosData = (route, onSuccess, onError) => {
  fetch(route)
    .then((response) => response.json())
    .then((data) => {
      onSuccess(data);
    })
    .catch(() => onError());
};

const uploadPhoto = (route, onSuccess, onError, formData, lockSubmitButton, unlockSubmitButton) => {
  lockSubmitButton();

  fetch(route, {
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
