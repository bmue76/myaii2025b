// mobile/src/utils/greetings.ts
export const GREETINGS: string[] = [
  'you look great today',
  'today is your day',
  "you\'re doing better than you think",
  'one small step at a time',
  'you’ve got this',
  'thanks for showing up today',
];

export function getRandomGreeting(): string {
  if (GREETINGS.length === 0) {
    return '';
  }
  const index = Math.floor(Math.random() * GREETINGS.length);
  return GREETINGS[index];
}
