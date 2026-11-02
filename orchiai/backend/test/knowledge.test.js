import test from 'node:test';
import assert from 'node:assert/strict';
import { answerQuestion, knowledge, localizedKnowledge, placementData, retrieve, streamQuestion } from '../src/knowledge.js';
import { detectLanguageCommand, detectQuestionLanguage, resolveReplyLanguage } from '../../shared/language.js';
import { getGreeting, getPreferredLanguage } from '../../shared/greetings.js';
import { DEFAULT_SPEECH_RATE, getSpeechRate, GREETING_SPEECH_RATE } from '../../shared/speech-settings.js';

test('opening greeting uses the selected supported language and defaults to the requested English greeting', () => {
  assert.equal(getGreeting(), 'Hello! Welcome to OrchiVoice, your college assistant. How can I help you today? You can ask me anything about our college');
  assert.equal(getPreferredLanguage('hi'), 'hi');
  assert.equal(getPreferredLanguage('mr'), 'mr');
  assert.equal(getPreferredLanguage('fr'), 'en');
  assert.match(getGreeting('hi'), /नमस्ते/u);
  assert.match(getGreeting('mr'), /नमस्कार/u);
});

test('opening greeting speaks faster without changing the normal answer rate', () => {
  assert.equal(getSpeechRate(true), GREETING_SPEECH_RATE);
  assert.equal(getSpeechRate(false), DEFAULT_SPEECH_RATE);
  assert.ok(GREETING_SPEECH_RATE > DEFAULT_SPEECH_RATE);
});

test('language detection handles explicit switches, scripts, and Hinglish code-switching', () => {
  assert.deepEqual(detectLanguageCommand('Can you speak Marathi?'), { language: 'mr', kind: 'capability' });
  assert.deepEqual(detectLanguageCommand('Can you speak Hindi?'), { language: 'hi', kind: 'capability' });
  assert.deepEqual(detectLanguageCommand('Speak in English'), { language: 'en', kind: 'switch' });
  assert.deepEqual(detectLanguageCommand('हिंदी में बात करो'), { language: 'hi', kind: 'switch' });
  assert.deepEqual(detectLanguageCommand('मराठीत बोला'), { language: 'mr', kind: 'switch' });
  assert.equal(detectQuestionLanguage('कॉम्प्युटर सायन्स विभाग कुठे आहे?'), 'mr');
  assert.equal(detectQuestionLanguage('कंप्यूटर साइंस विभाग कहाँ है?'), 'hi');
  assert.equal(detectQuestionLanguage('CSE chi fees kiti aahe?'), 'mr');
  assert.equal(detectQuestionLanguage('सर्व branches सांग.'), 'mr');
  assert.equal(detectQuestionLanguage('मुझे सभी विभागों के नाम बताओ।'), 'hi');
  assert.equal(detectQuestionLanguage('CSE fees kya hai?'), 'hi');
  assert.equal(detectQuestionLanguage('Where is the CSE department?'), 'en');
  assert.equal(resolveReplyLanguage('CSE फीस कितनी है?', 'en', true), 'en', 'manual language selection remains pinned');
  assert.equal(resolveReplyLanguage('मराठीत बोला', 'en', true), 'mr', 'an explicit command overrides the prior selection');
});

test('language capability requests are answered in the requested language in direct and streaming chat', async () => {
  const cases = [
    ['Can you speak Marathi?', 'mr', /हो, मी मराठीत/u],
    ['Can you speak Hindi?', 'hi', /हाँ, मैं हिंदी/u],
    ['Speak in English', 'en', /Sure, I’ll continue in English/u],
  ];
  for (const [question, language, expected] of cases) {
    const direct = await answerQuestion(question, [], 'en');
    assert.match(direct.answer, expected, question);
    assert.deepEqual(direct.sources, []);
    let streamed = '';
    const result = await streamQuestion(question, [], 'en', 'student', (chunk) => { streamed += chunk; });
    assert.equal(streamed, direct.answer, question);
    assert.equal(result.answer, direct.answer, question);
  }
});

const questionsFor = (language) => Object.entries(localizedKnowledge)
  .flatMap(([id, entry]) => (entry[language]?.questions || []).map((question) => ({ id, question })));

for (const [language, minimum] of [['mr', 100], ['hi', 50], ['en', 50]]) {
  const questions = questionsFor(language);
  test(`${language}: all ${questions.length} stored question variations retrieve their intended entry`, () => {
    assert.ok(questions.length >= minimum, `expected at least ${minimum} questions; found ${questions.length}`);
    for (const { id, question } of questions) {
      assert.equal(retrieve(question)[0]?.id, id, `${language} query: ${question}`);
    }
  });
}

const mixedQuestions = [
  ['overview', 'NKOCET म्हणजे काय?'], ['vision', 'कॉलेजचे vision आणि mission काय आहे?'],
  ['principal', 'कॉलेजचे principal कोण आहेत?'], ['departments', 'कॉलेजमध्ये कोणत्या engineering branches आहेत?'],
  ['admission', 'Admission कसा घ्यायचा?'], ['eligibility', 'B.Tech admission साठी MHT-CET लागते का?'],
  ['fees', 'कॉलेजची fees किती आहे?'], ['placements', 'Placement training कसे मिळते?'],
  ['facilities', 'कॅम्पसमध्ये कोणत्या facilities आहेत?'], ['hostel', 'कॉलेजमध्ये hostel आहे का?'],
  ['library', 'Central Library कुठे आहे?'], ['transport', 'कॉलेज bus routes बद्दल सांगा'],
  ['research', 'Research आणि innovation ची माहिती द्या'], ['studyabroad', 'Study abroad guidance मिळते का?'],
  ['faculty', 'Faculty आणि HOD ची माहिती कुठे मिळेल?'], ['scholarships', 'Scholarship बद्दल माहिती द्या'],
  ['studentlife', 'कॉलेजमध्ये technical events होतात का?'], ['contact', 'College address काय आहे?'],
  ['examinations', 'Exam timetable आणि results कुठे पाहू?'], ['canteen', 'Canteen ची timing काय आहे?'],
  ['sports', 'कॉलेजमध्ये कोणते sports आहेत?'], ['notices', 'Latest college notices कुठे मिळतील?'],
  ['department_cse', 'CSE ची intake किती आहे?'], ['department_ai_ds', 'AI & DS ची intake किती आहे?'],
  ['department_civil', 'Civil Engineering intake किती आहे?'], ['department_mechanical', 'Mechanical ची intake किती आहे?'],
  ['department_electrical', 'Electrical Engineering intake किती आहे?'], ['department_entc', 'E&TC मध्ये काय शिकवतात?'],
  ['department_ai_ds', 'AI & DS department कुठल्या building मध्ये आहे?'],
  ['committees', 'Grievance committee मध्ये तक्रार कशी करायची?'],
];

test('mixed Marathi-English: 30 code-switched questions retrieve the intended entry', () => {
  assert.equal(mixedQuestions.length, 30);
  for (const [id, question] of mixedQuestions) assert.equal(retrieve(question)[0]?.id, id, question);
});

test('department-list paraphrases in English, Hindi, and Marathi share the canonical departments answer', async () => {
  const questions = [
    'What departments are available?', 'Which branches does Orchid have?', 'List engineering departments.',
    'Departments?', 'Branches?', 'What can I study here?', 'What courses are available in this college?',
    'Orchid mein kaun kaun si branches hain?', 'Yaha konsi engineering branches hai?',
    'मुझे सभी विभागों के नाम बताओ।', 'कॉलेज में कौन-कौन सी ब्रांच हैं?',
    'कॉलेज में कौन-कौन से विभाग हैं?', 'सभी branches के नाम बताओ।',
    'इथे कोणकोणते विभाग आहेत?', 'सर्व branches सांग.', 'मला कॉलेजचे departments सांग.',
  ];
  for (const question of questions) assert.equal(retrieve(question)[0]?.id, 'departments', question);

  const canonical = await answerQuestion(questions[0], [], 'en');
  for (const question of questions.slice(0, 7)) {
    const result = await answerQuestion(question, [], 'en');
    assert.equal(result.answer, canonical.answer, question);
    assert.deepEqual(result.sources, canonical.sources, question);
  }
  for (const [language, localizedQuestions] of [
    ['hi', questions.slice(9, 13)],
    ['mr', questions.slice(13)],
  ]) {
    const answers = await Promise.all(localizedQuestions.map((question) => answerQuestion(question, [], language)));
    assert.ok(answers.every(({ answer }) => answer === answers[0].answer), `${language} variants should share the localized answer`);
    assert.ok(answers.every(({ sources }) => sources.some(({ url }) => url.includes('orchidengg.ac.in'))), `${language} variants should cite the official source`);
  }
});

test('core Marathi questions return specific verified answers and official sources', async () => {
  const cases = [
    ['कॉलेज कुठे आहे?', 'contact'],
    ['कॉलेजमध्ये कोणत्या शाखा आहेत?', 'departments'],
    ['CSE ची intake किती आहे?', 'department_cse'],
    ['हॉस्टेल आहे का?', 'hostel'],
    ['प्लेसमेंट कसे आहे?', 'placements'],
    ['कॉलेजची फी किती आहे?', 'fees'],
  ];
  for (const [question, expectedId] of cases) {
    const response = await answerQuestion(question, [], 'mr');
    assert.match(response.answer, /[\u0900-\u097f]/u, question);
    assert.ok(response.sources.length, `missing official source for ${question}`);
    assert.equal(retrieve(question)[0]?.id, expectedId);
  }
});

test('contextual follow-ups resolve the prior department without mixing topics', async () => {
  const history = [
    { role: 'user', content: 'आपल्या कॉलेजमध्ये कोणकोणत्या branches आहेत?' },
    { role: 'assistant', content: 'CSE, AI & DS, Civil…' },
    { role: 'user', content: 'CSE बद्दल सांग.' },
    { role: 'assistant', content: 'CSE विभागाची माहिती…' },
  ];
  assert.equal(retrieve('त्याची intake किती आहे?', history)[0]?.id, 'department_cse');
  assert.match((await answerQuestion('त्याची intake किती आहे?', history, 'mr')).answer, /१८०/u);
});

test('short and natural department questions retrieve the shared verified records for chat and voice', async () => {
  const hodQuestion = 'Who is the HOD of CSE?';
  const direct = await answerQuestion(hodQuestion, [], 'en');
  assert.match(direct.answer, /Computer Science and Engineering HOD is Dr\. V\. V\. Bag/u);
  assert.ok(direct.sources.some((source) => source.url === 'https://orchidengg.ac.in/organogram/'));

  let streamed = '';
  const result = await streamQuestion(hodQuestion, [], 'en', 'student', (chunk) => { streamed += chunk; });
  assert.match(streamed, /Computer Science and Engineering HOD is Dr\. V\. V\. Bag/u);
  assert.ok(result.sources.some((source) => source.url === 'https://orchidengg.ac.in/organogram/'));

  assert.equal(retrieve('What is the name of the college?')[0]?.id, 'overview');
  assert.equal(retrieve('What departments are available?')[0]?.id, 'departments');
  assert.match((await answerQuestion('Show CSE faculty', [], 'en')).answer, /couldn't find verified information/u);
});

test('explicit leadership questions replace prior department context in chat and voice and cite only supporting sources', async () => {
  const history = [];
  const cases = [
    ['Who is the Mechanical HOD?', /Mechanical Engineering HOD is Prof\. S\. S\. Kale/u, ['https://orchidengg.ac.in/organogram/']],
    ['Who is the Principal?', /Dr\. B\. K\. Sonage/u, ['https://orchidengg.ac.in/principals-message/', 'https://orchidengg.ac.in/organogram/']],
    ['Who is the Vice Principal?', /Dr\. V\. K\. Patki and Dr\. S\. S\. Metan/u, ['https://orchidengg.ac.in/organogram/']],
    ['Who is the CSE HOD?', /Computer Science and Engineering HOD is Dr\. V\. V\. Bag/u, ['https://orchidengg.ac.in/organogram/']],
  ];
  let previousAnswer = '';
  for (const [question, expected, expectedSources] of cases) {
    const direct = await answerQuestion(question, history, 'en');
    assert.match(direct.answer, expected, question);
    assert.notEqual(direct.answer, previousAnswer, `stale answer repeated for ${question}`);
    assert.deepEqual([...new Set(direct.sources.map((source) => source.url))].sort(), [...expectedSources].sort(), `sources for ${question}`);
    let streamed = '';
    const streamResult = await streamQuestion(question, history, 'en', 'student', (chunk) => { streamed += chunk; });
    assert.equal(streamed, direct.answer, `voice/chat answer mismatch for ${question}`);
    assert.deepEqual([...new Set(streamResult.sources.map((source) => source.url))].sort(), [...expectedSources].sort(), `voice sources for ${question}`);
    history.push({ role: 'user', content: question }, { role: 'assistant', content: direct.answer });
    previousAnswer = direct.answer;
  }
  assert.match((await answerQuestion('Who is the Registrar?', history, 'en')).answer, /couldn't find verified information/u);
});

test('out-of-scope and unknown college details use localized safe responses', async () => {
  for (const language of ['en', 'hi', 'mr']) {
    const outOfScope = await answerQuestion('weather in Mumbai today', [], language);
    const unknown = await answerQuestion('कॉलेजच्या मागच्या वर्षीच्या scholarship cutoff ची अचूक टक्केवारी काय?', [], language);
    assert.ok(outOfScope.answer.length > 20);
    assert.ok(unknown.answer.length > 20);
    if (language === 'mr') {
      assert.match(outOfScope.answer, /फक्त.*NKOCET|फक्त.*ऑर्किड/u);
      assert.match(unknown.answer, /अधिकृत संकेतस्थळावर.*खात्रीशीर/u);
    }
  }
});

test('known FAQs are answered locally without a Gemini network request, including streaming', async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls += 1; throw new Error('unexpected network request'); };
  try {
    const direct = await answerQuestion('CSE ची intake किती आहे?', [], 'mr');
    let streamed = '';
    const result = await streamQuestion('CSE ची intake किती आहे?', [], 'mr', 'student', (text) => { streamed += text; });
    assert.match(direct.answer, /१८०/u);
    assert.match(streamed, /१८०/u);
    assert.equal(result.sources[0]?.url, 'https://orchidengg.ac.in/computer-science-and-engineering/');
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('spelling variation and language changes preserve intent and answer language', async () => {
  assert.equal(retrieve('कोलेज कुठे आहे?')[0]?.id, 'contact');
  const marathi = await answerQuestion('हॉस्टेल आहे का?', [], 'en');
  const hindi = await answerQuestion('हॉस्टेल है क्या?', [], 'en');
  const english = await answerQuestion('हॉस्टेल आहे का?', [], 'en', 'student', true);
  assert.match(marathi.answer, /[\u0900-\u097f]/u);
  assert.match(hindi.answer, /[\u0900-\u097f]/u);
  assert.match(english.answer, /NKOCET|hostel/u);
  assert.notEqual(marathi.answer, hindi.answer);
});

test('every localized record links to the same official source as its verified base entry', () => {
  assert.equal(Object.keys(localizedKnowledge).length, knowledge.length);
  for (const entry of knowledge) {
    const localized = localizedKnowledge[entry.id];
    assert.ok(localized, `missing localized record: ${entry.id}`);
    assert.match(entry.source, /^https:\/\/orchidengg\.ac\.in\//u, `non-official source: ${entry.id}`);
    assert.match(entry.verified, /^\d{4}-\d{2}-\d{2}$/u, `missing verification date: ${entry.id}`);
    assert.equal(localized.source, entry.source, `source mismatch: ${entry.id}`);
    assert.equal(localized.verified, entry.verified, `verification date mismatch: ${entry.id}`);
  }
});

for (const language of ['en', 'mr', 'hi']) {
  const placementQuestions = placementData.entries.flatMap((entry) => (entry.localized[language]?.questions || []).map((question) => ({ entry, question })));
  test(`${language}: placement Q&A variation set has at least 100 targeted questions and retrieves local verified answers`, async () => {
    assert.ok(placementQuestions.length >= 100, `only ${placementQuestions.length} ${language} placement questions are indexed`);
    for (const { entry, question } of placementQuestions) {
      const top = retrieve(question)[0];
      assert.ok(top, `${language}: no match for ${question}`);
      assert.equal(top.id, entry.id, `${language}: ${question}`);
      const response = await answerQuestion(question, [], language);
      assert.ok(response.answer.length > 20, `${language}: empty answer for ${question}`);
      assert.ok(response.sources.length, `${language}: no source for ${question}`);
    }
  });
}

test('placement facts retain official totals, duplicate offers, language data, and explicit publication gaps', () => {
  assert.equal(placementData.companyOffers.length, 40);
  assert.equal(placementData.companies.length, 38);
  const duplicates = placementData.companies.find(({ name }) => /Consistent Consultants Engineers/i.test(name));
  assert.equal(duplicates.offers.length, 3);
  assert.ok(placementData.entries.some(({ id }) => id === 'placement_cse_company_breakdown_unpublished'));
  assert.ok(placementData.dataQuality.some(({ id }) => id === 'placements_2022_23'));
  for (const entry of placementData.entries) for (const language of ['en', 'mr', 'hi']) {
    assert.ok(entry.localized[language]?.answer, `${entry.id}: missing ${language} answer`);
  }
});

test('placement facts are answered from the local knowledge base without Gemini requests', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('unexpected Gemini network request'); };
  try {
    for (const [question, language] of [
      ['What was the highest package in 2025–26?', 'en'],
      ['२०२५–२६ मध्ये किती विद्यार्थी निवडले गेले?', 'mr'],
      ['2025–26 में सबसे अधिक package कितना था?', 'hi'],
    ]) {
      const result = await answerQuestion(question, [], language);
      assert.ok(result.answer.length > 20);
      assert.ok(result.sources.length);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});
