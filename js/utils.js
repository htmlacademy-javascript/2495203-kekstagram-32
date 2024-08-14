const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

const generateId = () => {
  let lastGeneratedId = 0;

  return () => {
    lastGeneratedId++;
    return lastGeneratedId;
  };
};

const isEscape = (evt) => evt.key === 'Escape';

function debounce (callback, timeoutDelay) {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
}

export { getRandomInteger, getRandomArrayElement, generateId, isEscape, debounce };
