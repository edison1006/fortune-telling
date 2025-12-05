import { ZODIAC_SIGNS, LIFE_PATH_MEANINGS } from './constants';

// 工具函数
export function getZodiacSign(month, day) {
  return ZODIAC_SIGNS.find((sign) => {
    const [sm, sd] = sign.start;
    const [em, ed] = sign.end;
    if (sm <= em) {
      return (
        (month === sm && day >= sd) ||
        (month === em && day <= ed) ||
        (month > sm && month < em)
      );
    }
    // Wraps year (Capricorn)
    return (
      (month === sm && day >= sd) ||
      (month === em && day <= ed) ||
      month > sm ||
      month < em
    );
  });
}

export function reduceToDigit(input) {
  let sum = input
    .split("")
    .map((d) => parseInt(d, 10))
    .filter((n) => !Number.isNaN(n))
    .reduce((acc, n) => acc + n, 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = String(sum)
      .split("")
      .map((d) => parseInt(d, 10))
      .reduce((acc, n) => acc + n, 0);
  }
  return sum;
}

export function getLifePathMeaning(num) {
  return LIFE_PATH_MEANINGS[num] || "A unique combination that needs a more detailed, personal interpretation.";
}

export function sample(list) {
  return list[Math.floor(Math.random() * list.length)];
}

