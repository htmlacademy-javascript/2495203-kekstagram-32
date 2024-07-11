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

const checkMeetingBoundaries = (workDayStartTime, workDayEndTime, meetingStartTime, meetingDuration) => {
  const timePoints = [workDayStartTime, workDayEndTime, meetingStartTime].map((timeOClock) => {
    const [hoursOClock, minutesOClock] = timeOClock.split(':');
    return Number(hoursOClock) * 60 + Number(minutesOClock);
  });
  const [workDayLowerBoundary, workDayUpperBoundary, meetingLowerBoundary] = timePoints;
  const meetingUpperBoundary = meetingLowerBoundary + meetingDuration;
  return (workDayLowerBoundary <= meetingLowerBoundary && workDayUpperBoundary >= meetingUpperBoundary);
};
checkMeetingBoundaries('08:00', '17:30', '14:00', 90);
checkMeetingBoundaries('8:0', '10:0', '8:0', 120);
checkMeetingBoundaries('08:00', '14:30', '14:00', 90);
checkMeetingBoundaries('14:00', '17:30', '08:0', 90);
checkMeetingBoundaries('8:01', '17:30', '08:00', 90);
