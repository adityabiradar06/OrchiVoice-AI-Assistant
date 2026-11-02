export const DEFAULT_SPEECH_RATE = 0.98;
export const GREETING_SPEECH_RATE = 1.3;

export function getSpeechRate(isGreeting = false) {
  return isGreeting ? GREETING_SPEECH_RATE : DEFAULT_SPEECH_RATE;
}
