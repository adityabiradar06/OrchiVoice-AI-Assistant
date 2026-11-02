export const greetingByLanguage = {
  en: 'Hello! Welcome to OrchiVoice, your college assistant. How can I help you today? You can ask me anything about our college',
  hi: 'नमस्ते! OrchiVoice में आपका स्वागत है। मैं आपका कॉलेज सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ? आप हमारे कॉलेज के बारे में कुछ भी पूछ सकते हैं।',
  mr: 'नमस्कार! OrchiVoice मध्ये आपले स्वागत आहे. मी आपला महाविद्यालयीन सहाय्यक आहे. आज मी आपली कशी मदत करू शकतो? आपण आपल्या महाविद्यालयाबद्दल काहीही विचारू शकता.',
};

export function getPreferredLanguage(value) {
  return Object.hasOwn(greetingByLanguage, value) ? value : 'en';
}

export function getGreeting(language) {
  return greetingByLanguage[getPreferredLanguage(language)];
}
