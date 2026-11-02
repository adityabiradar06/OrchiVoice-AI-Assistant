# NKOCET website reconnaissance

Reference inspected: [orchidengg.ac.in](https://orchidengg.ac.in/) on 31 October 2026. This is a reconnaissance record only; no implementation code has been written.

## Coverage and limits

- Inspected the homepage from header through footer at a 700 × 780-ish narrow browser viewport, including multiple scroll positions, the navigation overlay, the About submenu, the enquiry popup, and the changing homepage modules.
- Followed the leaf links visible in the primary navigation, including all six department pages, informational pages, and linked PDFs. Also opened the homepage notice/news/event destinations, the footer photo gallery and Study Abroad alias, the tender notice, and the two ticker-linked international stories.
- Inspected the photo gallery album selector by switching from “79th Independence Day Celebration” to “Women’s Day 2025”; the album changed and loaded a larger set of images.
- The public page set is large and dynamic. News, notices, and gallery controls can expose further records/assets on demand; the report inventories the public navigation and the homepage-linked content reviewed, not every historic post or every file linked from every long disclosure page.
- A desktop-width viewport was not available in the inspected browser surface, and the site’s CSS/font files were not exposed by the rendered accessibility view. Exact desktop breakpoints, font-family names, computed dimensions, and color hex values therefore remain to be verified before implementation. Do not treat visual estimates below as source CSS values.
- The text extraction service reported cache misses for several image URLs, but the site itself rendered the homepage and gallery assets in the browser. Those are extraction limitations, not evidence that the assets are missing from the origin.

## Homepage walkthrough

1. **Header / identity** — Orchid emblem at left, society and college name centered, autonomous/approval/affiliation/NAAC accreditation text, search field, and primary navigation. On the narrow layout, navigation becomes a black rounded hamburger control.
2. **Announcements / Notices ticker** — black label at left followed by a horizontally moving, rose-red list of linked announcements separated by vertical bars. The ticker repeats the sequence for a continuous loop. Current observed items include an EV/autonomous mobility FDP PDF, tender PDF, 4IASE/SUPMECA story, examination JPEG, Study Abroad story, and AICTE scholarship link.
3. **Campus hero** — large rounded campus photographs in a rotating/stacked hero presentation; visually observed a yellow/orange college building, the entrance gate, and a broad lawn/building view. A YouTube campus tour is embedded in the introductory region.
4. **College overview** — heading, institutional summary, black “Discover More” pill button, and a 360° Tour link to Webobook.
5. **Notices** — featured notice cards, dated updates, “All Notices” button. Homepage cards repeat/rotate in a vertical list on the narrow screen.
6. **Our Departments** — six photo cards (Civil, Computer Science, E&TC, Electrical, Mechanical, AI & Data Science), dark photo overlay, centered white department label, circular arrow link. Stacked one per row in the narrow view.
7. **News & Updates** — image-and-title story list in a scrollable/rotating panel, with “All News” and “Event Calendar” buttons.
8. **Placements** — heading and supporting line above an auto-advancing carousel of eight recruiter marks.
9. **The Foundation of Our Excellence** — Vision, Mission, and Core Values in light-gray/white cards with dark circular icons and a “Read More” link.
10. **Alumni Speaks** — dark panel with testimonial card, five-star row, alumni name/role, and ten pagination dots/slides.
11. **Footer** — callback form; office hours; Quick Links; For Students; contact details; social links; copyright/developer/content credits. At narrow width, footer groups stack vertically.
12. **Fixed controls** — yellow circular email/enquiry button opens a form popup; a floating Chaty “Contact us”/bell control with phone, WhatsApp, LinkedIn, Instagram, and X/Twitter channels; fixed NAAC badge; scroll-to-top button appears after scrolling.

## Interaction inventory

- Header hamburger opens a left-side overlay; X closes it. Parent entries with chevrons expand nested menus. On narrow layout the menu takes roughly half the viewport width and has its own scroll area.
- Primary menu parents About, Accreditations, Academics, Campus Life, and Facilities are category/accordion entries with `#` targets; their leaf items navigate to pages or files. Nested children were visible when opened.
- Homepage announcements move horizontally and retain clickable destinations. Notice/news content changes or rotates while scrolling; the eight-item recruiter carousel auto-advances; the alumni component has ten selectable pagination buttons.
- Department cards navigate using the arrow affordance. The overview has Discover More and an external 360° Tour.
- The fixed email control opens a white popup over the page. It contains Name, Email, Phone Number, State, City, Course dropdown (AI & DS, Civil, CSE, E&TC, Electrical, Mechanical), and Submit. The form was inspected but not submitted.
- Footer Request a Call Back contains three fields and Submit. The separate global Enquiry form shown on content pages exposes more fields and a course selector. Neither form was submitted.
- Photo Gallery has a native album selector with many named albums (at least 35 options observed) and swaps its image collection on selection. The selected Women's Day album loaded dozens of image links.
- Examination Cell includes course/year selectors and Download/View controls for timetables/results, plus document links. Admissions has in-page section navigation for undergraduate/postgraduate/fees/contact.
- YouTube player is embedded, with ordinary player controls and related video links. The embedded campus tour observed in the DOM uses video ID `F-IujllQ3sI`.

## Visual system observations

- **Colors:** white page background; near-black navigation buttons, labels, and testimonial panel; medium gray body copy; restrained muted rose/red accent for selected heading words and announcement text; yellow/gold floating contact controls and accreditation badge. Photo cards use dark overlays for readable white labels.
- **Typography:** rendered type is predominantly sans-serif. Some emphasized heading words use a contrasting italic serif treatment. The college masthead includes a script/italic wordmark treatment. Exact font families and weights were not discoverable from the rendered inspection surface.
- **Shapes and spacing:** generous white space between homepage sections; large rounded photo frames/cards; black pill-shaped primary CTAs; circular arrow/icon buttons; subtle light-gray card surfaces and borders. Narrow-page content is inset by about 20 px in the observed viewport, and hero/department media spans nearly the full content width.
- **Narrow responsive behavior (observed at ~700 px):** header identity compresses; primary nav is hidden behind the hamburger overlay; overlay supports independent scrolling and accordion submenus; campus and department media become full-width vertical stacks; content cards and footer groups stack; floating controls stay fixed at viewport edges. Only this narrow-width behavior was directly checked.
- Exact CSS values (font sizes, spacing scale, breakpoints, desktop container width, colors as hex) still require stylesheet or desktop-width verification; no precise values are invented here.

## Sitemap: primary navigation

All paths below are on `https://orchidengg.ac.in/`. Group labels in parentheses are menu parents, not separate pages.

- **Home:** `/`
- **About:** `/overview-of-nkocet/`; `/about-pnes/`; `/vision-mission-and-core-values/`; `/principals-message/`; `/organizational-structure/`
- **Accreditations, Affiliations and Mandatory Public Disclosure:** `/accreditations-affiliations-and-mandatory-public-disclosures/`; `/statuary-committees/`; `/public-self-disclosure/`; Mandatory Disclosure PDF (`/wp-content/uploads/2026/03/Office/MANDATORY%20DISCLOSURE_2025.pdf`); NIRF PDFs (`/wp-content/uploads/2026/04/NIRF-2026_Engineering-Submitted-Data_compressed.pdf`, `/wp-content/uploads/2026/04/NIRF-2026_Overall-Submitted-Data_compressed.pdf`)
- **Other institutional pages:** `/orchid-insights/`; `/admissions/`; `/elementor-12307/` (Guidance Regarding Admission Process); `/fee-structure/`; `/naac/`; `/iqac/`
- **Research & Development:** `/research-development/`; `/rd-cell-team/`; `/research-projects/`; `/publications/`; `/collaborations-mous/`; `/institute-innovation-cell-iic/`; `/entrepreneurship-cell/`; `/major-indian-funding-agencies-for-engineering-research/`
- **Training & Placements:** `/training-placement/`
- **Academics / departments:** `/artificial-intelligence-data-science/`; `/civil-engineering/`; `/computer-science-and-engineering/`; `/etc/`; `/electrical-engineering/`; `/mechanical-engineering/`; `/general-engineering/`
- **Academics / reference files:** `/wp-content/uploads/2025/10/AI%26DS/ODD%20SEM%20Academic%20Calender%202025-26.pdf`; `/wp-content/uploads/2025/04/AICTE-Recommended-Books_compressed.pdf`
- **Examination Cell:** `/examination-cell/`; files `/wp-content/uploads/2025/05/Ordinance.pdf`, `/wp-content/uploads/2025/05/Exam-Conduct.pdf`, `/wp-content/uploads/2025/05/Grievance-Redressal.pdf`. The menu also shows “Policy Manual June 2023” as a category-style `#` link, not a separate route in the inspected menu.
- **Study Abroad Cell:** `/study-abroad-cell-foreign-university-tie-ups/`
- **Campus Life:** `/smart-india-hackathon-and-avishkar-reports/`; `/hostel/`; `/canteen/`; `/campus-safety/`; `/sports-activities/`; `/library/`
- **Facilities:** `/administrative-office/`; `/classroom-and-more/`; `/computer-center/`; `/health-wellness/`; `/transportation-facility/`; `/sports-ground-gymnasium/`
- **Contact:** `/contact-us/`

## Sitemap: homepage and footer destinations

- **Notices:** `/notices/`; `/circular/`; `/admissions-2025-26/` (Tender Document); `/tender-notice-for-lift-installation/`.
- **News archive and events:** `/news-updates/`; `/events/`.
- **Homepage story pages:** `/nkocet-appointments/`; `/serentica-renewables/`; `/orchid-engineering-college-felicitates-mpsc-achievers/`; `/mechanical-engineering-student-activities/`; `/electrical-engineering-students-cracked-the-gate-2025/`; `/dr-r-r-patil-receives-state-level-award/`; `/cultural-festival/`; `/civil-engineering-students-cracked-the-gate-2025/`; `/direct-second-year-diploma-connect-program/`; `/signed-a-memorandum-of-understanding-mou-with-liqsure-systems-pvt-ltd/`.
- **Ticker-linked pages:** `/4iase-supmeca-india-french-students/`; `/study-abroad-cell-from-orchid-to-global-opportunities/`.
- **Footer pages/aliases:** `/photo-gallery/` (album gallery); `/study-abroad/` (second Study Abroad page/alias). The public-self-disclosure page is listed above.
- **External destinations (not internal pages):** Webobook tour `https://webobook.com/public/664a1cd631cff43b0f603d82,en`; YouTube campus tour ID `F-IujllQ3sI`; AICTE, MHT-CET, DTE, campus logins, Google Forms, social profiles, and occasional Google Drive / government-hosted admission files.

## Asset inventory (original URLs / location)

Asset paths are relative to `https://orchidengg.ac.in/` unless an external host is shown.

| Location / role | Original asset URL(s) observed |
|---|---|
| Header identity emblem | `/wp-content/uploads/2025/02/TOS_Logo-996x1024.webp` |
| Fixed NAAC badge | `/wp-content/uploads/2025/04/naac.webp` |
| Homepage announcement links | `/wp-content/uploads/2026/06/Final%20FDP%20EE.pdf`; `/wp-content/uploads/2026/06/Tender%20details_v1.2.pdf`; `/wp-content/uploads/2026/03/EXAM/Regular%20Summer%20Semester%20Examination%20-%202026.jpeg` |
| Homepage notice thumbnails | `/wp-content/uploads/2026/01/Circular-for-Change-of-Branch-After-First-Year-150x150.jpg`; `/wp-content/uploads/2026/06/8-x-9-Orchid-Tender-Notice_Sakal-12062026.jpg-150x150.jpeg` |
| Homepage story thumbnails | `/wp-content/uploads/2025/06/8-x-14-Orchid_Appointment-17042026-150x150.jpg`; `/wp-content/uploads/2025/06/Serentica-Renewables-150x150.jpeg`; `/wp-content/uploads/2025/06/Orchid-Engineering-College-Felicitates-MPSC-Achievers-150x150.jpeg`; `/wp-content/uploads/2025/06/Mechanical-Engineering-Student-Activities-150x150.jpeg`; `/wp-content/uploads/2025/06/Electrical-Engineering-Students-Cracked-the-Gate-2025-150x150.jpeg`; `/wp-content/uploads/2025/06/Dr.-R.R.-Patil-Receives-State-Level-Award-150x150.jpeg`; `/wp-content/uploads/2025/06/Cultural-Festival-150x150.jpeg`; `/wp-content/uploads/2025/06/Civil-Engineering-Students-Cracked-the-Gate-2025-150x150.jpeg`; `/wp-content/uploads/2025/06/Direct-Second-Year-Diploma-Connect-150x150.jpeg`; `/wp-content/uploads/2025/06/Signed-a-Memorandum-of-Understanding-MoU-with-Liqsure-Systems-Pvt-Ltd-150x150.jpeg` |
| Placement logo carousel (8 items) | `/wp-content/uploads/2025/02/hp-logo2.webp`; `/wp-content/uploads/2025/02/igate.webp`; `/wp-content/uploads/2025/02/triveni.webp`; `/wp-content/uploads/2025/02/webonise_lab.webp`; `/wp-content/uploads/2025/02/zensar.webp`; `/wp-content/uploads/2025/02/bosch_logo_english.webp`; `/wp-content/uploads/2025/02/faurecia.webp`; `/wp-content/uploads/2025/02/hitachi-logo.webp` |
| Alumni carousel portraits | `/wp-content/uploads/2025/04/IMG-20200511-WA0001-200x200-1.jpg`; `/wp-content/uploads/2025/04/IMG-20200511-WA0008-200x200-1.jpg`; `/wp-content/uploads/2025/04/IMG-20200515-WA0013-200x200-1.jpg`; `/wp-content/uploads/2025/04/IMG-20200515-WA0002-200x200-1.jpg`; `/wp-content/uploads/2025/04/IMG-20200514-WA0005-200x200-1.jpg`; `/wp-content/uploads/2025/04/IMG-20200514-WA0006-200x200-1.jpg`; `/wp-content/uploads/2025/04/alumni_mech1.jpg`; `/wp-content/uploads/2025/04/23f547df-6c7d-465b-bb8d-5fd619fa1c03-200x200-1.jpg`; `/wp-content/uploads/2025/04/b2bd630c-0f1b-424d-adfd-265411ca3e94-200x200-1.jpg`; `/wp-content/uploads/2025/04/e3c1d152-7db9-43a2-90c5-4a2b8f6cf736-200x200-1.jpg` |
| Campus tour video | YouTube embed `https://www.youtube.com/embed/F-IujllQ3sI` |
| Gallery page first album | `/wp-content/uploads/2025/08/15-Aug-2.webp`; `/wp-content/uploads/2025/08/15-Aug-1.webp` |
| Gallery page selected album (Women’s Day 2025) | 30+ images under `/wp-content/uploads/2025/03/` with `womens_day_2025…` filenames (full filenames were truncated by the accessibility output). |
| Study Abroad page carousel / galleries | `/wp-content/uploads/2025/06/Alumni-and-external-expert-talks.png`; `/wp-content/uploads/2025/06/Students-Orientation-Program-University-and-Industry-visits.png`; `/wp-content/uploads/2025/06/Students-Orientation-Program-in-Nancy-University-Hospital-Mayor-Sir-Hablot-Vandoeruvre.png`; `/wp-content/uploads/2025/06/Dassault-Systemes-HQ-Velizy-France.png`; `/wp-content/uploads/2025/06/Course-in-Solar-Research-Center-in-Campus.png`; `/wp-content/uploads/2025/06/Students-Orientation-Program-in-Polytech-Nancy-France.png`; `/wp-content/uploads/2025/06/1.png`; `/wp-content/uploads/2025/06/2.png`; `/wp-content/uploads/2025/06/3.png`; plus 2026/04 event photos listed on the page. |
| 4IASE/SUPMECA story | Five images under `/wp-content/uploads/2026/01/WhatsApp-Image-2026-01-24-at-…jpeg`. |
| Study Abroad story | Nine images under `/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-08-at-…jpeg`; video `https://www.youtube.com/watch?v=KHuuK1Q7UCI`. |
| Tender notice page | `/wp-content/uploads/2026/09/Tender-Notice.jpg.jpeg`; linked form `/wp-content/uploads/2026/09/Office/Tender%20form%20for%20lift.pdf`. |
| Academic and policy documents | Listed in the sitemap above, including NIRF, mandatory disclosure, academic calendar, AICTE book catalog, exam ordinance, conduct and grievance PDFs. |

The homepage hero and department-card photographs are visually present but are background/media-layer assets without URLs exposed in the browser accessibility output. Their original URLs, along with complete album filenames and all assets on all department pages, should be captured from page asset/network inspection when implementation is approved. No replacement imagery should be invented.

## Access gaps

- No primary-navigation HTML page was found to be inaccessible in the browsing surface. Tender Notice for Lift Installation was verified directly in the browser after the text-extraction service returned a cache miss.
- Some primary links are files rather than pages (PDF/JPEG) and a few point to Google Drive, Google Forms, university/government services, campus login portals, Webobook, or YouTube. These are external dependencies, not local NKOCET routes.
- `sitemap_index.xml`, `wp-sitemap.xml`, and `robots.txt` could not be inspected with the available text extraction tool. A browser navigation to `wp-sitemap.xml` caused the embedded browser tab to crash, so I stopped that attempt; this sitemap is based on visible navigation and linked homepage/footer destinations. This does not establish that the XML endpoints do not exist.
- Some long scanned examination PDFs are text-poor (OCR returned only scanner marks). Preserve/serve the originals when recreating those document links rather than retyping or approximating their contents.
- There are at least two Study Abroad routes with different text/data: `/study-abroad-cell-foreign-university-tie-ups/` and `/study-abroad/`. Preserve them as separate paths unless the site owner confirms otherwise.

## Implementation plan (after approval)

1. Capture a desktop-width reference and inspect computed styles/font files, exact hero/gallery/dept background URLs, and all page-specific media. Preserve exact content and use original assets; do not generate replacement copy or imagery.
2. Build the shared responsive shell: identity header, primary nav with desktop dropdowns and mobile overlay/accordions, announcement ticker, content header, enquiry/callback systems, persistent accreditation/social/contact controls, and footer.
3. Recreate the homepage modules in their observed order, with actual source text, assets, links, carousel timing/state, gallery video, notice/news cards, recruiter and alumni data, and working CTA destinations.
4. Implement the sitemap paths using repeatable templates only where the original pages share structure; keep distinct tables, department content, notices, documents, photo galleries, forms, and route aliases faithful to each source page.
5. Preserve all real external destinations and PDFs. Make search, navigation, selects, carousel pagination, album selection, scroll-to-top, and forms behave like the source; never submit forms to external systems from the recreation unless their intended backend is explicitly provided.
6. After implementation approval, compare representative routes and narrow/desktop layouts against the reference, then reconcile all discovered page/asset URLs against this report.

## Sources

- [NKOCET homepage](https://orchidengg.ac.in/)
- [Admissions](https://orchidengg.ac.in/admissions/)
- [Training & Placements](https://orchidengg.ac.in/training-placement/)
- [Examination Cell](https://orchidengg.ac.in/examination-cell/)
- [Photo Gallery](https://orchidengg.ac.in/photo-gallery/)
- [Study Abroad Cell & Foreign University Tie-Ups](https://orchidengg.ac.in/study-abroad-cell-foreign-university-tie-ups/)
- [Study Abroad (footer route)](https://orchidengg.ac.in/study-abroad/)
