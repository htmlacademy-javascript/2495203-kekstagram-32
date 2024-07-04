const checkStringLength = (string, maxLength) => string.length <= maxLength;
checkStringLength('проверяемая строка', 20);

const isPalindrome = (originString) => {
  const mergedLowerCaseString = originString.replaceAll(' ', '').toLowerCase();
  const reversedString = mergedLowerCaseString.split('').reverse().join('');
  return (mergedLowerCaseString === reversedString);
};
isPalindrome('Лёша на полке клопа нашёл ');

const extractDigits = (testData) => {
  const testDataArray = String(testData).replaceAll(' ', '').split('');
  let resultString = '';

  for (const testDataItem of testDataArray) {
    const numberTestDataItem = Number(testDataItem);

    if (!Number.isNaN(numberTestDataItem)) {
      resultString += testDataItem.toString();
    }
  }

  if (resultString) {
    return Number(resultString);
  }

  return NaN;
};

extractDigits('1 кефир, 0.5 батона');
extractDigits('а я томат');
extractDigits('0.15  томат');
