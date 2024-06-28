const checkStringLength = (string, maxLength) => {
  if (string.length <= maxLength) {
    return true;
  }
  return false;
};
checkStringLength('проверяемая строка', 20);

const isPalindrome = (originString) => {
  const transformedOriginString = originString.replaceAll(' ', '').toLowerCase();
  const reversedString = transformedOriginString.split('').reverse().join('');
  return (transformedOriginString === reversedString);
};
isPalindrome('Лёша на полке клопа нашёл ');

const extractDigits = (testData) => {
  const testDataArray = String(testData).replaceAll(' ', '').split('');
  let resultString = '';
  for (const testDataItem of testDataArray) {
    const numberTestDataItem = Number(testDataItem);
    if (!Number.isNaN(numberTestDataItem)) {
      resultString += testDataItem;
    }
  }
  if (resultString) {
    return Number(resultString);
  }
  return NaN;
};
extractDigits('1 кефир, 0.5 батона');
extractDigits('а я томат');
