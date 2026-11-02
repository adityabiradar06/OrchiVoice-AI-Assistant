import { useCallback, useEffect, useRef, useState } from 'react';
import { PredictiveArcCanvas } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';
import MorphOrb from './components/MorphOrb.tsx';
import { detectLanguageCommand, detectQuestionLanguage } from '../../shared/language.js';
import { getGreeting, getPreferredLanguage } from '../../shared/greetings.js';
import { getSpeechRate } from '../../shared/speech-settings.js';

const copyByLanguage = {
  en: {
    welcome: 'Hello! Welcome to OrchiVoice, your college assistant. How can I help you today? You can ask me anything about our college', assistantError: 'I could not get a response right now. Please try again.', speechError: 'The device could not speak this answer. It remains available as text.',
    prompt: 'Ask a question by voice or text to get started.', ready: 'Ready when you are', listening: "I'm listening…", processing: 'Thinking…', speaking: 'Speaking… stop to ask another question', error: 'Needs your attention',
    recognitionUnsupported: 'Speech recognition is not supported in this browser. You can still type your question below.', requestingMic: 'Requesting microphone access…', permission: 'Microphone access was blocked. Allow it for localhost in Chrome site settings, then try again.', serviceBlocked: 'Chrome blocked its speech recognition service. Check Chrome site settings, then try again or type your question.', speechNetworkError: 'Chrome could not reach its speech recognition service. Check that Chrome can access the service, then try again or type your question.', microphoneMissing: 'No microphone input device was found. Connect or enable a microphone, then try again.', microphoneBusy: 'Chrome could not access the microphone. Close other apps using it, check Windows microphone access, and try again.', insecureContext: 'Microphone access requires localhost or a secure HTTPS connection.', noSpeech: 'I did not hear anything. Tap the glass and try again.', recognitionError: 'Speech recognition stopped unexpectedly. You can type your question below and try the microphone again.', micError: 'Could not start the microphone. Please check browser permissions and try again.',
    speechServiceError: 'Online speech could not be generated. The answer remains available as text.',
    heroEyebrow: 'YOUR CAMPUS, IN CONVERSATION', heroTitle: 'Meet your', heroAccent: 'college,', heroEnd: 'reimagined.', heroText: 'Ask Orchid AI anything about NKOCET. Get clear answers grounded in official college information.', online: 'AI ASSISTANT ONLINE',
    glassTop: 'ORCHIVOICE', glassSub: 'GLASS INTERFACE', voiceTip: 'Tap the glass to speak', loadingGlass: 'Loading glass renderer', stop: 'Stop',
    conversation: 'YOUR CONVERSATION', chatTitle: 'How can I help?', clear: 'Clear', you: 'YOU', live: 'LIVE TRANSCRIPT', assistant: 'ORCHID AI', thinking: 'Finding verified information',
    askPlaceholder: 'Ask about admissions, courses, campus life…', typeQuestion: 'Type your question', send: 'Send question', enter: 'OR PRESS ENTER TO SEND', sources: 'ANSWERS LINK TO OFFICIAL SOURCES', officialSources: 'OFFICIAL SOURCES',
    begin: 'A PLACE TO BEGIN', curious: 'Curious about', something: 'something?', choose: 'Choose a question and start a conversation.', based: 'Answers are based on information published by NKOCET. Always verify time-sensitive details with the college.',
    footerTitle: 'YOUR COLLEGE, MADE CLEAR.', footerText: 'Ask about admissions, courses, fees, placements and campus life—answers link to official NKOCET information.', chat: 'Chat', language: 'Language',
    suggestions: ['What courses are available?', 'How can I get admission?', 'What scholarships are available?', 'Tell me about placements', 'What are the hostel facilities?', 'Where is the college located?'],
  },
  mr: {
    welcome: 'नमस्कार! N. K. Orchid College of Engineering & Technology मध्ये आपले स्वागत आहे. मी Orchid AI, आपली आभासी महाविद्यालय सहाय्यक आहे. प्रवेश, अभ्यासक्रम, विभाग, प्लेसमेंट आणि महाविद्यालयातील सुविधांबद्दल विचारा. मी आपली कशी मदत करू?', assistantError: 'आत्ता उत्तर मिळू शकले नाही. कृपया पुन्हा प्रयत्न करा.', speechError: 'या उपकरणावर उत्तर बोलता आले नाही. उत्तर मजकूर स्वरूपात उपलब्ध आहे.',
    prompt: 'सुरू करण्यासाठी आवाजाने किंवा मजकूर लिहून प्रश्न विचारा.', ready: 'आपल्या प्रश्नासाठी तयार', listening: 'मी ऐकत आहे…', processing: 'विचार करत आहे…', speaking: 'बोलत आहे… पुढचा प्रश्न विचारण्यासाठी टॅप करा', error: 'आपल्या लक्षाची गरज आहे',
    recognitionUnsupported: 'या ब्राउझरमध्ये आवाज ओळखण्याची सुविधा उपलब्ध नाही. आपण खाली प्रश्न टाइप करू शकता.', requestingMic: 'मायक्रोफोनची परवानगी मागत आहे…', permission: 'मायक्रोफोनची परवानगी नाकारली आहे. Chrome साइट सेटिंग्जमध्ये localhost साठी परवानगी देऊन पुन्हा प्रयत्न करा.', serviceBlocked: 'Chrome ने आवाज ओळख सेवा रोखली आहे. Chrome साइट सेटिंग्ज तपासा किंवा प्रश्न टाइप करा.', speechNetworkError: 'Chrome ची आवाज ओळख सेवा उपलब्ध होत नाही. Chrome ला ही सेवा वापरता येते का तपासा किंवा प्रश्न टाइप करा.', microphoneMissing: 'मायक्रोफोन आढळला नाही. मायक्रोफोन जोडून किंवा सुरू करून पुन्हा प्रयत्न करा.', microphoneBusy: 'Chrome ला मायक्रोफोन वापरता आला नाही. मायक्रोफोन वापरणारे इतर अॅप बंद करून पुन्हा प्रयत्न करा.', insecureContext: 'मायक्रोफोनसाठी localhost किंवा सुरक्षित HTTPS कनेक्शन आवश्यक आहे.', noSpeech: 'आवाज ऐकू आला नाही. काचेच्या बटणावर टॅप करून पुन्हा बोला.', recognitionError: 'आवाज ओळख अनपेक्षितपणे थांबली. प्रश्न टाइप करा किंवा मायक्रोफोन पुन्हा वापरून पहा.', micError: 'मायक्रोफोन सुरू झाला नाही. ब्राउझरची परवानगी तपासून पुन्हा प्रयत्न करा.',
    speechServiceError: 'ऑनलाइन आवाज तयार करता आला नाही. उत्तर मजकूर स्वरूपात उपलब्ध आहे.',
    heroEyebrow: 'आपले महाविद्यालय, संवादातून', heroTitle: 'आपले', heroAccent: 'महाविद्यालय,', heroEnd: 'नव्या रूपात.', heroText: 'Orchid AI ला NKOCET बद्दल विचारा. अधिकृत महाविद्यालयीन माहितीवर आधारित उत्तरे मिळवा.', online: 'AI सहाय्यक उपलब्ध',
    glassTop: 'ORCHIVOICE', glassSub: 'ग्लास इंटरफेस', voiceTip: 'बोलण्यासाठी काचेवर टॅप करा', loadingGlass: 'ग्लास बटण लोड होत आहे', stop: 'थांबवा',
    conversation: 'आपला संवाद', chatTitle: 'मी कशी मदत करू?', clear: 'संवाद पुसा', you: 'आपण', live: 'थेट मजकूर', assistant: 'ORCHID AI', thinking: 'पडताळलेली माहिती शोधत आहे',
    askPlaceholder: 'प्रवेश, अभ्यासक्रम, महाविद्यालयाबद्दल विचारा…', typeQuestion: 'आपला प्रश्न लिहा', send: 'प्रश्न पाठवा', enter: 'पाठवण्यासाठी ENTER दाबा', sources: 'उत्तरे अधिकृत स्रोतांशी जोडलेली आहेत', officialSources: 'अधिकृत स्रोत',
    begin: 'संवादाची सुरुवात', curious: 'कशाबद्दल', something: 'जाणून घ्यायचे?', choose: 'प्रश्न निवडा आणि संवाद सुरू करा.', based: 'उत्तरे NKOCET ने प्रकाशित केलेल्या माहितीवर आधारित आहेत. बदलणाऱ्या माहितीसाठी महाविद्यालयाकडे खात्री करा.',
    footerTitle: 'महाविद्यालयीन माहिती, सोप्या भाषेत.', footerText: 'प्रवेश, अभ्यासक्रम, शुल्क, प्लेसमेंट आणि सुविधांबद्दल विचारा—उत्तरे अधिकृत NKOCET माहितीस जोडलेली आहेत.', chat: 'संवाद', language: 'भाषा',
    suggestions: ['कोणते अभ्यासक्रम उपलब्ध आहेत?', 'प्रवेश कसा मिळवता येईल?', 'कोणत्या शिष्यवृत्ती उपलब्ध आहेत?', 'प्लेसमेंटबद्दल सांगा', 'वसतिगृहात कोणत्या सुविधा आहेत?', 'महाविद्यालय कुठे आहे?'],
  },
  hi: {
    welcome: 'नमस्ते! N. K. Orchid College of Engineering & Technology में आपका स्वागत है। मैं Orchid AI, आपकी वर्चुअल कॉलेज सहायक हूँ। प्रवेश, पढ़ाई, विभागों, प्लेसमेंट और परिसर की सुविधाओं के बारे में पूछें। मैं आपकी कैसे सहायता करूँ?', assistantError: 'अभी जवाब नहीं मिल सका। कृपया फिर से कोशिश करें।', speechError: 'यह डिवाइस जवाब बोल नहीं सका। जवाब टेक्स्ट में उपलब्ध है।',
    prompt: 'शुरू करने के लिए बोलकर या लिखकर सवाल पूछें।', ready: 'आपके सवाल के लिए तैयार', listening: 'मैं सुन रहा हूँ…', processing: 'सोच रहा हूँ…', speaking: 'बोल रहा हूँ… अगला सवाल पूछने के लिए टैप करें', error: 'ध्यान देने की आवश्यकता है',
    recognitionUnsupported: 'इस ब्राउज़र में आवाज़ पहचानने की सुविधा उपलब्ध नहीं है। आप नीचे अपना सवाल टाइप कर सकते हैं।', requestingMic: 'माइक्रोफ़ोन की अनुमति माँगी जा रही है…', permission: 'माइक्रोफ़ोन की अनुमति नहीं मिली। Chrome साइट सेटिंग में localhost को अनुमति देकर फिर कोशिश करें।', serviceBlocked: 'Chrome ने अपनी आवाज़ पहचान सेवा को रोक दिया है। Chrome साइट सेटिंग जाँचें या सवाल टाइप करें।', speechNetworkError: 'Chrome अपनी आवाज़ पहचान सेवा तक नहीं पहुँच सका। Chrome में सेवा उपलब्ध है या नहीं जाँचें, या सवाल टाइप करें।', microphoneMissing: 'कोई माइक्रोफ़ोन नहीं मिला। माइक्रोफ़ोन जोड़ें या चालू करें और फिर कोशिश करें।', microphoneBusy: 'Chrome माइक्रोफ़ोन इस्तेमाल नहीं कर सका। माइक्रोफ़ोन इस्तेमाल करने वाले दूसरे ऐप बंद करके फिर कोशिश करें।', insecureContext: 'माइक्रोफ़ोन के लिए localhost या सुरक्षित HTTPS कनेक्शन ज़रूरी है।', noSpeech: 'आवाज़ सुनाई नहीं दी। ग्लास बटन दबाकर फिर बोलें।', recognitionError: 'आवाज़ पहचान अचानक रुक गई। सवाल टाइप करें या माइक्रोफ़ोन फिर से आज़माएँ।', micError: 'माइक्रोफ़ोन शुरू नहीं हुआ। ब्राउज़र की अनुमति जाँचकर फिर कोशिश करें।',
    speechServiceError: 'ऑनलाइन आवाज़ नहीं बन सकी। जवाब टेक्स्ट में उपलब्ध है।',
    heroEyebrow: 'आपका कैंपस, बातचीत के साथ', heroTitle: 'अपने', heroAccent: 'कॉलेज को', heroEnd: 'नए रूप में जानें।', heroText: 'Orchid AI से NKOCET के बारे में पूछें। कॉलेज की आधिकारिक जानकारी पर आधारित स्पष्ट जवाब पाएँ।', online: 'AI सहायक उपलब्ध',
    glassTop: 'ORCHIVOICE', glassSub: 'ग्लास इंटरफ़ेस', voiceTip: 'बोलने के लिए ग्लास पर टैप करें', loadingGlass: 'ग्लास बटन लोड हो रहा है', stop: 'रोकें',
    conversation: 'आपकी बातचीत', chatTitle: 'मैं कैसे मदद करूँ?', clear: 'बातचीत साफ़ करें', you: 'आप', live: 'लाइव ट्रांसक्रिप्ट', assistant: 'ORCHID AI', thinking: 'सत्यापित जानकारी खोज रहा हूँ',
    askPlaceholder: 'प्रवेश, पाठ्यक्रम, कैंपस के बारे में पूछें…', typeQuestion: 'अपना सवाल लिखें', send: 'सवाल भेजें', enter: 'भेजने के लिए ENTER दबाएँ', sources: 'जवाब आधिकारिक स्रोतों से जुड़े हैं', officialSources: 'आधिकारिक स्रोत',
    begin: 'बातचीत शुरू करें', curious: 'किसी बात के', something: 'बारे में जानना है?', choose: 'सवाल चुनें और बातचीत शुरू करें।', based: 'जवाब NKOCET द्वारा प्रकाशित जानकारी पर आधारित हैं। बदलने वाली जानकारी कॉलेज से सत्यापित करें।',
    footerTitle: 'कॉलेज की जानकारी, आसान भाषा में।', footerText: 'प्रवेश, पाठ्यक्रम, शुल्क, प्लेसमेंट और सुविधाओं के बारे में पूछें—जवाब आधिकारिक NKOCET जानकारी से जुड़े हैं।', chat: 'चैट', language: 'भाषा',
    suggestions: ['कौन से पाठ्यक्रम उपलब्ध हैं?', 'प्रवेश कैसे मिल सकता है?', 'कौन सी छात्रवृत्तियाँ उपलब्ध हैं?', 'प्लेसमेंट के बारे में बताएँ', 'हॉस्टल में क्या सुविधाएँ हैं?', 'कॉलेज कहाँ स्थित है?'],
  },
};
const welcomeFor = (language) => ({ role: 'assistant', content: copyByLanguage[language].welcome });
copyByLanguage.en.voiceBlocked = 'Your browser blocked automatic voice playback.';
copyByLanguage.en.enableVoice = 'Tap to start voice';
copyByLanguage.hi.voiceBlocked = 'आपके ब्राउज़र ने अपने आप आवाज़ चलाने से रोक दिया।';
copyByLanguage.hi.enableVoice = 'आवाज़ शुरू करने के लिए टैप करें';
copyByLanguage.mr.voiceBlocked = 'आपल्या ब्राउझरने आपोआप आवाज सुरू करण्यास प्रतिबंध केला.';
copyByLanguage.mr.enableVoice = 'आवाज सुरू करण्यासाठी टॅप करा';
const getStoredLanguage = () => getPreferredLanguage();
const locales = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };
const sectionLabels = {
  en: { communication: 'Voice', chat: 'Chat', chatTitle: 'Ask Orchid AI', chatIntro: 'Type a question about NKOCET. Answers are grounded in the college knowledge base and include official source links.', history: 'CHAT HISTORY', clear: 'Clear chat', noHistory: 'Your text conversation will appear here. Ask about admissions, academics, placements, facilities, or college services.', chatError: 'I could not get an answer right now. Please try again.' },
  mr: { communication: 'आवाज', chat: 'चॅट', chatTitle: 'Orchid AI ला विचारा', chatIntro: 'NKOCET बद्दल प्रश्न टाइप करा. उत्तरे महाविद्यालयाच्या माहितीवर आधारित असतात आणि अधिकृत स्रोत जोडतात.', history: 'चॅट इतिहास', clear: 'चॅट पुसा', noHistory: 'आपला मजकूर संवाद येथे दिसेल. प्रवेश, अभ्यासक्रम, प्लेसमेंट, सुविधा किंवा सेवांबद्दल विचारा.', chatError: 'आत्ता उत्तर मिळाले नाही. कृपया पुन्हा प्रयत्न करा.' },
  hi: { communication: 'वॉइस', chat: 'चैट', chatTitle: 'Orchid AI से पूछें', chatIntro: 'NKOCET के बारे में सवाल लिखें। जवाब कॉलेज की जानकारी पर आधारित होंगे और आधिकारिक स्रोतों के लिंक देंगे।', history: 'चैट इतिहास', clear: 'चैट साफ़ करें', noHistory: 'आपकी लिखित बातचीत यहाँ दिखाई देगी। प्रवेश, पढ़ाई, प्लेसमेंट, सुविधाओं या सेवाओं के बारे में पूछें।', chatError: 'अभी जवाब नहीं मिल सका। कृपया फिर कोशिश करें।' },
};
const morphCopyByLanguage = {
  en: { placeholder: 'Ask about NKOCET…', labels: ['Thinking', 'Searching', 'Checking sources', 'Composing'], done: 'Done', answerTitle: 'Answer', answerBody: 'I could not find a verified answer. Please try another college question.', reset: 'New question', send: 'Ask Orchid AI' },
  mr: { placeholder: 'NKOCET बद्दल विचारा…', labels: ['विचार करत आहे', 'शोधत आहे', 'स्रोत तपासत आहे', 'उत्तर तयार करत आहे'], done: 'पूर्ण', answerTitle: 'उत्तर', answerBody: 'पडताळलेले उत्तर मिळाले नाही. कृपया महाविद्यालयाबद्दल दुसरा प्रश्न विचारा.', reset: 'नवा प्रश्न', send: 'Orchid AI ला विचारा' },
  hi: { placeholder: 'NKOCET के बारे में पूछें…', labels: ['सोच रहा हूँ', 'खोज रहा हूँ', 'स्रोत जाँच रहा हूँ', 'जवाब तैयार कर रहा हूँ'], done: 'हो गया', answerTitle: 'जवाब', answerBody: 'सत्यापित जवाब नहीं मिला। कृपया कॉलेज से जुड़ा कोई और सवाल पूछें।', reset: 'नया सवाल', send: 'Orchid AI से पूछें' },
};
const logMic = (event, details = {}) => console.info(`[Orchid mic ${new Date().toISOString()}] ${event}`, details);
const abortRecognition = (recognitionRef) => {
  const engine = recognitionRef.current;
  if (!engine) return;
  engine._orchidCanceled = true;
  logMic('Recognition stopped', { reason: 'cancelled by Orchid AI' });
  recognitionRef.current = null;
  try { engine.abort(); } catch {}
};
function stopGeneratedAudio(queue) {
  queue?.ttsController?.abort();
  if (queue?.audio) {
    queue.audio.onended = null;
    queue.audio.onerror = null;
    queue.audio.pause();
    queue.audio.src = '';
    queue.audio = null;
  }
  if (queue?.audioUrl) {
    URL.revokeObjectURL(queue.audioUrl);
    queue.audioUrl = null;
  }
}

function GlassButton({ onActivate, onPulse, state, activity, label }) {
  const frame = useRef(null);
  const onActivateRef = useRef(onActivate);
  const onPulseRef = useRef(onPulse);
  const previousState = useRef('idle');
  const previousActivity = useRef(activity);
  onActivateRef.current = onActivate;
  onPulseRef.current = onPulse;
  useEffect(() => {
    if ((state !== previousState.current && state !== 'idle') || (state === 'listening' && activity !== previousActivity.current)) {
      frame.current?.contentDocument?.querySelector('#replay')?.click();
    }
    previousState.current = state;
    previousActivity.current = activity;
  }, [state, activity]);
  const activate = useCallback(() => {
    const doc = frame.current?.contentDocument;
    const button = doc?.querySelector('#activate');
    if (!button) { logMic('Glass activation button not found in iframe'); return; }
    frame.current?._orchidCleanup?.();
    const handleClick = () => { logMic('Glass button clicked', { iframeReady: true }); onActivateRef.current(); };
    button.addEventListener('click', handleClick);
    frame.current.dataset.ready = 'true';
    frame.current._orchidCleanup = () => button.removeEventListener('click', handleClick);
    onPulseRef.current?.();
  }, []);
  useEffect(() => () => frame.current?._orchidCleanup?.(), []);
  return <div className="glass-shell" aria-label={label}>
    <iframe ref={frame} title="Orchivoice animated glass button — click to ask Orchid AI" src="/glass-button.html" onLoad={activate} />
    <div className="glass-caption"><span className="live-dot" />{label}</div>
  </div>;
}

function Icon({ name }) {
  const paths = {
    send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
    mic: <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/></>,
    stop: <><rect x="6" y="6" width="12" height="12" rx="2"/></>,
    trash: <><path d="M3 6h18m-2 0-1 14H6L5 6m3 0V4h8v2m-7 4v6m4-6v6"/></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z"/><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default function App() {
  const initialLanguage = getStoredLanguage();
  const [messages, setMessages] = useState([welcomeFor(initialLanguage)]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatResetKey, setChatResetKey] = useState(0);
  const [language, setLanguage] = useState(initialLanguage);
  const [voicePromptRequired, setVoicePromptRequired] = useState(false);
  const greetingStarted = useRef(false);
  const greetingPending = useRef(false);
  const greetingText = useRef('');
  const languagePinned = useRef(null);
  const [activeSection, setActiveSection] = useState('communication');
  const [state, setState] = useState('idle');
  const [notice, setNotice] = useState('');
  const [partial, setPartial] = useState('');
  const [activity, setActivity] = useState(0);
  const recognition = useRef(null);
  const recognitionStarting = useRef(false);
  const transcriptRef = useRef(null);
  const communicationRef = useRef(null);
  const chatSectionRef = useRef(null);
  const chatMessagesRef = useRef([]);
  const chatRequestId = useRef(0);
  const chatRequestController = useRef(null);
  const latestMessages = useRef(messages);
  const requestId = useRef(0);
  const speechId = useRef(0);
  const silenceTimer = useRef(null);
  const recognitionStartedAt = useRef(0);
  const finalTranscript = useRef('');
  const interimTranscript = useRef('');
  const microphonePermissionGranted = useRef(false);
  const streamUiFrame = useRef(null);
  const activeRequest = useRef(null);
  const assistantStreamId = useRef(null);
  const responseStartedAt = useRef(0);
  const firstTokenAt = useRef(null);
  const ttsQueue = useRef({ queue: [], buffer: '', done: false, speaking: false, autoListen: false, waitingForVoices: false, voiceTimer: null });
  const voicesRef = useRef([]);
  const speakNextRef = useRef(null);
  const cloudSpeechRef = useRef(null);
  const startListeningRef = useRef(null);
  const askRef = useRef(null);
  const applyQuestionLanguage = (text) => {
    const command = detectLanguageCommand(text);
    if (command) languagePinned.current = command.language;
    const nextLanguage = command?.language || languagePinned.current || detectQuestionLanguage(text, languageRef.current);
    if (nextLanguage !== languageRef.current) {
      languageRef.current = nextLanguage;
      copyRef.current = copyByLanguage[nextLanguage];
      setLanguage(nextLanguage);
      if (latestMessages.current.length <= 1) {
        const nextWelcome = welcomeFor(nextLanguage);
        latestMessages.current = [nextWelcome];
        setMessages([nextWelcome]);
      }
    }
    return { language: nextLanguage, languagePinned: Boolean(languagePinned.current) };
  };
  const copy = copyByLanguage[language] || copyByLanguage.en;
  const languageRef = useRef(language);
  const copyRef = useRef(copy);
  languageRef.current = language;
  copyRef.current = copy;
  const messageHistory = messages.slice(1);

  useEffect(() => { latestMessages.current = messages; }, [messages]);
  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, partial, state]);
  useEffect(() => {
    if (!('speechSynthesis' in window)) return undefined;
    const updateVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
      if (voicesRef.current.length) speakNextRef.current?.();
    };
    updateVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', updateVoices);
    // Some Chromium builds dispatch voiceschanged only after an initial empty getVoices() result.
    let retries = 0;
    const retry = window.setInterval(() => {
      updateVoices();
      retries += 1;
      if (voicesRef.current.length || retries >= 20) window.clearInterval(retry);
    }, 500);
    return () => { window.clearInterval(retry); window.speechSynthesis.removeEventListener?.('voiceschanged', updateVoices); };
  }, []);
  useEffect(() => () => {
    window.clearTimeout(silenceTimer.current);
    window.clearTimeout(ttsQueue.current.voiceTimer);
    activeRequest.current?.abort();
    abortRecognition(recognition);
    if (streamUiFrame.current !== null) cancelAnimationFrame(streamUiFrame.current);
    stopGeneratedAudio(ttsQueue.current);
    window.speechSynthesis?.cancel();
  }, []);

  const speakWithBrowserVoice = useCallback((text, lang, queueState, voice) => {
    if (!voice || !('speechSynthesis' in window)) return false;
    const targetLocale = locales[lang] || locales.en;
    const utterance = new SpeechSynthesisUtterance(text.replace(/https?:\/\/\S+/g, ''));
    utterance.lang = targetLocale;
    utterance.voice = voice;
    utterance.rate = getSpeechRate(queueState.isGreeting);
    queueState.speaking = true;
    utterance.onstart = () => {
      if (queueState !== ttsQueue.current) return;
      setState('speaking');
      if (!queueState.ttsStarted) {
        queueState.ttsStarted = true;
        console.info('[Orchid AI performance]', JSON.stringify({
          metric: 'ttsStart', language: lang, provider: 'browser', voice: voice.name,
          recognitionMs: queueState.recognitionMs,
          firstTokenToTtsMs: firstTokenAt.current === null ? null : Math.round(performance.now() - firstTokenAt.current),
          requestToTtsMs: Math.round(performance.now() - responseStartedAt.current),
        }));
      }
    };
    utterance.onend = () => { if (queueState !== ttsQueue.current) return; queueState.speaking = false; speakNextRef.current?.(); };
    utterance.onerror = () => {
      if (queueState !== ttsQueue.current) return;
      queueState.speaking = false; queueState.queue = []; queueState.done = true; queueState.autoListen = false;
      setState('idle');
      if (queueState.isGreeting) { greetingPending.current = true; setVoicePromptRequired(true); }
      else setNotice(copyByLanguage[lang].speechError);
    };
    try {
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      queueState.speaking = false;
      if (queueState.isGreeting) {
        greetingPending.current = true;
        setState('idle'); setVoicePromptRequired(true);
      } else setNotice(copyByLanguage[lang].speechError);
      return false;
    }
  }, []);

  const speakWithGemini = useCallback(async (text, lang, queueState, browserFallback) => {
    const controller = new AbortController();
    queueState.ttsController = controller;
    try {
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'audio/wav' },
        body: JSON.stringify({ text, language: lang, speed: getSpeechRate(queueState.isGreeting) }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('speech-service');
      const audioBlob = await response.blob();
      if (queueState !== ttsQueue.current || controller.signal.aborted) return;
      queueState.audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(queueState.audioUrl);
      queueState.audio = audio;
      audio.onended = () => {
        if (queueState !== ttsQueue.current) return;
        stopGeneratedAudio(queueState);
        queueState.speaking = false;
        speakNextRef.current?.();
      };
      audio.onerror = () => {
        if (queueState !== ttsQueue.current) return;
        stopGeneratedAudio(queueState);
        queueState.speaking = false;
        if (browserFallback?.()) return;
        queueState.voiceUnavailable = true; queueState.queue = []; queueState.autoListen = false;
        setNotice(copyByLanguage[lang].speechServiceError);
        if (queueState.done) setState('idle');
      };
      audio.onplaying = () => {
        if (queueState === ttsQueue.current) setState('speaking');
      };
      await audio.play();
      if (queueState !== ttsQueue.current) return;
      if (!queueState.ttsStarted) {
        queueState.ttsStarted = true;
        console.info('[Orchid AI performance]', JSON.stringify({
          metric: 'ttsStart', language: lang, provider: 'gemini',
          recognitionMs: queueState.recognitionMs,
          firstTokenToTtsMs: firstTokenAt.current === null ? null : Math.round(performance.now() - firstTokenAt.current),
          requestToTtsMs: Math.round(performance.now() - responseStartedAt.current),
        }));
      }
    } catch (error) {
      if (queueState !== ttsQueue.current || error.name === 'AbortError') return;
      stopGeneratedAudio(queueState);
      queueState.speaking = false;
      if (queueState.isGreeting && (error.name === 'NotAllowedError' || error.name === 'AbortError')) {
        greetingPending.current = true; setState('idle'); setVoicePromptRequired(true); return;
      }
      if (browserFallback?.()) return;
      queueState.voiceUnavailable = true; queueState.queue = []; queueState.autoListen = false;
      setNotice(copyByLanguage[lang].speechServiceError);
      if (queueState.done) setState('idle');
    }
  }, []);
  cloudSpeechRef.current = speakWithGemini;

  const speakNext = useCallback(() => {
    const queueState = ttsQueue.current;
    if (queueState.speaking) return;
    if (!queueState.queue.length) {
      if (!queueState.done) return;
      const resumeListening = queueState.autoListen;
      queueState.autoListen = false;
      setState('idle');
      if (resumeListening) window.setTimeout(() => startListeningRef.current?.(), 180);
      return;
    }
    let voices = voicesRef.current.length ? voicesRef.current : window.speechSynthesis?.getVoices?.() || [];
    voicesRef.current = voices;
    if (queueState.voiceTimer) window.clearTimeout(queueState.voiceTimer);
    queueState.voiceTimer = null;
    queueState.waitingForVoices = false;
    const lang = queueState.lang || languageRef.current;
    const targetLocale = locales[lang] || locales.en;
    const baseLanguage = lang.toLowerCase();
    const localeVoice = voices.find((item) => item.lang.toLowerCase() === targetLocale.toLowerCase());
    const fallbackVoice = localeVoice || voices.find((item) => item.lang.toLowerCase() === baseLanguage || item.lang.toLowerCase().startsWith(`${baseLanguage}-`));
    const voice = lang === 'en' ? localeVoice : fallbackVoice;
    if (!voice) {
      const text = queueState.queue.shift();
      queueState.speaking = true;
      cloudSpeechRef.current?.(text, lang, queueState, () => speakWithBrowserVoice(text, lang, queueState, fallbackVoice));
      return;
    }
    const text = queueState.queue.shift();
    speakWithBrowserVoice(text, lang, queueState, voice);
  }, []);
  speakNextRef.current = speakNext;

  const queueSpeech = useCallback((text, final = false) => {
    const queueState = ttsQueue.current;
    if (queueState.voiceUnavailable) {
      if (final) { queueState.done = true; setState('idle'); }
      return;
    }
    const combined = `${queueState.buffer}${text}`;
    const parts = combined.split(/(?<=[.!?।॥])\s+/u);
    queueState.buffer = final ? '' : (parts.pop() || '');
    if (final && parts.length === 0 && combined.trim()) parts.push(combined.trim());
    queueState.queue.push(...parts.map((part) => part.trim()).filter(Boolean));
    if (final) queueState.done = true;
    speakNext();
  }, [speakNext]);

  useEffect(() => {
    let timer;
    let attempts = 0;
    const startGreeting = () => {
      if (greetingStarted.current) return;
      if (activeRequest.current || recognition.current || messages.length > 1) return;
      const availableVoices = window.speechSynthesis?.getVoices?.() || [];
      if (availableVoices.length) voicesRef.current = availableVoices;
      if (!availableVoices.length && attempts < 12 && 'speechSynthesis' in window) {
        attempts += 1;
        timer = window.setTimeout(startGreeting, 250);
        return;
      }
      greetingStarted.current = true;
      const selectedLanguage = languageRef.current;
      const greeting = getGreeting(selectedLanguage);
      greetingText.current = greeting;
      greetingPending.current = true;
      const nextMessages = [...latestMessages.current, { id: 'orchivoice-opening-greeting', role: 'assistant', content: greeting }];
      latestMessages.current = nextMessages;
      setMessages(nextMessages);
      setVoicePromptRequired(false);
      ttsQueue.current = { queue: [], buffer: '', done: false, speaking: false, autoListen: false, lang: selectedLanguage, waitingForVoices: false, voiceTimer: null, ttsStarted: false, isGreeting: true };
      responseStartedAt.current = performance.now();
      firstTokenAt.current = responseStartedAt.current;
      queueSpeech(greeting, true);
    };
    timer = window.setTimeout(startGreeting, 350);
    return () => window.clearTimeout(timer);
  }, [messages.length, queueSpeech]);

  const retryGreetingVoice = () => {
    if (!greetingPending.current || !greetingText.current) return;
    window.speechSynthesis?.cancel();
    setVoicePromptRequired(false);
    setNotice('');
    ttsQueue.current = { queue: [], buffer: '', done: false, speaking: false, autoListen: false, lang: languageRef.current, waitingForVoices: false, voiceTimer: null, ttsStarted: false, isGreeting: true };
    responseStartedAt.current = performance.now();
    firstTokenAt.current = responseStartedAt.current;
    queueSpeech(greetingText.current, true);
  };

  const ask = useCallback(async (rawQuestion, { fromVoice = false, recognitionMs = null } = {}) => {
    const question = rawQuestion.trim();
    if (!question) return;
    greetingStarted.current = true;
    greetingPending.current = false;
    setVoicePromptRequired(false);
    const { language: responseLanguage, languagePinned: isLanguagePinned } = applyQuestionLanguage(question);
    window.clearTimeout(silenceTimer.current);
    window.clearTimeout(ttsQueue.current.voiceTimer);
    abortRecognition(recognition);
    activeRequest.current?.abort();
    speechId.current++;
    if (streamUiFrame.current !== null) cancelAnimationFrame(streamUiFrame.current);
    streamUiFrame.current = null;
    stopGeneratedAudio(ttsQueue.current);
    window.speechSynthesis?.cancel();
    ttsQueue.current = { queue: [], buffer: '', done: false, speaking: false, autoListen: fromVoice, lang: responseLanguage, recognitionMs, waitingForVoices: false, voiceTimer: null, ttsStarted: false };
    const request = ++requestId.current;
    const controller = new AbortController(); activeRequest.current = controller;
    const userMessage = { role: 'user', content: question };
    const conversation = [...latestMessages.current, userMessage];
    setMessages(conversation); latestMessages.current = conversation;
    setPartial(''); setNotice(''); setState('processing');
    responseStartedAt.current = performance.now(); firstTokenAt.current = null; assistantStreamId.current = `orchid-${request}`;
    let streamedText = '';
    let assistantCreated = false;
    let timings = {};
    let firstTextDisplayedAt = null;
    const appendAnswer = (chunk) => {
      if (request !== requestId.current || !chunk) return;
      if (firstTokenAt.current === null) firstTokenAt.current = performance.now();
      streamedText += chunk;
      if (!assistantCreated) {
        assistantCreated = true;
        const next = [...latestMessages.current, { id: assistantStreamId.current, role: 'assistant', content: streamedText, sources: [] }];
        latestMessages.current = next; setMessages(next);
        firstTextDisplayedAt = performance.now();
        console.info('[Orchid AI performance]', JSON.stringify({ metric: 'firstTextDisplayed', language: responseLanguage, ms: Math.round(firstTextDisplayedAt - responseStartedAt.current) }));
      } else {
        if (streamUiFrame.current === null) {
          streamUiFrame.current = requestAnimationFrame(() => {
            streamUiFrame.current = null;
            if (request !== requestId.current) return;
            const next = latestMessages.current.map((message) => message.id === assistantStreamId.current ? { ...message, content: streamedText } : message);
            latestMessages.current = next; setMessages(next);
          });
        }
      }
      queueSpeech(chunk);
    };
    try {
      const requestBody = JSON.stringify({ question, history: conversation.slice(-7, -1).map(({ role, content }) => ({ role, content })), language: responseLanguage, languagePinned: isLanguagePinned });
      console.info('[Orchid AI performance]', JSON.stringify({ metric: 'requestSubmission', language: responseLanguage, ms: Math.round(performance.now() - responseStartedAt.current) }));
      const response = await fetch('/api/chat/stream', {
        method: 'POST', headers: { 'content-type': 'application/json', accept: 'text/event-stream' },
        body: requestBody,
        signal: controller.signal,
      });
      console.info('[Orchid AI performance]', JSON.stringify({ metric: 'responseHeadersReceived', language: responseLanguage, ms: Math.round(performance.now() - responseStartedAt.current) }));
      if (!response.ok || !response.body) {
        let detail = {};
        try { detail = await response.json(); } catch {}
        throw new Error(detail.error || 'The assistant is unavailable right now.');
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      const handleFrame = (frame) => {
        const lines = frame.split(/\r?\n/);
        const type = lines.find((line) => line.startsWith('event:'))?.slice(6).trim();
        const payloadLine = lines.find((line) => line.startsWith('data:'))?.slice(5).trim();
        if (!payloadLine) return;
        const payload = JSON.parse(payloadLine);
        if (type === 'delta') appendAnswer(payload.text);
        if (type === 'done') {
          timings = payload.timings || {};
          if (streamUiFrame.current !== null) cancelAnimationFrame(streamUiFrame.current);
          streamUiFrame.current = null;
          if (assistantCreated) {
            const next = latestMessages.current.map((message) => message.id === assistantStreamId.current ? { ...message, sources: payload.sources || [] } : message);
            latestMessages.current = next; setMessages(next);
          }
          queueSpeech('', true);
          console.info('[Orchid AI performance]', JSON.stringify({
            metric: 'requestComplete', language: responseLanguage, recognitionMs,
            clientRequestMs: Math.round(performance.now() - responseStartedAt.current),
            clientFirstTokenMs: firstTokenAt.current === null ? null : Math.round(firstTokenAt.current - responseStartedAt.current),
            firstTextDisplayedMs: firstTextDisplayedAt === null ? null : Math.round(firstTextDisplayedAt - responseStartedAt.current),
            backendRequestMs: timings.requestMs, backendAiFirstTokenMs: timings.aiFirstTokenMs,
            backendAiCompleteMs: timings.aiCompleteMs, retrievalMs: timings.retrievalMs,
          }));
        }
        if (type === 'error') throw new Error(payload.error || copyRef.current.assistantError);
      };
      let ended = false;
      while (!ended) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        let boundary;
        while ((boundary = buffer.search(/\r?\n\r?\n/)) !== -1) {
          const frame = buffer.slice(0, boundary);
          const delimiter = buffer.slice(boundary).match(/^\r?\n\r?\n/)[0];
          buffer = buffer.slice(boundary + delimiter.length);
          handleFrame(frame);
        }
        ended = done;
      }
      if (buffer.trim()) handleFrame(buffer);
    } catch (error) {
      if (error.name === 'AbortError' || request !== requestId.current) return;
      setNotice(copyRef.current.assistantError); setState('error');
    } finally {
      if (request === requestId.current) activeRequest.current = null;
    }
  }, [queueSpeech]);
  askRef.current = ask;

  const startListening = useCallback(async () => {
    greetingStarted.current = true;
    greetingPending.current = false;
    setVoicePromptRequired(false);
    logMic('Activation requested', { secureContext: window.isSecureContext, language: languageRef.current, locale: locales[languageRef.current] });
    if (recognitionStarting.current) { logMic('Duplicate recognition start ignored', { reason: 'permission/start already pending' }); return; }
    if (recognition.current) { logMic('Duplicate recognition start ignored', { reason: 'recognizer already active' }); return; }
    window.clearTimeout(silenceTimer.current);
    activeRequest.current?.abort(); activeRequest.current = null; requestId.current++;
    window.clearTimeout(ttsQueue.current.voiceTimer);
    speechId.current++;
    stopGeneratedAudio(ttsQueue.current);
    window.speechSynthesis?.cancel();
    ttsQueue.current = { queue: [], buffer: '', done: true, speaking: false, autoListen: false, waitingForVoices: false, voiceTimer: null };

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      logMic('Speech recognition unsupported');
      setNotice(copyRef.current.recognitionUnsupported); setState('error'); return;
    }
    if (!window.isSecureContext) {
      logMic('Microphone blocked by insecure context');
      setNotice(copyRef.current.insecureContext); setState('error'); return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      logMic('getUserMedia unavailable');
      setNotice(copyRef.current.micError); setState('error'); return;
    }

    recognitionStarting.current = true;
    let permissionStream = null;
    const permissionCopy = copyRef.current;
    setPartial(''); setNotice(permissionCopy.requestingMic); setState('listening');
    logMic('Microphone permission requested');
    try {
      if (!microphonePermissionGranted.current) {
        // Request permission directly from the initial button gesture, once per page session.
        permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphonePermissionGranted.current = true;
        logMic('Microphone permission granted', { audioTracks: permissionStream.getAudioTracks().length });
        permissionStream.getTracks().forEach((track) => track.stop());
        permissionStream = null;
      }

      const engine = new SpeechRecognition();
      engine.lang = locales[languageRef.current];
      engine.interimResults = true;
      engine.continuous = true;
      engine.maxAlternatives = 1;
      finalTranscript.current = ''; interimTranscript.current = '';
      recognitionStartedAt.current = performance.now();
      let submitted = false;
      logMic('Recognition instance created', { locale: engine.lang, continuous: engine.continuous, interimResults: engine.interimResults });

      const submitTranscript = () => {
        if (submitted) return;
        const transcript = finalTranscript.current.trim();
        if (!transcript) return;
        submitted = true;
        window.clearTimeout(silenceTimer.current);
        const recognitionMs = Math.round(performance.now() - recognitionStartedAt.current);
        logMic('Final transcript received', { characters: transcript.length, recognitionMs, locale: engine.lang });
        recognition.current = null;
        try { engine.abort(); } catch {}
        console.info('[Orchid AI performance]', JSON.stringify({ metric: 'speechRecognitionComplete', language: languageRef.current, recognitionMs }));
        askRef.current?.(transcript, { fromVoice: true, recognitionMs });
      };

      engine.onstart = () => {
        logMic('Recognition started', { locale: engine.lang });
        setNotice(''); setState('listening');
      };
      engine.onaudiostart = () => logMic('Audio capture started');
      engine.onspeechstart = () => logMic('Speech detected');
      engine.onspeechend = () => logMic('Speech ended');
      engine.onaudioend = () => logMic('Audio capture ended');
      engine.onresult = (event) => {
        let interim = '';
        for (let index = event.resultIndex; index < event.results.length; index++) {
          const item = event.results[index];
          if (item.isFinal) {
            finalTranscript.current += `${item[0].transcript} `;
            logMic('Final recognition result', { characters: item[0].transcript.length, locale: engine.lang });
          } else interim += `${item[0].transcript} `;
        }
        interimTranscript.current = interim.trim();
        const transcript = `${finalTranscript.current} ${interimTranscript.current}`.trim();
        if (interimTranscript.current) logMic('Interim transcript received', { characters: interimTranscript.current.length, locale: engine.lang });
        setActivity((count) => count + 1); setPartial(transcript);
        window.clearTimeout(silenceTimer.current);
        if (finalTranscript.current.trim()) silenceTimer.current = window.setTimeout(submitTranscript, Number(import.meta.env.VITE_VOICE_SILENCE_MS) || 400);
      };
      engine.onerror = (event) => {
        logMic('Recognition error', { code: event.error, message: event.message || '', locale: engine.lang });
        if ((event.error === 'aborted' && engine._orchidCanceled) || submitted) return;
        recognition.current = null; window.clearTimeout(silenceTimer.current);
        const activeCopy = copyRef.current;
        const messages = {
          'not-allowed': activeCopy.permission,
          'service-not-allowed': activeCopy.serviceBlocked,
          'audio-capture': activeCopy.microphoneBusy,
          'no-speech': activeCopy.noSpeech,
          network: activeCopy.speechNetworkError,
          aborted: activeCopy.recognitionError,
        };
        const reason = messages[event.error] || `${activeCopy.recognitionError} (${event.error || 'unknown error'})`;
        setNotice(reason); setState('error');
      };
      engine.onend = () => {
        logMic('Recognition stopped', { submitted, cancelled: Boolean(engine._orchidCanceled), locale: engine.lang });
        if (recognition.current === engine) recognition.current = null;
        if (submitted || engine._orchidCanceled) return;
        if (finalTranscript.current.trim()) submitTranscript();
        else setState((current) => current === 'listening' ? 'idle' : current);
      };

      recognition.current = engine;
      engine.start();
      logMic('recognition.start() called', { locale: engine.lang });
    } catch (error) {
      if (permissionStream) permissionStream.getTracks().forEach((track) => track.stop());
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') logMic('Microphone permission denied', { name: error.name, message: error.message || '' });
      logMic('Microphone or recognition startup failed', { name: error.name || 'Error', message: error.message || '' });
      const activeCopy = copyRef.current;
      const messages = {
        NotAllowedError: activeCopy.permission,
        PermissionDeniedError: activeCopy.permission,
        SecurityError: activeCopy.insecureContext,
        NotFoundError: activeCopy.microphoneMissing,
        DevicesNotFoundError: activeCopy.microphoneMissing,
        NotReadableError: activeCopy.microphoneBusy,
        TrackStartError: activeCopy.microphoneBusy,
        OverconstrainedError: activeCopy.microphoneMissing,
        InvalidStateError: activeCopy.recognitionError,
      };
      setNotice(messages[error.name] || `${activeCopy.micError} (${error.name || 'unknown error'})`);
      setState('error');
      recognition.current = null;
    } finally {
      recognitionStarting.current = false;
      if (permissionStream) permissionStream.getTracks().forEach((track) => track.stop());
    }
  }, []);
  startListeningRef.current = startListening;

  const stopSpeech = () => {
    greetingStarted.current = true;
    greetingPending.current = false;
    setVoicePromptRequired(false);
    speechId.current++; requestId.current++; activeRequest.current?.abort(); activeRequest.current = null;
    window.clearTimeout(ttsQueue.current.voiceTimer);
    stopGeneratedAudio(ttsQueue.current);
    ttsQueue.current = { queue: [], buffer: '', done: true, speaking: false, autoListen: false, waitingForVoices: false, voiceTimer: null };
    abortRecognition(recognition);
    window.speechSynthesis?.cancel(); setState('idle');
  };
  const clear = () => {
    greetingStarted.current = true;
    greetingPending.current = false;
    setVoicePromptRequired(false);
    requestId.current++; speechId.current++; activeRequest.current?.abort(); activeRequest.current = null;
    window.clearTimeout(silenceTimer.current); window.clearTimeout(ttsQueue.current.voiceTimer);
    abortRecognition(recognition); stopGeneratedAudio(ttsQueue.current); window.speechSynthesis?.cancel();
    ttsQueue.current = { queue: [], buffer: '', done: true, speaking: false, autoListen: false, waitingForVoices: false, voiceTimer: null };
    const welcome = welcomeFor(language); latestMessages.current = [welcome]; setMessages([welcome]); setNotice(''); setPartial(''); setState('idle');
  };
  const goToSection = (section) => {
    if (section === activeSection) return;
    if (section === 'chat') stopSpeech();
    setActiveSection(section);
  };
  const submitTextChat = async (rawQuestion) => {
    const question = rawQuestion.trim();
    if (!question) return '';
    const { language: responseLanguage, languagePinned: isLanguagePinned } = applyQuestionLanguage(question);
    const request = ++chatRequestId.current;
    chatRequestController.current?.abort();
    const controller = new AbortController();
    chatRequestController.current = controller;
    const previousMessages = chatMessagesRef.current;
    const history = previousMessages.slice(-8).map(({ role, content }) => ({ role, content }));
    const current = [...previousMessages, { role: 'user', content: question }];
    chatMessagesRef.current = current;
    setChatMessages(current);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question, history, language: responseLanguage, languagePinned: isLanguagePinned }),
        signal: controller.signal,
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Chat request failed');
      const answer = typeof payload.answer === 'string' && payload.answer.trim() ? payload.answer : sectionLabels[responseLanguage].chatError;
      if (request === chatRequestId.current) {
        const next = [...current, { role: 'assistant', content: answer, sources: payload.sources || [] }];
        chatMessagesRef.current = next;
        setChatMessages(next);
      }
      return answer;
    } catch (error) {
      if (request !== chatRequestId.current) return sectionLabels[responseLanguage].chatError;
      const answer = sectionLabels[responseLanguage].chatError;
      const next = [...current, { role: 'assistant', content: answer, sources: [] }];
      chatMessagesRef.current = next;
      setChatMessages(next);
      return answer;
    }
  };
  const clearTextChat = () => {
    chatRequestId.current++;
    chatRequestController.current?.abort();
    chatRequestController.current = null;
    chatMessagesRef.current = [];
    setChatMessages([]);
    setChatResetKey((key) => key + 1);
  };
  const stateLabel = { idle: copy.ready, listening: copy.listening, processing: copy.processing, speaking: copy.speaking, error: copy.error }[state];
  const changeLanguage = (nextLanguage) => {
    if (!locales[nextLanguage]) return;
    try { window.localStorage.setItem('orchid-language', nextLanguage); } catch {}
    languagePinned.current = nextLanguage;
    if (greetingPending.current) {
      greetingPending.current = false;
      window.clearTimeout(ttsQueue.current.voiceTimer);
      stopGeneratedAudio(ttsQueue.current);
      window.speechSynthesis?.cancel();
      setVoicePromptRequired(false);
    }
    const wasListening = Boolean(recognition.current);
    languageRef.current = nextLanguage;
    copyRef.current = copyByLanguage[nextLanguage];
    setLanguage(nextLanguage);
    requestId.current++; activeRequest.current?.abort(); activeRequest.current = null;
    window.clearTimeout(silenceTimer.current); window.clearTimeout(ttsQueue.current.voiceTimer);
    abortRecognition(recognition);
    stopGeneratedAudio(ttsQueue.current);
    ttsQueue.current = { queue: [], buffer: '', done: true, speaking: false, autoListen: false, waitingForVoices: false, voiceTimer: null };
    speechId.current++;
    window.speechSynthesis?.cancel();
    setState('idle');
    setNotice('');
    if (latestMessages.current.length <= 1) {
      const nextWelcome = welcomeFor(nextLanguage);
      latestMessages.current = [nextWelcome]; setMessages([nextWelcome]);
    }
    if (wasListening) window.setTimeout(() => startListeningRef.current?.(), 0);
  };

  return <main lang={locales[language]} className={`app-frame${activeSection === 'chat' ? ' chat-open' : ''}`}>
    <div className="signal-background" aria-hidden="true">
      <PredictiveArcCanvas variant="signal-particles" mode="dark" speed={1.00} hue={0} saturation={1.00} brightness={1.00} />
    </div>
    <header className="topbar">
      <a className="identity" href="https://orchidengg.ac.in/" target="_blank" rel="noreferrer">
        <img src="/nkocet-logo.png" alt="NKOCET emblem" />
        <span><strong>ORCHID <i>AI</i></strong><small>N. K. Orchid College of Engineering &amp; Technology</small></span>
      </a>
      <div className="top-actions"><span className="campus-tag"><span /> SOLAPUR, INDIA</span><nav className="section-nav" aria-label="Assistant sections"><button type="button" className={activeSection === 'communication' ? 'selected' : ''} aria-pressed={activeSection === 'communication'} onClick={() => goToSection('communication')}>{sectionLabels[language].communication}</button><button type="button" className={activeSection === 'chat' ? 'selected' : ''} aria-pressed={activeSection === 'chat'} onClick={() => goToSection('chat')}>{sectionLabels[language].chat}</button></nav><label className="language-select"><span className="sr-only">{copy.language}</span><select value={language} onChange={(e) => changeLanguage(e.target.value)} aria-label={copy.language}><option value="en">English</option><option value="mr">मराठी (Marathi)</option><option value="hi">हिन्दी (Hindi)</option></select></label></div>
    </header>

    <section className="communication-section" ref={communicationRef} aria-label={sectionLabels[language].communication}>
    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> {copy.heroEyebrow}</div>
        <h1>{copy.heroTitle}<br /><span>{copy.heroAccent}</span> {copy.heroEnd}</h1>
        <p>{copy.heroText}</p>
        <div className="hero-meta"><span className="availability"><span /> {copy.online}</span><span>EN · HI · MR</span></div>
      </div>
      <div className={`glass-card glass-${state}`}>
        <div className="card-topline"><span>{copy.glassTop} <b>·</b> {copy.glassSub}</span><span className="three-badge">THREE.JS R170</span></div>
      <GlassButton onActivate={startListening} onPulse={() => setNotice('')} state={state} activity={activity} label={copy.voiceTip} />
        <div className="voice-state"><div className={`state-orb orb-${state}`}><span /></div><span>{stateLabel}</span>{(state === 'speaking' || state === 'processing') && <button className="stop-button" onClick={stopSpeech}><Icon name="stop" /> {copy.stop}</button>}</div>
      </div>
    </section>

    <section className="workspace">
      <div className="conversation-panel">
        <div className="section-heading"><div><div className="eyebrow">{copy.conversation}</div><h2>{copy.chatTitle}</h2></div><button className="clear-button" onClick={clear} title={copy.clear}><Icon name="trash" /> <span>{copy.clear}</span></button></div>
        <div className="transcript" ref={transcriptRef} aria-live="polite">
          {messageHistory.length === 0 ? <div className="welcome-card"><div className="assistant-mark"><Icon name="spark" /></div><p>{copy.welcome}</p><small>{copy.prompt}</small></div> : messageHistory.map((message, index) => <article className={`message message-${message.role}`} key={message.id || `${index}-${message.content.slice(0, 18)}`}><div className="message-label">{message.role === 'user' ? copy.you : copy.assistant}</div><p>{message.content}</p>{message.sources?.length > 0 && <div className="sources"><span>{copy.officialSources}</span>{message.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.topic} ↗</a>)}</div>}</article>)}
          {partial && <article className="message message-user"><div className="message-label">{copy.you} · {copy.live}</div><p>{partial}<span className="cursor" /></p></article>}
          {state === 'processing' && <div className="thinking"><span /><span /><span /> {copy.thinking}</div>}
        </div>
        {notice && <div className="notice" role="alert">{notice}</div>}
        {voicePromptRequired && <div className="voice-enable-prompt" role="status"><span>{copy.voiceBlocked}</span><button type="button" onClick={retryGreetingVoice}>{copy.enableVoice}</button></div>}
      </div>
      <aside className="communication-guide"><div className="eyebrow">{copy.begin} · VOICE</div><h3>{copy.voiceTip}</h3><p>{copy.prompt}</p><p>{copy.based}</p><div className="voice-guide-state"><span className={`guide-dot guide-${state}`} />{stateLabel}</div></aside>
    </section>
    </section>

    <section className="chat-section" ref={chatSectionRef} aria-label={sectionLabels[language].chat}>
      <div className="chat-section-heading"><h2>Your Campus, <span>One Conversation</span> Away.</h2><p>Ask anything about NKOCET — academics, admissions, departments, events, facilities and more.</p><button className="clear-button" type="button" onClick={clearTextChat} disabled={!chatMessages.length}><Icon name="trash" /> <span>{sectionLabels[language].clear}</span></button></div>
      {activeSection === 'chat' && <MorphOrb key={chatResetKey} onSubmit={submitTextChat} minThinkMs={0} speed={1.5} copy={morphCopyByLanguage[language]} />}
      <div className="chat-history" aria-live="polite">
        {chatMessages.length === 0 ? <p className="chat-empty">{sectionLabels[language].noHistory}</p> : chatMessages.map((message, index) => <article className={`message message-${message.role}`} key={`${index}-${message.content.slice(0, 24)}`}><div className="message-label">{message.role === 'user' ? copy.you : copy.assistant}</div><p>{message.content}</p>{message.sources?.length > 0 && <div className="sources"><span>{copy.officialSources}</span>{message.sources.map((source) => <a key={`${source.url}-${source.topic}`} href={source.url} target="_blank" rel="noreferrer">{source.topic} ↗</a>)}</div>}</article>)}
      </div>
    </section>
    <footer className="landing-footer"><div className="website-note"><b>{copy.footerTitle}</b><span>{copy.footerText}</span></div></footer>
  </main>;
}
