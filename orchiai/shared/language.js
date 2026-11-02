const normalize = (text) => String(text || '').normalize('NFKC').toLocaleLowerCase('und');
const languageNames = { en: 'English', hi: 'Hindi', mr: 'Marathi' };

const commandPatterns = [
  ['mr', /\b(?:can|could|do) you speak (?:in )?marathi\b|\b(?:speak|talk|reply|answer|continue|switch|chat)(?: to me)? (?:in )?marathi\b|\bmarathi (?:me|mein|madhe|madhye) (?:baat karo|bolo|bol|sanga|uttar dya)\b|मराठी(?:त|मध्ये)?\s*(?:बोला|बोल|बोलूया|बात करा|उत्तर द्या|सांगा)/u],
  ['hi', /\b(?:can|could|do) you speak (?:in )?hindi\b|\b(?:speak|talk|reply|answer|continue|switch|chat)(?: to me)? (?:in )?hindi\b|\bhindi (?:me|mein) (?:baat karo|bolo|bol|jawab do|baat kijiye)\b|हिंदी(?: में)?\s*(?:बोलो|बोलिए|बात करो|बात कीजिए|जवाब दो|बातचीत करो)/u],
  ['en', /\b(?:can|could|do) you speak (?:in )?english\b|\b(?:speak|talk|reply|answer|continue|switch|chat)(?: to me)? (?:in )?english\b|\benglish (?:me|mein) (?:bolo|bol|baat karo|jawab do)\b|अंग्रेज़ी(?: में)?\s*(?:बोलो|बोलिए|बात करो|जवाब दो)|अंग्रेजी(?: में)?\s*(?:बोलो|बोलिए|बात करो|जवाब दो)/u],
];

const marathiTerms = new Set('आहे आहेत कुठे कोठे इथे सर्व सांग शाखा कोणकोणते कोणकोणत्या काय कसा कशी कसे मला आम्हाला सांगा माहिती माझे माझी माझा आणि किती करू मिळेल महाविद्यालय आपण तुम्ही मध्ये मराठी बोला पाहिजे आहेस'.split(' '));
const hindiTerms = new Set('है हैं कहाँ कहां क्या कैसे कैसी मुझे हमें बताइए बताओ जानकारी मेरा मेरी मेरी और कितना कितनी चाहिए कृपया महाविद्यालय हिंदी नमस्ते बोलिए बताइये'.split(' '));
const romanMarathiTerms = new Set('aahe ahet aahes kuthe kothe ithe sarv sang shakha kay kaay kiti mala amhala sanga mahiti kasa kashi kase konte konta marathit marathi madhe madhye pahije milel'.split(' '));
const romanHindiTerms = new Set('kya hai hain kahan kaha kaise kaisi mujhe humein batao bataiye bataiye mera meri kitna kitni chahiye kripya hindi mein namaste boliye bolo sakte sakti'.split(' '));
const englishTerms = new Set('what where when why how who which is are am do does did can could would tell explain please give me college about available courses fees admission department facilities'.split(' '));

export function detectLanguageCommand(text) {
  const value = normalize(text);
  for (const [language, pattern] of commandPatterns) {
    if (pattern.test(value)) {
      const capability = /\b(?:can|could|do) you speak\b/u.test(value);
      return { language, kind: capability ? 'capability' : 'switch' };
    }
  }
  return null;
}

export function detectQuestionLanguage(text, fallback = 'en') {
  const value = normalize(text);
  const words = value.match(/[\p{L}\p{M}]+/gu) || [];
  const devanagari = /[\u0900-\u097f]/u.test(value);
  let mr = 0, hi = 0;
  for (const word of words) {
    if (marathiTerms.has(word)) mr += 1;
    if (hindiTerms.has(word)) hi += 1;
    if (!devanagari) {
      if (romanMarathiTerms.has(word)) mr += 1;
      if (romanHindiTerms.has(word)) hi += 1;
    }
  }
  if (mr !== hi && Math.max(mr, hi) > 0) return mr > hi ? 'mr' : 'hi';
  if (devanagari) return fallback === 'hi' || fallback === 'mr' ? fallback : 'hi';
  if (mr || hi) return fallback === 'hi' || fallback === 'mr' ? fallback : 'hi';
  const englishCount = words.reduce((count, word) => count + Number(englishTerms.has(word)), 0);
  if (englishCount >= 2 || (englishCount >= 1 && words.length <= 5)) return 'en';
  return ['en', 'hi', 'mr'].includes(fallback) ? fallback : 'en';
}

export function resolveReplyLanguage(text, selected = 'en', pinned = false) {
  const command = detectLanguageCommand(text);
  if (command) return command.language;
  if (pinned) return ['en', 'hi', 'mr'].includes(selected) ? selected : 'en';
  return detectQuestionLanguage(text, selected);
}

export function getLanguageControlResponse(text, language) {
  const command = detectLanguageCommand(text);
  if (!command) return null;
  if (command.kind === 'capability') {
    return {
      en: 'Yes, I can speak English. What would you like to know about NKOCET?',
      hi: 'हाँ, मैं हिंदी में बात कर सकता हूँ। आप NKOCET के बारे में क्या जानना चाहेंगे?',
      mr: 'हो, मी मराठीत बोलू शकतो. NKOCET बद्दल तुम्हाला काय जाणून घ्यायचे आहे?',
    }[language];
  }
  return {
    en: 'Sure, I’ll continue in English. What would you like to know about NKOCET?',
    hi: 'ज़रूर, अब मैं हिंदी में बात करूँगा। NKOCET के बारे में आप क्या जानना चाहेंगे?',
    mr: 'नक्की, आता मी मराठीत बोलेन. NKOCET बद्दल तुम्हाला काय जाणून घ्यायचे आहे?',
  }[language];
}
