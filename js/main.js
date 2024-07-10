const COMMENT_BRICKS_ARRAY = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.'];

const COMMENTATOR_NAMES = ['Петя', 'Вася', 'Молодец', 'Юзернейм', 'Инстаграмщик'];

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return [array[randomIndex], randomIndex];
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
  const resultCommentMessage = [];
  const sentencesAmount = getRandomInteger(1, 2);
  const usedSentencesIndexes = [];

  for (let i = 0; i < sentencesAmount; i++) {
    let [currentSentence, currentSentenceIndex] = getRandomArrayElement(COMMENT_BRICKS_ARRAY);

    while (usedSentencesIndexes.includes(currentSentenceIndex)) {
      [currentSentence, currentSentenceIndex] = getRandomArrayElement(COMMENT_BRICKS_ARRAY);
    }

    resultCommentMessage.push(currentSentence);
    usedSentencesIndexes.push(currentSentenceIndex);
  }

  return resultCommentMessage.join(' ');
};

const createCommentObject = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${ getRandomInteger(1, 6) }.svg`,
  message: createCommentMessage(),
  name: getRandomArrayElement(COMMENTATOR_NAMES)[0]
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
