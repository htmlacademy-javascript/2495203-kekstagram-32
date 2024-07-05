const commentBricksString = `Всё отлично!
В целом всё неплохо. Но не всё.
Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.
Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.
Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.
Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`;
const commentBricksArray = commentBricksString.split('\n');

const commentatorNames = ['Петя', 'Вася', 'Молодец', 'Юзернейм', 'Инстаграмщик'];

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (arrayName) => {
  const randomIndex = getRandomInteger(0, arrayName.length - 1);
  return arrayName[randomIndex];
};

const generateId = () => {
  let lastGeneratedId = 0;

  return () => {
    lastGeneratedId++;
    return lastGeneratedId;
  };
};
const generatePhotoId = generateId();
const generateCommentId = generateId();

const createCommentMessage = () => {
  let resultCommentMessage = '';
  const sentencesAmount = getRandomInteger(1, 2);
  const usedSentencesIndexes = [];

  for (let i = 0; i < sentencesAmount; i++) {

    let currentSentence = getRandomArrayElement(commentBricksArray);
    let currentSentenceIndex = commentBricksArray.indexOf(currentSentence);

    while (usedSentencesIndexes.includes(currentSentenceIndex)) {

      currentSentence = getRandomArrayElement(commentBricksArray);
      currentSentenceIndex = commentBricksArray.indexOf(currentSentence);

    }

    resultCommentMessage += `${currentSentence} `;
    usedSentencesIndexes.push(currentSentenceIndex);

  }

  return resultCommentMessage.trim();
};

const createCommentObject = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${ getRandomInteger(1, 6) }.svg`,
  message: createCommentMessage(),
  name: getRandomArrayElement(commentatorNames)
});

const createCommentsArray = () => {
  const commentsAmount = getRandomInteger(0, 30);
  const commentsArray = Array.from({ length: commentsAmount }, createCommentObject);
  return commentsArray;
};

const createPhotoObject = () => {
  const currentPhotoId = generatePhotoId();

  return {
    id: currentPhotoId,
    url: `photos/${currentPhotoId}.jpg`,
    description: `Это оригинальная и суперуникальная фотка №${currentPhotoId}`,
    likes: getRandomInteger(15, 200),
    comments: createCommentsArray()
  };
};

const generatePhotosArray = () => Array.from({ length: 25 }, createPhotoObject);
generatePhotosArray();
