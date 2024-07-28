const ERROR_MESSAGE_TIME = 5000;

const downloadData = (onSuccess, onError) => {
  fetch('https://32.javascript.htmlacademy.pro/kekstagram/data')
    .then((response) => response.json())
    .then((data) => {
      onSuccess(data);
    })
    .catch(() => onError());
};

const onDataDownloadingError = () => {
  const errorMessageTemplateClone = document.querySelector('#data-error').content.cloneNode(true);
  document.body.append(errorMessageTemplateClone);
  const errorMessageElement = document.querySelector('.data-error');

  setTimeout(() => {
    errorMessageElement.remove();
  }, ERROR_MESSAGE_TIME);
};

export { downloadData, onDataDownloadingError };
