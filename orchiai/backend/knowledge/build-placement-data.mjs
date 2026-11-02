import { writeFile } from 'node:fs/promises';

const main = 'https://orchidengg.ac.in/training-placement/';
const old = 'https://orchidengg.ac.in/training-and-placement/';
const etcPage = 'https://orchidengg.ac.in/etc/';
const verified = '2026-10-31';
const records = [];

function add(id, topic, answers, questions, keywords, extra = {}) {
  records.push({
    id, category: 'Training & Placement', subcategory: extra.subcategory || 'general', topic,
    academicYear: extra.academicYear || null, branch: extra.branch || null,
    company: extra.company || null, package: extra.package || null,
    source: extra.source || main, verified, localized: {
      en: { answer: answers.en, questions: questions.en, keywords: keywords.en || [] },
      mr: { answer: answers.mr, questions: questions.mr, keywords: keywords.mr || [] },
      hi: { answer: answers.hi, questions: questions.hi, keywords: keywords.hi || [] },
    },
  });
}
const q = (mr, hi, en) => ({ mr, hi, en });
const k = (mr, hi, en) => ({ mr, hi, en });

add('placement_overview', 'NKOCET placement record and support', {
  en: 'Yes. NKOCET has a Training & Placement Cell that prepares students through aptitude and soft-skills sessions, technical and company-specific training, mock interviews, group discussions, resume support, internship guidance, and campus recruitment. The published 2025–26 overview reports 460 students selected. Selection and salary are not guaranteed.',
  mr: 'होय. NKOCET मध्ये Training & Placement Cell आहे. तो aptitude व soft-skills सत्रे, technical आणि company-specific training, mock interviews, group discussions, resume मदत, internship मार्गदर्शन आणि campus recruitment साठी विद्यार्थ्यांना तयार करतो. प्रकाशित २०२५–२६ आकडेवारीत ४६० विद्यार्थ्यांची निवड नोंदली आहे. नोकरी किंवा पगाराची हमी नाही.',
  hi: 'हाँ। NKOCET में Training & Placement Cell है। यह aptitude और soft-skills सत्रों, technical व company-specific training, mock interviews, group discussions, resume सहायता, internship मार्गदर्शन और campus recruitment के लिए विद्यार्थियों को तैयार करता है। प्रकाशित 2025–26 आँकड़ों में 460 विद्यार्थियों के चयन का उल्लेख है। नौकरी या वेतन की गारंटी नहीं है。',
}, q(
  ['NKOCET मध्ये placement मिळते का?', 'कॉलेजचे placement record काय आहे?', 'कॉलेजचा placement कसा आहे?', 'placement cell काय काम करतो?', 'किती students select झाले?'],
  ['क्या NKOCET में campus placement होता है?', 'कॉलेज का placement record कैसा है?', 'कॉलेज में कितने विद्यार्थियों का चयन हुआ?', 'Training and Placement Cell क्या करता है?'],
  ['Does NKOCET provide campus placement opportunities?', 'How is the placement record of NKOCET?', 'How many students got jobs this year?', 'Does the college have a separate Placement Cell?', 'What is the role of the Training and Placement Cell?', 'Tell me about college placements.', 'How does the placement process work?'],
), k(['प्लेसमेंट', 'नोकरी', 'कॅम्पस ड्राइव्ह', 'निवड'], ['प्लेसमेंट', 'नौकरी', 'कैंपस ड्राइव', 'चयन'], ['placement', 'placed', 'selected', 'campus recruitment', 'jobs', 'recruitment']), { subcategory: 'overview', academicYear: '2025-26' });

add('placement_recruiter_sectors', 'Recruiter sectors and partial company list', {
  en: 'NKOCET describes recruiters across engineering, IT, consulting, and core industries. Its displayed 2025–26 company list includes software/IT, finance, manufacturing, construction, and other sectors. The page ends with “And Many more,” so the displayed companies are not an exhaustive recruiter list.',
  mr: 'NKOCET च्या माहितीत engineering, IT, consulting आणि core industries मधील recruiters नमूद आहेत. दिसणाऱ्या २०२५–२६ यादीत software/IT, finance, manufacturing, construction आणि इतर क्षेत्रांतील कंपन्या आहेत. पेजवर “And Many more” असल्यामुळे ही पूर्ण recruiter यादी नाही.',
  hi: 'NKOCET की जानकारी में engineering, IT, consulting और core industries के recruiters शामिल हैं। दिखाई गई 2025–26 सूची में software/IT, finance, manufacturing, construction और अन्य क्षेत्रों की कंपनियाँ हैं। पेज पर “And Many more” लिखा है, इसलिए यह पूरी सूची नहीं है。',
}, q(['कॉलेजमध्ये कोणत्या प्रकारच्या कंपन्या येतात?', 'कोणते recruiters येतात?'], ['NKOCET में किस तरह की कंपनियाँ भर्ती करती हैं?', 'कौन-कौन से recruiters आते हैं?'], ['Which types of companies visit NKOCET for recruitment?', 'Which companies recruit students from NKOCET?', 'Which recruiters come to the college?']), k(['कंपनी', 'क्षेत्र', 'भरती'], ['कंपनी', 'क्षेत्र', 'भर्ती'], ['recruiters', 'companies', 'sectors', 'industries']), { subcategory: 'recruiters', academicYear: '2025-26' });

const history = [['2025-26', 460], ['2024-25', 490], ['2023-24', 441], ['2022-23', 421], ['2021-22', 484], ['2020-21', 474], ['2019-20', 449]];
for (const [year, count] of history) {
  const conflict = year === '2022-23';
  const enQ = ['How many students were placed in ' + year + '?', 'How many students were selected in ' + year + '?'];
  const mrQ = [year + ' मध्ये किती विद्यार्थ्यांची निवड झाली?', year + ' placement मध्ये किती विद्यार्थी प्लेस झाले?'];
  const hiQ = [year + ' में कितने विद्यार्थियों का चयन हुआ?', year + ' में कितने छात्र प्लेस हुए?'];
  add('placement_history_' + year, 'Students selected during ' + year, {
    en: 'The current main NKOCET Training & Placement page reports ' + count + ' students selected in ' + year + (conflict ? '. A legacy official page reports 407 for 2022–23 instead of 421; confirm the reconciled figure with the Placement Cell.' : '.') ,
    mr: 'NKOCET च्या सध्याच्या मुख्य Training & Placement पेजनुसार ' + year + ' मध्ये ' + count + ' विद्यार्थ्यांची निवड झाली.' + (conflict ? ' जुन्या अधिकृत पेजवर ४०७ असा वेगळा आकडा आहे; अंतिम पडताळणी Placement Cell कडून करा.' : ''),
    hi: 'NKOCET के वर्तमान मुख्य Training & Placement पेज के अनुसार ' + year + ' में ' + count + ' विद्यार्थियों का चयन हुआ।' + (conflict ? ' पुराने आधिकारिक पेज पर 407 का अलग आँकड़ा है; अंतिम पुष्टि Placement Cell से करें।' : ''),
  }, q(mrQ, hiQ, enQ), k(['निवड', 'प्लेसमेंट', 'विद्यार्थी', year], ['चयन', 'प्लेसमेंट', 'विद्यार्थी', year], ['students placed', 'selected', 'placement', year]), { subcategory: 'yearwise_statistics', academicYear: year });
  if (conflict) { records.at(-1).conflictingSource = old; records.at(-1).conflictingValue = 407; }
  if (conflict) records.at(-1).sources = [{ category:'Current placement statistics', topic:'2022–23 students selected', url:main }, { category:'Legacy placement statistics', topic:'2022–23 students selected (conflicting value)', url:old }];
}

const branches = [
  ['cse', 'Computer Science & Engineering', 'CSE', 144, ['कॉम्प्युटर', 'संगणक'], ['कंप्यूटर'], ['CSE', 'Computer Science']],
  ['ai_ds', 'Artificial Intelligence & Data Science', 'AI & DS', 56, ['कृत्रिम बुद्धिमत्ता', 'डेटा सायन्स'], ['कृत्रिम बुद्धिमत्ता', 'डेटा साइंस'], ['AI & DS', 'Artificial Intelligence', 'Data Science']],
  ['mechanical', 'Mechanical Engineering', 'Mechanical', 89, ['यांत्रिकी'], ['मैकेनिकल'], ['Mechanical Engineering']],
  ['entc', 'Electronics & Telecommunication', 'E&TC', 54, ['इलेक्ट्रॉनिक्स', 'दूरसंचार'], ['इलेक्ट्रॉनिक्स', 'दूरसंचार'], ['E&TC', 'Electronics and Telecommunication']],
  ['electrical', 'Electrical Engineering', 'Electrical', 59, ['विद्युत'], ['विद्युत'], ['Electrical Engineering']],
  ['civil', 'Civil Engineering', 'Civil', 58, ['स्थापत्य'], ['सिविल'], ['Civil Engineering']],
];
for (const [id, name, short, count, mrTerms, hiTerms, enTerms] of branches) {
  add('placement_branch_2025_26_' + id, name + ' placement selections', {
    en: count + ' students from ' + name + ' were selected in 2025–26, according to NKOCET’s published branch-wise placement overview.',
    mr: 'NKOCET च्या प्रकाशित शाखानिहाय आकडेवारीनुसार २०२५–२६ मध्ये ' + short + ' मधून ' + count + ' विद्यार्थ्यांची निवड झाली.',
    hi: 'NKOCET की प्रकाशित शाखा-वार placement जानकारी के अनुसार 2025–26 में ' + name + ' से ' + count + ' विद्यार्थियों का चयन हुआ।',
  }, q([short + ' मधून किती विद्यार्थी प्लेस झाले?', '२०२५–२६ मध्ये ' + short + ' placement किती झाले?'], [short + ' से 2025–26 में कितने विद्यार्थी प्लेस हुए?', name + ' से कितने छात्रों का चयन हुआ?'], ['How many ' + short + ' students were placed in 2025–26?', 'What is the ' + short + ' placement count?', 'How many students from ' + name + ' were selected?']), k(mrTerms.concat(['प्लेसमेंट', 'निवड', 'विद्यार्थी']), hiTerms.concat(['प्लेसमेंट', 'चयन', 'विद्यार्थी']), enTerms.concat(['placement', 'selected', 'students'])), { subcategory: 'branch_statistics', academicYear: '2025-26', branch: name });
}

add('placement_branch_highest_2025_26', 'Branch with most student selections', {
  en: 'In the published 2025–26 branch-wise table, Computer Science & Engineering has the highest selection count: 144 students. Selection counts alone do not establish which branch has the “best” placement; compare eligible cohort size, roles, companies, and packages too.',
  mr: 'प्रकाशित २०२५–२६ शाखानिहाय तक्त्यात Computer Science & Engineering मधून सर्वाधिक १४४ विद्यार्थ्यांची निवड झाली. फक्त निवडसंख्येवरून “सर्वोत्तम placement” ठरवता येत नाही; पात्र विद्यार्थ्यांची संख्या, भूमिका, कंपन्या आणि packages देखील तुलना करावीत.',
  hi: 'प्रकाशित 2025–26 शाखा-वार तालिका में Computer Science & Engineering से सबसे अधिक 144 विद्यार्थियों का चयन हुआ। केवल चयन संख्या से “सर्वश्रेष्ठ placement” तय नहीं होता; पात्र विद्यार्थियों की संख्या, भूमिकाएँ, कंपनियाँ और package भी देखें।',
}, q(['सर्वाधिक विद्यार्थी कोणत्या branch मधून निवडले?', 'कोणत्या शाखेचे सर्वाधिक placement झाले?', 'कोणत्या branch चे placement best आहे?'], ['सबसे अधिक विद्यार्थियों का चयन किस branch से हुआ?', 'किस शाखा का placement सबसे अच्छा है?'], ['Which branch had the highest number of selections in 2025–26?', 'Which engineering branch has the best placement?']), k(['शाखा', 'ब्रांच', 'प्लेसमेंट', 'निवड'], ['शाखा', 'ब्रांच', 'प्लेसमेंट', 'चयन'], ['branch', 'highest', 'best placement', 'selected']), { subcategory: 'branch_statistics', academicYear: '2025-26' });

add('placement_campus_drive_discrepancy', 'Published campus drive figures and discrepancy', {
  en: 'The main page’s 2025–26 table lists branch drive figures of 56, 39, 54, 29, 43, and 36, which sum to 257, while its displayed total says 118. The page separately reports 460 students placed, matching the sum of branch student counts. The campus-drive discrepancy is unresolved; do not treat 118 as the sum of branch values.',
  mr: 'मुख्य पेजवरील २०२५–२६ तक्त्यात शाखानिहाय campus drives ५६, ३९, ५४, २९, ४३ आणि ३६ आहेत; त्यांची बेरीज २५७ होते, पण पेजवरील एकूण ११८ आहे. निवड झालेल्या विद्यार्थ्यांची एकूण संख्या ४६० असून ती शाखानिहाय संख्यांच्या बेरजेशी जुळते. Campus drive मधील विसंगती स्पष्ट झालेली नाही.',
  hi: 'मुख्य पेज की 2025–26 तालिका में शाखा-वार campus drives 56, 39, 54, 29, 43 और 36 हैं; इनका योग 257 है, जबकि पेज पर कुल 118 दिया है। चयनित विद्यार्थियों का कुल 460 है, जो शाखा-वार विद्यार्थियों की संख्या के योग से मेल खाता है। Campus drive की विसंगति अभी स्पष्ट नहीं है。',
}, q(['एकूण campus drives किती आहेत?', 'Campus drives ची बेरीज 118 का नाही?'], ['कुल campus drives कितनी हैं?', 'Campus drive के आँकड़ों में अंतर क्यों है?'], ['How many campus drives were there?', 'Why do branch campus drive counts not add up to the total?']), k(['campus drive', 'विसंगती', 'एकूण'], ['campus drive', 'अंतर', 'कुल'], ['campus drives', 'discrepancy', 'total']), { subcategory: 'data_quality', academicYear: '2025-26' });

add('placement_highest_package_2025_26', 'Highest package in displayed 2025–26 company list', {
  en: 'The highest package in the displayed 2025–26 company-selection list is ₹18.5 LPA from Consistent Consultants Engineers for one selection. The page says “And Many more,” so this is the highest in the displayed list, not necessarily a complete all-company or all-time record. It is not guaranteed to every student.',
  mr: 'दिसणाऱ्या २०२५–२६ कंपनी-निवड यादीतील सर्वाधिक package Consistent Consultants Engineers कडून एका निवडीसाठी ₹१८.५ LPA आहे. पेजवर “And Many more” असल्यामुळे हा दिसणाऱ्या यादीतील सर्वाधिक आकडा आहे; सर्व कंपन्या किंवा सर्व वर्षांचा पूर्ण विक्रम असेलच असे नाही. हा सर्व विद्यार्थ्यांना मिळणारा पगार नाही.',
  hi: 'दिखाई गई 2025–26 कंपनी चयन सूची में सबसे अधिक package Consistent Consultants Engineers का ₹18.5 LPA है, जो एक चयन के लिए दर्ज है। पेज पर “And Many more” लिखा है, इसलिए यह दिखाई गई सूची का अधिकतम है, सभी कंपनियों या सभी वर्षों का पूर्ण रिकॉर्ड होना आवश्यक नहीं। यह सभी विद्यार्थियों का वेतन नहीं है।',
}, q(['२०२५–२६ मध्ये highest package किती होते?', 'सर्वाधिक package कोणत्या कंपनीने दिले?'], ['2025–26 में सबसे अधिक package कितना था?', 'सबसे बड़ा package किस कंपनी का था?'], ['What is the highest package mentioned in the 2025–26 placement list?', 'What was the highest salary package?', 'Which company had the highest package?']), k(['highest package', 'सर्वाधिक पॅकेज', 'जास्त पगार', 'कंपनी'], ['highest package', 'सबसे अधिक पैकेज', 'कंपनी'], ['highest package', 'salary', 'LPA', 'Consistent Consultants Engineers']), { subcategory: 'package_statistics', academicYear: '2025-26', company: 'Consistent Consultants Engineers', package: '18.5 LPA' });

add('placement_average_package', 'Average package publication status', {
  en: 'The main published NKOCET placement information does not specify an overall average package. Contact the Training & Placement Cell at tpo@orchidengg.ac.in or +91 97671 07293 for a current verified figure.',
  mr: 'NKOCET च्या मुख्य प्रकाशित placement माहितीत एकूण average package दिलेला नाही. अद्ययावत पडताळलेल्या आकड्यासाठी Training & Placement Cell शी tpo@orchidengg.ac.in किंवा +91 97671 07293 वर संपर्क साधा.',
  hi: 'NKOCET की मुख्य प्रकाशित placement जानकारी में overall average package नहीं दिया गया है। वर्तमान सत्यापित आँकड़े के लिए Training & Placement Cell से tpo@orchidengg.ac.in या +91 97671 07293 पर संपर्क करें。',
}, q(['कॉलेजचा average package किती आहे?'], ['NKOCET का average package कितना है?'], ['What is the average package at NKOCET?', 'What is the average salary package?']), k(['average package', 'average salary', 'सरासरी पॅकेज'], ['average package', 'औसत पैकेज', 'औसत वेतन'], ['average package', 'average salary']), { subcategory: 'unpublished_information' });

add('placement_lpa_definition', 'LPA meaning', {
  en: 'LPA means Lakhs Per Annum: a lakh-rupee amount per year. A listed package is a published compensation figure and should not be read as guaranteed take-home pay.',
  mr: 'LPA म्हणजे Lakhs Per Annum—दरवर्षी लाख रुपयांतील package. प्रकाशित package म्हणजे compensation चा नमूद आकडा; तो हमखास हातात मिळणारा पगार समजू नये.',
  hi: 'LPA का अर्थ Lakhs Per Annum यानी प्रति वर्ष लाख रुपये है। प्रकाशित package compensation का आँकड़ा है; इसे सुनिश्चित take-home salary न समझें。',
}, q(['LPA म्हणजे काय?'], ['LPA का मतलब क्या होता है?'], ['What does LPA mean?', 'What is one LPA?']), k(['LPA', 'package'], ['LPA', 'package'], ['LPA', 'lakhs per annum', 'package']), { subcategory: 'package_definition' });

add('placement_package_variability', 'Package variability and guarantee', {
  en: 'No. The ₹18.5 LPA figure is one selection listed for Consistent Consultants Engineers in the displayed 2025–26 company list. Student packages vary by employer, role, and offer; do not infer that every selected student receives the highest package.',
  mr: 'नाही. ₹१८.५ LPA हा दिसणाऱ्या २०२५–२६ यादीत Consistent Consultants Engineers साठी एका निवडीचा आकडा आहे. कंपनी, भूमिका आणि offer नुसार package बदलतो; प्रत्येक विद्यार्थ्याला सर्वाधिक package मिळतो असे समजू नये.',
  hi: 'नहीं। ₹18.5 LPA दिखाई गई 2025–26 सूची में Consistent Consultants Engineers के एक चयन का आँकड़ा है। Package कंपनी, भूमिका और offer के अनुसार बदलता है; हर विद्यार्थी को सबसे अधिक package नहीं मिलता।',
}, q(['सर्व विद्यार्थ्यांना highest package मिळते का?', 'सगळ्यांना १८.५ LPA मिळतात का?'], ['क्या सभी विद्यार्थियों को highest package मिलता है?'], ['Do all students receive the highest package?']), k(['सर्वांना', 'package', 'highest'], ['सभी', 'package', 'highest'], ['all students', 'highest package', 'guarantee']), { subcategory: 'package_accuracy', academicYear: '2025-26' });

const offers = [
  ['Consistent Consultants Engineers',1,'18.5'],['Uptiq.ai',5,'6–10'],['Jaro',2,'9.56'],['Equifax',1,'9'],['TCS Digital',9,'7'],['Brillio',1,'6'],['Cyncly',1,'5'],['Enpro Industries Pvt. Ltd.',1,'5'],['KSB',1,'5'],['Consistent Consultants Engineers',1,'4.8'],['Persevex, Bangalore',22,'4.8'],['Coditas, Pune',1,'4.5'],['Webtech Developers, Pune',3,'4.3'],['K12 Techno Services, Bangalore',43,'3 / 4.5 / 6'],['Shelke Construction, Pune',5,'3.7'],['Infosys',2,'3.6'],['Consistent Consultants Engineers',16,'3.5'],['TCS Ninja',3,'3.5'],['S J Contract Pvt. Ltd., Pune',3,'3.29'],['Shriram Finance Limited',2,'3.04'],['Chougule Shipyard',9,'3'],['Enncon Synergies India Pvt. Ltd.',3,'3'],['InThink Technologies',1,'3'],['K-nest Construction Tech.',3,'3'],['LHP Solapur',2,'3'],['Manasvi Tech, Nashik',1,'3'],['PPS Pvt. Ltd., Pune',6,'3'],['Quench Chargers Pvt. Ltd.',1,'3'],['Saisiddha Sugar Equipment',6,'3'],['Saisiddha Engineering, Pune',1,'3'],['Softenger',2,'3'],['Virtual Building Studio, Gujarat',21,'3'],['Walchandnagar Industries Limited',3,'3'],['Bharat Forge',4,'2.4'],['DD Construction, Pune',2,'2.4'],['Dell Ortho, Pune',3,'2.4'],['LEI India',16,'2.4'],['QH-Talbros, Pune',20,'2.4'],['SEDEMAC',13,'2.4'],['ATOMBERG',21,'2.16'],
];
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const companyMap = new Map();
for (const [company, selected, packageLpa] of offers) {
  const key = slug(company);
  if (!companyMap.has(key)) companyMap.set(key, { name: company, offers: [] });
  companyMap.get(key).offers.push({ selectedStudents: selected, packageLpa });
}
for (const { name, offers: companyOffers } of companyMap.values()) {
  const enOffers = companyOffers.map(x => x.packageLpa + ' LPA (' + x.selectedStudents + ' selection' + (x.selectedStudents === 1 ? '' : 's') + ')').join('; ');
  const mrOffers = companyOffers.map(x => x.packageLpa + ' LPA (' + x.selectedStudents + ' निवडी)').join('; ');
  const hiOffers = companyOffers.map(x => x.packageLpa + ' LPA (' + x.selectedStudents + ' चयन)').join('; ');
  const offerQuestions = lang => lang === 'en'
    ? ['How many students did ' + name + ' select in 2025–26?', 'What package did ' + name + ' offer?', 'What is the ' + name + ' salary package?']
    : lang === 'mr'
      ? ['२०२५–२६ मध्ये ' + name + ' मध्ये किती निवड झाली?', name + ' चे package किती आहे?', name + ' किती LPA देते?']
      : ['2025–26 में ' + name + ' से कितने चयन हुए?', name + ' का package कितना है?', name + ' कितने LPA देता है?'];
  add('placement_company_' + slug(name).replace(/\s+/g, '_'), '2025–26 package and selections: ' + name, {
    en: 'The NKOCET 2025–26 published company list records ' + name + ': ' + enOffers + '. The list is partial (“And Many more”), and separate rows are preserved as published; package ranges or multiple figures are not a guarantee for each student.',
    mr: 'NKOCET च्या प्रकाशित २०२५–२६ कंपनी यादीत ' + name + ' साठी: ' + mrOffers + ' अशी नोंद आहे. यादी अपूर्ण (“And Many more”) आहे; स्वतंत्र नोंदी जशा प्रसिद्ध आहेत तशा ठेवल्या आहेत. Range किंवा अनेक package आकडे प्रत्येक विद्यार्थ्यासाठी हमी नाहीत.',
    hi: 'NKOCET की प्रकाशित 2025–26 कंपनी सूची में ' + name + ' के लिए: ' + hiOffers + ' दर्ज है। सूची आंशिक है (“And Many more”); अलग पंक्तियाँ प्रकाशित रूप में रखी गई हैं। Range या कई package आँकड़े हर विद्यार्थी की गारंटी नहीं हैं。',
  }, q(offerQuestions('mr'), offerQuestions('hi'), offerQuestions('en')), k(['placement','package','निवड','पगार',name], ['placement','package','चयन','वेतन',name], ['placement','package','salary','selected',name]), { subcategory: 'company_package', academicYear: '2025-26', company: name, package: companyOffers.map(x => x.packageLpa + ' LPA').join(' | ') });
}

const placementTeamRows = [
  ['Dean, Training & Placement','Dr. Ravindra R. Patil','tpo@orchidengg.ac.in','+91 97671 07293',null],
  ['Civil Placement Coordinator','Prof. R. G. Maske','tnp_civil@orchidengg.ac.in',null,'Civil'],
  ['CSE Placement Coordinator','Prof. S. D. Dudhanikar','tnp_cse@orchidengg.ac.in',null,'CSE'],
  ['AI & DS Placement Coordinator','Prof. N. B. Aherwadi','tnp_ai_ds@orchidengg.ac.in',null,'AI & DS'],
  ['Electrical Placement Coordinator','Prof. J. B. Patil','tnp_elec@orchidengg.ac.in',null,'Electrical'],
  ['E&TC Placement Coordinator','Prof. A. Chandanshive','tnp_entc@orchidengg.ac.in',null,'E&TC'],
  ['Mechanical Placement Coordinator','Prof. Y. B. Patil','tnp_mech@orchidengg.ac.in',null,'Mechanical'],
  ['Soft Skills Trainer','Dr. M. S. Shaikh','mumtajshaikh@orchidengg.ac.in',null,'all'],
  ['Soft Skills Trainer','Dr. U. K. Jadhav','umakantjadhav@orchidengg.ac.in',null,'all'],
  ['Aptitude Trainer','Prof. Ajit Ohol','ajitohol@orchidengg.ac.in',null,'all'],
];
for (const [role, name, email, phone, branch] of placementTeamRows) {
  if (role === 'Soft Skills Trainer') continue;
  const label = branch || 'Training & Placement';
  add('placement_team_' + slug(name).replace(/\s+/g, '_'), role + ': ' + name, {
    en: name + ' is listed on NKOCET’s official placement team page as ' + role + '. Email: ' + email + (phone ? '. Phone: ' + phone + '.' : '.'),
    mr: 'NKOCET च्या अधिकृत Placement Team पेजवर ' + name + ' यांची नोंद ' + role + ' म्हणून आहे. ईमेल: ' + email + (phone ? '. फोन: ' + phone + '.' : '.'),
    hi: 'NKOCET के आधिकारिक Placement Team पेज पर ' + name + ' का नाम ' + role + ' के रूप में है। ईमेल: ' + email + (phone ? '. फोन: ' + phone + '.' : '。'),
  }, q(
    [role === 'Aptitude Trainer' ? 'Placement साठी aptitude training कोण देतात?' : branch ? branch + ' Placement Coordinator कोण आहेत?' : 'TPO कोण आहेत?'],
    [role === 'Aptitude Trainer' ? 'Placement के लिए aptitude training कौन देते हैं?' : branch ? branch + ' Placement Coordinator कौन हैं?' : 'NKOCET के TPO कौन हैं?'],
    [role === 'Aptitude Trainer' ? 'Who is the placement aptitude trainer?' : branch ? 'Who is the ' + branch + ' Placement Coordinator?' : 'Who is the Dean of Training and Placement at NKOCET?', 'What is the email address for ' + name + '?'],
  ), k(['प्लेसमेंट','समन्वयक',label,name,email], ['प्लेसमेंट','समन्वयक',label,name,email], ['placement','coordinator','TPO',label,name,email]), { subcategory: 'placement_team', branch });
}
add('placement_team_contact_directory','Placement team contact directory', {
  en:'The official placement page lists these contacts: Dr. R. R. Patil, Dean–Training and Placement (rrpatil@orchidengg.ac.in); Prof. R. G. Maske, Civil (tnp_civil@orchidengg.ac.in); Prof. S. D. Dudhanikar, CSE (tnp_cse@orchidengg.ac.in); Prof. N. B. Aherwadi, AI & DS (tnp_aids@orchidengg.ac.in); Prof. J. B. Patil, Electrical (tnp_elec@orchidengg.ac.in); Prof. A. Chandanshive, E&TC (tnp_entc@orchidengg.ac.in); Prof. Y. B. Patil, Mechanical (tnp_mech@orchidengg.ac.in); Dr. M. S. Shaikh (mumtajshaikh@orchidengg.ac.in) and Dr. U. K. Jadhav (umakantjadhav@orchidengg.ac.in), soft-skills trainers; and Prof. Ajit Ohol, aptitude trainer (ajitohol@orchidengg.ac.in). Confirm current contacts on the official page.',
  mr:'अधिकृत placement पेजवरील संपर्क: Dr. R. R. Patil, Dean–Training and Placement (rrpatil@orchidengg.ac.in); Prof. R. G. Maske, Civil (tnp_civil@orchidengg.ac.in); Prof. S. D. Dudhanikar, CSE (tnp_cse@orchidengg.ac.in); Prof. N. B. Aherwadi, AI & DS (tnp_aids@orchidengg.ac.in); Prof. J. B. Patil, Electrical (tnp_elec@orchidengg.ac.in); Prof. A. Chandanshive, E&TC (tnp_entc@orchidengg.ac.in); Prof. Y. B. Patil, Mechanical (tnp_mech@orchidengg.ac.in); soft-skills trainers Dr. M. S. Shaikh (mumtajshaikh@orchidengg.ac.in) व Dr. U. K. Jadhav (umakantjadhav@orchidengg.ac.in); aptitude trainer Prof. Ajit Ohol (ajitohol@orchidengg.ac.in). सध्याचे संपर्क अधिकृत पेजवर तपासा.',
  hi:'आधिकारिक placement पेज पर संपर्क: Dr. R. R. Patil, Dean–Training and Placement (rrpatil@orchidengg.ac.in); Prof. R. G. Maske, Civil (tnp_civil@orchidengg.ac.in); Prof. S. D. Dudhanikar, CSE (tnp_cse@orchidengg.ac.in); Prof. N. B. Aherwadi, AI & DS (tnp_aids@orchidengg.ac.in); Prof. J. B. Patil, Electrical (tnp_elec@orchidengg.ac.in); Prof. A. Chandanshive, E&TC (tnp_entc@orchidengg.ac.in); Prof. Y. B. Patil, Mechanical (tnp_mech@orchidengg.ac.in); soft-skills trainers Dr. M. S. Shaikh (mumtajshaikh@orchidengg.ac.in) और Dr. U. K. Jadhav (umakantjadhav@orchidengg.ac.in); aptitude trainer Prof. Ajit Ohol (ajitohol@orchidengg.ac.in)। वर्तमान संपर्क आधिकारिक पेज पर जाँचें।',
}, q(['Placement Cell चे ईमेल काय आहे?','placement contact email काय आहे?'],['Placement Cell का email क्या है?','placement contact email क्या है?'],['What are the placement team email contacts?','What is the placement contact email?']), k(['placement','contact','email','ईमेल','संपर्क'],['placement','contact','email','ईमेल','संपर्क'],['placement','contact','email']), { subcategory:'placement_team' });
add('placement_soft_skills_trainers','Soft-skills trainer contacts', {
  en:'NKOCET’s official placement team lists Dr. M. S. Shaikh (mumtajshaikh@orchidengg.ac.in) and Dr. U. K. Jadhav (umakantjadhav@orchidengg.ac.in) as soft-skills trainers.',
  mr:'NKOCET च्या अधिकृत Placement Team मध्ये soft-skills trainers म्हणून Dr. M. S. Shaikh (mumtajshaikh@orchidengg.ac.in) आणि Dr. U. K. Jadhav (umakantjadhav@orchidengg.ac.in) यांची नोंद आहे.',
  hi:'NKOCET की आधिकारिक Placement Team में soft-skills trainers के रूप में Dr. M. S. Shaikh (mumtajshaikh@orchidengg.ac.in) और Dr. U. K. Jadhav (umakantjadhav@orchidengg.ac.in) सूचीबद्ध हैं।',
}, q(['Soft skills trainers कोण आहेत?','Soft skills training कोण देतात?'],['Soft skills trainers कौन हैं?','Soft skills training कौन देते हैं?'],['Who are NKOCET’s soft-skills trainers?','Who provides soft-skills training?']), k(['soft skills','trainer','प्रशिक्षक','प्रशिक्षण'],['soft skills','trainer','प्रशिक्षक','प्रशिक्षण'],['soft skills','trainer','training']), { subcategory:'placement_team' });

const training = [
  ['placement_training_framework','Placement training framework',
    'The official T&P framework includes daily soft-skills and aptitude sessions from Second Year onwards, programming skill enhancement, career guidance, resume building, mock group discussions and interviews, pre-placement workshops, company-specific training, internship support, expert talks, and skill-enhancement workshops. Schedules can change; confirm current batches with the T&P Cell.',
    'अधिकृत T&P framework मध्ये दुसऱ्या वर्षापासून रोजची soft-skills व aptitude सत्रे, programming skill enhancement, career guidance, resume building, mock group discussions व interviews, pre-placement workshops, company-specific training, internship support, expert talks आणि skill workshops नमूद आहेत. वेळापत्रक बदलू शकते; चालू माहितीसाठी T&P Cell कडे विचारा.',
    'आधिकारिक T&P framework में दूसरे वर्ष से daily soft-skills और aptitude सत्र, programming skill enhancement, career guidance, resume building, mock group discussions व interviews, pre-placement workshops, company-specific training, internship support, expert talks और skill workshops शामिल हैं। समय-सारणी बदल सकती है; वर्तमान जानकारी T&P Cell से लें।',
    ['Placement साठी कोणते training दिले जाते?','Resume आणि interview ची तयारी करतात का?','कॉलेज mock interview घेते का?','Group discussion practice आहे का?'],['Placement के लिए कौन-सी training मिलती है?','कॉलेज resume और interview तैयारी में मदद करता है?','क्या mock interview और group discussion होते हैं?'],['What training does NKOCET provide for placements?','Does the college conduct mock interviews?','Does the college conduct group discussion sessions?','Does the college help students prepare resumes?','Does the college organize company-specific training?']],
  ['placement_aptitude_training','Aptitude training',
    'NKOCET’s official page says aptitude training starts from the Second Year, with sessions each semester for all branches. Third-Year students receive special summer aptitude and soft-skills training; Fourth-Year students have mock tests for companies. The page says this may also help with GATE, CAT, MAT, PSU, MPSC, and UPSC preparation; exam results are not guaranteed.',
    'अधिकृत पेजनुसार aptitude training दुसऱ्या वर्षापासून सुरू होते आणि सर्व शाखांसाठी प्रत्येक semester मध्ये सत्रे होतात. तिसऱ्या वर्षात उन्हाळ्यात विशेष aptitude व soft-skills training, तर चौथ्या वर्षात कंपन्यांसाठी mock tests घेतले जातात. GATE, CAT, MAT, PSU, MPSC व UPSC तयारीलाही मदत होऊ शकते; निकालाची हमी नाही.',
    'आधिकारिक पेज के अनुसार aptitude training दूसरे वर्ष से शुरू होती है और सभी शाखाओं के लिए हर semester सत्र होते हैं। तीसरे वर्ष में गर्मी की छुट्टी में विशेष aptitude व soft-skills training और चौथे वर्ष में कंपनियों के लिए mock tests होते हैं। यह GATE, CAT, MAT, PSU, MPSC और UPSC की तैयारी में सहायक हो सकता है; परिणाम की गारंटी नहीं है।',
    ['Aptitude training कधीपासून सुरू होते?','दुसऱ्या वर्षात aptitude शिकवतात का?','Fourth year मध्ये कोणते placement tests असतात?'],['Aptitude training कब शुरू होती है?','क्या दूसरे वर्ष से aptitude sessions होते हैं?'],['From which year does aptitude training start?','When does placement aptitude training begin?','What training is provided in third and fourth year?']],
  ['placement_soft_skills','Soft-skills training',
    'The official placement page describes communication and English use, business correspondence, presentations, teamwork, leadership, time management, group discussions, interviews, interpersonal skills, cultural sensitivity, business etiquette, and listening/telephone/email etiquette. Dr. M. S. Shaikh and Dr. U. K. Jadhav are listed as soft-skills trainers.',
    'अधिकृत पेजवर communication व English वापर, business correspondence, presentation, teamwork, leadership, time management, group discussion, interview, interpersonal skills, cultural sensitivity, business etiquette आणि listening/telephone/email etiquette यांचा समावेश आहे. Soft-skills trainers म्हणून Dr. M. S. Shaikh आणि Dr. U. K. Jadhav यांची नोंद आहे.',
    'आधिकारिक पेज में communication व English उपयोग, business correspondence, presentation, teamwork, leadership, time management, group discussion, interview, interpersonal skills, cultural sensitivity, business etiquette और listening/telephone/email etiquette शामिल हैं। Soft-skills trainers के रूप में Dr. M. S. Shaikh और Dr. U. K. Jadhav सूचीबद्ध हैं。',
    ['Soft skills training मिळते का?','Soft skills मध्ये काय शिकवतात?'],['क्या soft skills training मिलती है?','Soft skills में क्या सिखाते हैं?'],['Does NKOCET provide soft skills training?','What is covered in soft-skills training?']],
  ['placement_ppw_1','Pre-Placement Workshop I',
    'PPW-I is scheduled after Third-Year Semester I for 10 days and focuses on aptitude training conducted by external agencies. The official framework describes student profiling and feedback during the workshops.',
    'PPW-I तिसऱ्या वर्षाच्या Semester I नंतर १० दिवसांची असते. त्यात external agencies कडून aptitude training दिले जाते. Workshop दरम्यान विद्यार्थ्यांचे profiling करून feedback दिला जातो.',
    'PPW-I तीसरे वर्ष Semester I के बाद 10 दिनों के लिए आयोजित होती है। इसमें external agencies द्वारा aptitude training दी जाती है। Workshop के दौरान विद्यार्थियों का profiling कर feedback दिया जाता है।',
    ['PPW-I म्हणजे काय?','PPW-I किती दिवस असते?','पहिली pre-placement workshop कधी होते?'],['PPW-I क्या है?','PPW-I कितने दिन की होती है?'],['What is Pre-Placement Workshop I?','How long is PPW-I?','When does PPW-I take place?']],
  ['placement_ppw_2','Pre-Placement Workshop II',
    'PPW-II is scheduled after Third-Year Semester II for 20 days: 10 days of in-house soft-skills and aptitude training, followed by 10 days of technical training through an external agency. Student performance is profiled and feedback is provided.',
    'PPW-II तिसऱ्या वर्षाच्या Semester II नंतर २० दिवसांची असते: पहिले १० दिवस in-house soft-skills व aptitude training आणि पुढील १० दिवस external agency कडून technical training. कामगिरीचे profiling करून feedback दिले जाते.',
    'PPW-II तीसरे वर्ष Semester II के बाद 20 दिनों की होती है: पहले 10 दिन in-house soft-skills और aptitude training, फिर 10 दिन external agency द्वारा technical training। विद्यार्थियों का प्रदर्शन देखकर feedback दिया जाता है।',
    ['PPW-II किती दिवस असते?','PPW-II मध्ये कोणते training असते?'],['PPW-II कितने दिन की होती है?','PPW-II में कौन-सी training होती है?'],['What is Pre-Placement Workshop II?','How long is PPW-II?','What activities are included in PPW-II?']],
  ['placement_technical_training','Technical and technology-specific training',
    'NKOCET describes programming skill enhancement, technical training, and company-specific preparation. Its placement page reports past third-party 20-day Java, Python, AI & ML training and says technology-specific training is arranged in June/July for students entering Final Year. Current course availability is year-specific; confirm it with the department.',
    'NKOCET च्या पेजवर programming skill enhancement, technical training आणि company-specific तयारी नमूद आहे. पूर्वी third-party मार्फत २० दिवसांचे Java, Python, AI & ML training झाले असल्याचे आणि Final Year मध्ये जाणाऱ्या विद्यार्थ्यांसाठी June/July मध्ये technology-specific training आयोजित होत असल्याचे पेज सांगते. सध्याचे courses विभागाकडून तपासा.',
    'NKOCET के पेज पर programming skill enhancement, technical training और company-specific तैयारी का उल्लेख है। पेज के अनुसार पहले third-party द्वारा 20-दिन का Java, Python, AI & ML training हुआ और Final Year में जाने वाले विद्यार्थियों के लिए June/July में technology-specific training होती है। वर्तमान courses विभाग से जाँचें।',
    ['Technical training कोणते मिळते?','Java किंवा Python training असते का?','AI ML training दिले जाते का?'],['कौन-सी technical training मिलती है?','क्या Java या Python training होती है?'],['Is Java or Python training available?','Does NKOCET provide AI and ML training?','When is technology-specific training held?']],
  ['placement_internship_support','Internship support and limitations',
    'Internship support is included in NKOCET’s placement preparation framework. The general T&P page does not publish a universal stipend, duration, or internship-to-job guarantee. Check current openings and conditions with your branch placement coordinator or T&P Cell.',
    'Internship support हा NKOCET च्या placement framework मध्ये आहे. सर्वसाधारण T&P पेजवर एकच stipend, कालावधी किंवा internship नंतर नोकरीची हमी दिलेली नाही. चालू संधी व अटींसाठी शाखेच्या placement coordinator किंवा T&P Cell शी संपर्क करा.',
    'Internship support NKOCET के placement framework में शामिल है। सामान्य T&P पेज पर कोई सार्वभौमिक stipend, अवधि या internship के बाद नौकरी की गारंटी प्रकाशित नहीं है। वर्तमान अवसरों और शर्तों के लिए branch coordinator या T&P Cell से संपर्क करें。',
    ['कॉलेज internship साठी मदत करते का?','Paid internship मिळते का?','Internship नंतर job मिळतो का?'],['क्या कॉलेज internship में सहायता करता है?','क्या paid internship मिलती है?'],['Does NKOCET support internships?','Are paid internships available?','Does an internship guarantee a job?','How can students find internship opportunities?']],
  ['placement_eligibility_rules','Company-specific eligibility',
    'NKOCET’s general placement information does not publish one universal CGPA or active-backlog rule for all recruiters. Eligibility varies by company and role. Check each company’s official campus-drive notice; the college does not promise every student qualifies for every drive.',
    'सर्व कंपन्यांसाठी एकच CGPA किंवा active backlog नियम NKOCET च्या सर्वसाधारण माहितीत दिलेला नाही. पात्रता कंपनी व पदानुसार बदलते. प्रत्येक drive ची अधिकृत अट तपासा; प्रत्येक विद्यार्थ्याला प्रत्येक drive साठी पात्रतेची हमी नाही.',
    'NKOCET की सामान्य placement जानकारी में सभी कंपनियों के लिए एक समान CGPA या active backlog नियम प्रकाशित नहीं है। पात्रता कंपनी और पद के अनुसार बदलती है। हर drive की आधिकारिक शर्त देखें; हर विद्यार्थी के योग्य होने की गारंटी नहीं है।',
    ['Placement साठी किती CGPA लागतो?','Active backlog असेल तर placement ला बसता येते का?','सर्व branch students placement मध्ये भाग घेऊ शकतात का?'],['Placement के लिए कितना CGPA चाहिए?','Active backlog के साथ placement में बैठ सकते हैं?'],['What CGPA is required for campus placements?','Can students with active backlogs participate in placements?','Can students from all engineering branches participate?']],
  ['placement_career_tracks','Mission EQ career tracks',
    'Mission EQ is NKOCET’s initiative to improve employability through institute- and department-level courses. The official page lists three career tracks: Entrepreneurship, Employment, and Overseas Higher Studies. Courses include career planning, resume building, interview preparation, leadership, and business communication.',
    'Mission EQ हा employability वाढवण्यासाठीचा NKOCET उपक्रम आहे. अधिकृत पेजवर तीन career tracks दिले आहेत: Entrepreneurship, Employment आणि Overseas Higher Studies. यात career planning, resume building, interview preparation, leadership आणि business communication courses आहेत.',
    'Mission EQ employability बढ़ाने की NKOCET पहल है। आधिकारिक पेज पर तीन career tracks हैं: Entrepreneurship, Employment और Overseas Higher Studies। Courses में career planning, resume building, interview preparation, leadership और business communication शामिल हैं।',
    ['Mission EQ म्हणजे काय?','Mission EQ मध्ये किती career tracks आहेत?','Overseas Higher Studies track काय आहे?'],['Mission EQ क्या है?','Mission EQ के तीन career tracks कौन से हैं?'],['What is Mission EQ at NKOCET?','What are the three career tracks of Mission EQ?','What is the Entrepreneurship track?','What is the Employment track?','What is the Overseas Higher Studies track?']],
  ['placement_industry_programs','Industry collaboration programs',
    'The official placement page names the TATA Technologies Distance Ready Engineer program and Zensar Technologies Employability Skill Development (ESD) program. It also lists industry expert talks and cross-department skill-enhancement workshops. The page does not say every student currently participates.',
    'अधिकृत placement पेजवर TATA Technologies चा Distance Ready Engineer program आणि Zensar Technologies चा Employability Skill Development (ESD) program नमूद आहे. Industry expert talks आणि विभागांतील skill-enhancement workshops देखील आहेत. प्रत्येक विद्यार्थी सध्या सहभागी आहे असे पेज सांगत नाही.',
    'आधिकारिक placement पेज पर TATA Technologies का Distance Ready Engineer program और Zensar Technologies का Employability Skill Development (ESD) program दिया है। Industry expert talks और skill-enhancement workshops भी हैं। हर विद्यार्थी वर्तमान में इनमें शामिल है, ऐसा पेज नहीं कहता。',
    ['TATA Technologies चा program आहे का?','Zensar Technologies training देते का?','Industry experts चे talks होतात का?'],['क्या TATA Technologies का program है?','क्या Zensar Technologies training देता है?'],['Does NKOCET have a TATA Technologies training program?','Does NKOCET have a Zensar Technologies program?','Does the college organize industry expert sessions?']],
];
for (const [id, topic, en, mr, hi, mrQ, hiQ, enQ] of training) {
  add(id, topic, { en, mr, hi }, q(mrQ, hiQ, enQ), k(['training','प्लेसमेंट','प्रशिक्षण',topic],['training','प्लेसमेंट','प्रशिक्षण',topic],['training','placement',topic]), { subcategory: id.includes('internship') ? 'internships' : id.includes('eligibility') ? 'eligibility' : id.includes('career') ? 'career_tracks' : 'training' });
}

add('placement_programming_languages','Programming-language preparation guidance', {
  en:'The official page mentions programming skill enhancement but does not prescribe one required language for every company. C, C++, Java, and Python can be useful preparation topics; choose based on your branch and target role and confirm current courses with your department.',
  mr:'अधिकृत पेजवर programming skill enhancement नमूद आहे; प्रत्येक कंपनीसाठी एकच आवश्यक भाषा दिलेली नाही. C, C++, Java आणि Python तयारीसाठी उपयोगी विषय असू शकतात. शाखा व लक्ष्य पदानुसार निवडा आणि चालू courses विभागाकडून तपासा.',
  hi:'आधिकारिक पेज पर programming skill enhancement का उल्लेख है; हर कंपनी के लिए एक अनिवार्य भाषा नहीं दी गई। C, C++, Java और Python तैयारी के उपयोगी विषय हो सकते हैं। Branch और लक्ष्य पद के अनुसार चुनें और वर्तमान courses विभाग से जाँचें।',
}, q(['Placement साठी कोणती programming language शिकावी?','कोणती coding language नोकरीसाठी उपयुक्त आहे?'],['Placement के लिए कौन-सी programming language सीखें?'],['Which programming languages should students learn for placements?','Should I learn Java or Python for placement?']), k(['programming','coding','C','C++','Java','Python'],['programming','coding','Java','Python'],['programming','coding','C','C++','Java','Python']), { subcategory:'career_preparation' });

add('placement_tcs_digital_vs_ninja','TCS Digital and TCS Ninja package comparison', {
  en:'The displayed 2025–26 company list shows TCS Digital: 9 selections at ₹7 LPA, and TCS Ninja: 3 selections at ₹3.5 LPA. These are separate listed offers; they are not guaranteed packages for future drives.',
  mr:'दिसणाऱ्या २०२५–२६ कंपनी यादीत TCS Digital साठी ९ निवडी व ₹७ LPA, तर TCS Ninja साठी ३ निवडी व ₹३.५ LPA नमूद आहेत. या स्वतंत्र नोंदी आहेत; भविष्यातील drive साठी package ची हमी नाही.',
  hi:'दिखाई गई 2025–26 कंपनी सूची में TCS Digital के लिए 9 चयन और ₹7 LPA, जबकि TCS Ninja के लिए 3 चयन और ₹3.5 LPA दर्ज हैं। ये अलग-अलग offer पंक्तियाँ हैं; भविष्य की drive के package की गारंटी नहीं।',
}, q(['TCS Digital आणि TCS Ninja मध्ये काय फरक आहे?','TCS Digital व Ninja चे package किती?'],['TCS Digital और TCS Ninja में क्या अंतर है?','TCS Digital और Ninja का package कितना है?'],['What is the difference between TCS Digital and TCS Ninja?','What are the TCS Digital and TCS Ninja packages?']), k(['TCS','Digital','Ninja','package','पॅकेज'],['TCS','Digital','Ninja','package'],['TCS','Digital','Ninja','package','LPA']), { subcategory:'company_package', academicYear:'2025-26', company:'TCS Digital; TCS Ninja' });

add('placement_company_examples','Examples of companies in the published placement list', {
  en:'Examples shown in NKOCET’s 2025–26 placement list include TCS Digital, TCS Ninja, Infosys, Uptiq.ai, Jaro, Equifax, Brillio, Cyncly, KSB, Coditas, Persevex, Bharat Forge, ATOMBERG, SEDEMAC, Walchandnagar Industries, and Shriram Finance. The official page says “And Many more,” so this is not a complete list.',
  mr:'NKOCET च्या दिसणाऱ्या २०२५–२६ placement यादीतील उदाहरणे: TCS Digital, TCS Ninja, Infosys, Uptiq.ai, Jaro, Equifax, Brillio, Cyncly, KSB, Coditas, Persevex, Bharat Forge, ATOMBERG, SEDEMAC, Walchandnagar Industries आणि Shriram Finance. अधिकृत पेजवर “And Many more” असल्यामुळे ही पूर्ण यादी नाही.',
  hi:'NKOCET की दिखाई गई 2025–26 placement सूची के उदाहरण हैं: TCS Digital, TCS Ninja, Infosys, Uptiq.ai, Jaro, Equifax, Brillio, Cyncly, KSB, Coditas, Persevex, Bharat Forge, ATOMBERG, SEDEMAC, Walchandnagar Industries और Shriram Finance। आधिकारिक पेज पर “And Many more” लिखा है, इसलिए यह पूरी सूची नहीं है।',
}, q(['Placement मध्ये कोणत्या कंपन्या येतात?','Recruiters ची काही नावे सांगा.'],['Placement में कौन-सी कंपनियाँ आती हैं?','Recruiters के कुछ नाम बताइए।'],['Name some companies in the placement list.']), k(['कंपनी','recruiter','नोकरी'],['कंपनी','recruiter','नौकरी'],['companies','recruiters','company list']), { subcategory:'recruiters', academicYear:'2025-26' });

add('placement_cse_company_breakdown_unpublished','CSE company-wise placement breakdown publication status', {
  en:'The current main 2025–26 T&P table reports 144 selected CSE students. The reviewed current CSE department page does not publish a matching 2025–26 company-by-company breakdown, so verified firm-level counts are unavailable here. Do not assume a partial department list represents all 144 students.',
  mr:'२०२५–२६ च्या मुख्य T&P तक्त्यात CSE मधून १४४ निवडी नोंदल्या आहेत. तपासलेल्या सध्याच्या CSE विभाग पेजवर याच वर्षाची कंपनीनिहाय यादी नाही; त्यामुळे पडताळलेली कंपनीनिहाय संख्या उपलब्ध नाही. अपूर्ण यादी १४४ सर्व विद्यार्थ्यांचे प्रतिनिधित्व करते असे समजू नये.',
  hi:'मुख्य 2025–26 T&P तालिका में CSE से 144 चयन दर्ज हैं। देखे गए वर्तमान CSE विभागीय पेज पर इसी वर्ष की कंपनी-वार सूची नहीं है; इसलिए सत्यापित कंपनी-वार संख्या उपलब्ध नहीं है। किसी आंशिक सूची को सभी 144 विद्यार्थियों का विवरण न मानें।',
}, q(['CSE मधून कोणत्या कंपन्यांत किती निवड झाली?','CSE ची company-wise list आहे का?'],['CSE से किन कंपनियों में कितने चयन हुए?','क्या CSE की company-wise सूची है?'],['Which companies selected CSE students in 2025–26?','Does the CSE page publish a company-wise placement list?']), k(['CSE','company wise','कंपनीनिहाय','विभाग'],['CSE','company wise','कंपनी-वार','विभाग'],['CSE','company-wise','breakdown','companies']), { subcategory:'department_statistics', academicYear:'2025-26', branch:'CSE', source:'https://orchidengg.ac.in/computer-science-and-engineering/' });

const eandtc = [['Profound Edutech',2],['Quality Kiosk',1],['LEI India',1],['Pentagon Space',1],['Tau Power Electronics',1],['L.G. Balakrishnan & Bros Ltd',1],['Naharas Engineering Pvt. Ltd.',1],['Unique Measurements',10],['Qspider',1],['iTpreneur',2],['Kiran Academy',3],['Bajaj Symbiosis',14],['I4C',46]];
add('placement_entc_2024_25','E&TC placements in 2024–25', {
  en:'The E&TC department page lists 2024–25 selections: ' + eandtc.map(x => x[0] + ' (' + x[1] + ')').join('; ') + '. Its published total is 84. This is historical E&TC department data, not the college-wide 2025–26 figure.',
  mr:'E&TC विभागाच्या पेजवर २०२४–२५ निवडी: ' + eandtc.map(x => x[0] + ' (' + x[1] + ')').join('; ') + '. पेजवरील एकूण ८४ आहे. ही ऐतिहासिक E&TC विभागाची माहिती आहे; संपूर्ण कॉलेजच्या २०२५–२६ आकड्याशी मिसळू नये.',
  hi:'E&TC विभागीय पेज पर 2024–25 चयन: ' + eandtc.map(x => x[0] + ' (' + x[1] + ')').join('; ') + '. प्रकाशित कुल 84 है। यह पिछला E&TC विभागीय आँकड़ा है, कॉलेज के 2025–26 कुल आँकड़े से अलग है।',
}, q(['२०२४–२५ मध्ये E&TC मधून किती विद्यार्थी प्लेस झाले?','E&TC च्या २०२४–२५ कंपन्या कोणत्या?'],['2024–25 में E&TC से कितने विद्यार्थी प्लेस हुए?','E&TC की 2024–25 कंपनियाँ कौन-सी थीं?'],['How many E&TC students were placed in 2024–25?','Which companies recruited from E&TC in 2024–25?']), k(['E&TC','कंपनी','निवड','२०२४–२५'],['E&TC','कंपनी','चयन','2024–25'],['E&TC','2024-25','historical','selected','companies']), { subcategory:'department_historical_statistics', academicYear:'2024-25', branch:'E&TC', source:etcPage });
records.at(-1).placements = eandtc.map(([company, selectedStudents]) => ({ company, selectedStudents }));
records.at(-1).publishedTotal = 84;

const placementData = {
  schemaVersion: 1,
  institution: 'Nagesh Karajagi Orchid College of Engineering & Technology (NKOCET), Solapur',
  verifiedDate: verified,
  mainSource: main,
  legacySource: old,
  companyOffers: offers.map(([company, selectedStudents, packageLpa], i) => ({ row:i+1, academicYear:'2025-26', company, selectedStudents, packageLpa, unit:'LPA', source:main, verifiedDate:verified })),
  companies: [...companyMap.values()].map(({ name, offers: companyOffers }) => ({ name, offers:companyOffers.map(x => ({ ...x, academicYear:'2025-26', unit:'LPA', source:main, verifiedDate:verified })) })),
  placementHistory: history.map(([academicYear, studentsSelected]) => ({ academicYear, studentsSelected, source:main, verifiedDate:verified, ...(academicYear === '2022-23' ? { conflict:{ otherOfficialValue:407, source:old, status:'unresolved; current main page reports 421' } } : {}) })),
  branchStatistics: branches.map(([id, branch, short, studentsSelected], i) => ({ branch, short, academicYear:'2025-26', studentsSelected, campusDrives:[56,39,54,29,43,36][i], source:main, verifiedDate:verified })),
  placementTeam: placementTeamRows.map(([role,name,email,phone,branch]) => ({ role,name,email,phone:phone||null,branch:branch==='all'?null:branch,source:main,verifiedDate:verified })),
  entries: records,
  dataQuality: [
    { id:'campus_drive_total', issue:'Branch campus-drive figures sum to 257, but the current page displays total 118.', publishedTotal:118, branchSum:257, status:'unresolved; preserve both as published', source:main },
    { id:'placements_2022_23', issue:'Current main page reports 421 students; legacy official page reports 407.', currentValue:421, legacyValue:407, status:'unresolved; disclose conflict and prefer current main page', sources:[main,old] },
    { id:'company_list_partial', issue:'The current company/package table ends with “And Many more”; displayed rows are not the complete recruiter list.', displayedRows:40, status:'partial', source:main },
    { id:'cse_firm_breakdown', issue:'The reviewed current CSE page did not publish a matching 2025–26 company-by-company breakdown.', status:'not published on reviewed page', source:'https://orchidengg.ac.in/computer-science-and-engineering/' },
    { id:'average_package', issue:'Overall average package is not explicitly published on the reviewed T&P page.', status:'not published', source:main },
  ],
};
await writeFile(new URL('./placement-data.json', import.meta.url), JSON.stringify(placementData, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ entries:records.length, companies:companyMap.size, offerRows:offers.length, questions:Object.fromEntries(['mr','hi','en'].map(lang => [lang, records.reduce((n,r) => n+r.localized[lang].questions.length,0)])) }));
