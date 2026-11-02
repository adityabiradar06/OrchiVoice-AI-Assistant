import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import {
  alumni, announcements, asset, departments, homepageStories, navigation, noticeCards,
  origin, recruiters, sitemapPages,
} from './data.js';

const logo = asset('/wp-content/uploads/2025/02/TOS_Logo-996x1024.webp');
const naac = asset('/wp-content/uploads/2025/04/naac.webp');
const collegeSummary = 'N. K. Orchid College Of Engineering & Technology (NKOCET), located in Solapur, is an autonomous college managed by the Pradnya Niketan Education Society (PNES) of Pune. Established in the academic year 2008-09, NKOCET has been dedicated to providing high-quality technological education. The college is approved by the All India Council for Technical Education (AICTE), New Delhi, and is recognized by the Government of Maharashtra. NKOCET has also been accredited with an NAAC A+ grade, reflecting its commitment to academic excellence and quality education.';

function Icon({ name, size = 20 }) {
  const paths = {
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
    mic: <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/></>,
    eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/><path d="m13 11 7-7M16 4h4v4"/></>,
    hands: <><path d="M12 21s-7-4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 6-7 10-7 10Z"/><path d="M3 17v-2a2 2 0 0 1 2-2h1M21 17v-2a2 2 0 0 0-2-2h-1"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    up: <><path d="M12 19V5M5 12l7-7 7 7" /></>,
    chevron: <><path d="m6 9 6 6 6-6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    phone: <><path d="M7 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-2l-5-2-2 3a15 15 0 0 1-7-7l3-2z"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.arrow}</svg>;
}

function destination(href) {
  return href?.startsWith('http') || href?.endsWith('.pdf') || href?.endsWith('.jpeg') || href?.endsWith('.jpg') || href?.endsWith('.png') || href?.endsWith('.webp');
}

function SiteLink({ to, href, children, className, ...props }) {
  const target = to || href || '#';
  if (destination(target)) return <a href={target.startsWith('http') ? target : asset(target)} className={className} {...props}>{children}</a>;
  return <Link to={target} className={className} {...props}>{children}</Link>;
}

function NavChildren({ items, depth = 0 }) {
  return <ul className={depth ? 'nav-submenu nested' : 'nav-submenu'}>
    {items.map((item) => {
      const node = Array.isArray(item) ? { label: item[0], href: item[1] } : item;
      return <li key={node.label} className={node.children ? 'has-submenu' : ''}>
        {node.href ? <SiteLink to={node.href}>{node.label}</SiteLink> : <span>{node.label}</span>}
        {node.children && <NavChildren items={node.children} depth={depth + 1} />}
      </li>;
    })}
  </ul>;
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();
  useEffect(() => { setMenuOpen(false); setOpenGroups({}); window.scrollTo({ top: 0, behavior: 'instant' }); }, [location.pathname]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setMenuOpen(false); setSearchOpen(false); } };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);
  return <>
    <a className="skip-link" href="#content">Skip to main content</a>
    <header className="site-header">
      <div className="masthead wrap">
        <SiteLink to="/" className="brand-mark"><img src={logo} alt="N. K. Orchid College emblem" /></SiteLink>
        <div className="brand-copy">
          <div className="society">Pradnya Niketan Education Society Pune’s</div>
          <div className="college-name">Nagesh Karajagi <em>Orchid</em> College of Engineering &amp; Technology, Solapur</div>
          <div className="college-status">An Autonomous Institute</div>
          <div className="approval">Approved by AICTE, New Delhi, Govt. of Maharashtra &amp; Affiliated to DBATU, Lonere.<br className="desktop-only" /> Accredited by NAAC with A+ Grade</div>
        </div>
        <a className="masthead-naac" href={naac} aria-label="Accredited by NAAC with CGPA 3.32"><img src={naac} alt="NAAC A+ Accreditation" /></a>
        <button className="search-toggle" aria-label="Search" onClick={() => setSearchOpen((v) => !v)}><Icon name="search" /></button>
        <button className={`mobile-menu-toggle ${menuOpen ? 'active' : ''}`} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}><Icon name={menuOpen ? 'close' : 'menu'} size={23} /></button>
      </div>
      {searchOpen && <form className="search-bar wrap" onSubmit={(e) => { e.preventDefault(); if (query.trim()) window.location.href = `${origin}/?s=${encodeURIComponent(query)}`; }}><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." aria-label="Search" /><button type="submit"><Icon name="search" /></button></form>}
      <nav className="primary-nav" aria-label="Primary navigation"><div className="wrap nav-inner">
        <SiteLink to="/" className="home-nav" aria-label="Home"><Icon name="home" size={19} /></SiteLink>
        {navigation.map((item) => <div key={item.label} className={`nav-item ${item.children ? 'has-submenu' : ''}`}>
          {item.href ? <SiteLink to={item.href}>{item.label}</SiteLink> : <button type="button" aria-haspopup="true">{item.label}<Icon name="chevron" size={14} /></button>}
          {item.children && <NavChildren items={item.children} />}
        </div>)}
      </div></nav>
    </header>
    <div className={`mobile-menu-backdrop ${menuOpen ? 'visible' : ''}`} onClick={() => setMenuOpen(false)} />
    <aside className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
      <div className="mobile-menu-head"><img src={logo} alt="" /><button aria-label="Close menu" onClick={() => setMenuOpen(false)}><Icon name="close" size={22} /></button></div>
      <SiteLink to="/" className="mobile-home"><Icon name="home" size={20} /><span>Home</span></SiteLink>
      <div className="mobile-menu-list">{navigation.map((item, i) => <div className="mobile-menu-item" key={item.label}>
        <div className="mobile-menu-row">
          {item.href ? <SiteLink to={item.href}>{item.label}</SiteLink> : <span>{item.label}</span>}
          {item.children && <button aria-label={`${openGroups[i] ? 'Collapse' : 'Expand'} ${item.label}`} aria-expanded={!!openGroups[i]} onClick={() => setOpenGroups((s) => ({ ...s, [i]: !s[i] }))}><Icon name="chevron" size={18} /></button>}
        </div>
        {item.children && <div className={`mobile-submenu ${openGroups[i] ? 'expanded' : ''}`}><MobileChildren items={item.children} openGroups={openGroups} parentIndex={i} setOpenGroups={setOpenGroups} /></div>}
      </div>)}</div>
    </aside>
  </>;
}

function MobileChildren({ items, openGroups, parentIndex, setOpenGroups }) {
  return items.map((item, idx) => {
    const node = Array.isArray(item) ? { label: item[0], href: item[1] } : item;
    const key = `${parentIndex}-${idx}`;
    return <div className="mobile-sub-item" key={node.label}>
      <div className="mobile-menu-row">
        {node.href ? <SiteLink to={node.href}>{node.label}</SiteLink> : <span>{node.label}</span>}
        {node.children && <button aria-label={`${openGroups[key] ? 'Collapse' : 'Expand'} ${node.label}`} onClick={() => setOpenGroups((s) => ({ ...s, [key]: !s[key] }))}><Icon name="chevron" size={16} /></button>}
      </div>
      {node.children && openGroups[key] && <div className="mobile-nested">{node.children.map((child) => <SiteLink key={Array.isArray(child) ? child[0] : child.label} to={Array.isArray(child) ? child[1] : child.href}>{Array.isArray(child) ? child[0] : child.label}</SiteLink>)}</div>}
    </div>;
  });
}

function AnnouncementTicker() {
  return <div className="ticker"><div className="ticker-label">Announcements / Notices</div><div className="ticker-window"><div className="ticker-track">{[...announcements, ...announcements].map(([label, href], i) => <React.Fragment key={`${label}-${i}`}><SiteLink to={href}>{label}</SiteLink><span aria-hidden="true">|</span></React.Fragment>)}</div></div></div>;
}

function SectionHeading({ children, accent }) {
  return <h2 className="section-heading">{children}{accent && <> <em>{accent}</em></>}</h2>;
}

function HomeHero() {
  const [tourOpen, setTourOpen] = useState(false);
  useEffect(() => {
    if (!tourOpen) return;
    const closeOnEscape = (event) => { if (event.key === 'Escape') setTourOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', closeOnEscape); document.body.style.overflow = previousOverflow; };
  }, [tourOpen]);
  return <section className="home-hero">
    <div className="home-video-hero" aria-label="NKOCET campus video"><iframe title="NKOCET campus video" src="https://www.youtube.com/embed/F-IujllQ3sI?autoplay=1&mute=1&controls=0&loop=1&playlist=F-IujllQ3sI&start=2&end=65&playsinline=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" /></div>
    <div className="hero-intro wrap"><div><p className="eyebrow">An Autonomous Institute</p><p className="intro-copy">{collegeSummary}</p><SiteLink to="/overview-of-nkocet/" className="button dark">Discover More <Icon name="arrow" size={17} /></SiteLink></div><button className="tour-card-link" type="button" onClick={()=>setTourOpen(true)} aria-haspopup="dialog"><img src={asset('/wp-content/uploads/2025/05/360-view-min.png')} alt="" /><span>360° Tour <Icon name="arrow" size={17} /></span></button></div>
    {tourOpen && <div className="campus-video-backdrop" role="presentation" onMouseDown={(event)=>{if(event.target===event.currentTarget)setTourOpen(false);}}><section className="campus-video-dialog" role="dialog" aria-modal="true" aria-label="NKOCET campus tour video"><button className="campus-video-close" type="button" onClick={()=>setTourOpen(false)} aria-label="Close campus video">×</button><video src="/videos/nkocet-campus-tour.mp4" controls autoPlay playsInline preload="metadata">Your browser does not support video playback.</video></section></div>}
  </section>;
}

function NoticeSection() {
  const cards = (copy) => noticeCards.map((n) => <article className="notice-card" key={`${copy}-${n.title}`}>{n.image && <SiteLink to={n.href} className="notice-image"><img src={n.image} alt="" loading="lazy" /></SiteLink>}<div className="notice-content"><span className="date">{n.date}</span><h3><SiteLink to={n.href}>{n.title}</SiteLink></h3>{n.summary && <p>{n.summary}</p>}<SiteLink to={n.href} className="text-link">Read More <Icon name="arrow" size={15} /></SiteLink></div></article>);
  return <section className="section notices-section wrap"><div className="section-top"><SectionHeading>Notices</SectionHeading><SiteLink to="/notices/" className="button dark">All Notices <Icon name="arrow" size={16} /></SiteLink></div><div className="notice-marquee" aria-label="Recent notices"><div className="notice-track"><div className="notice-group">{cards('first')}</div><div className="notice-group" aria-hidden="true" inert>{cards('repeat')}</div></div></div></section>;
}

function DepartmentsSection() {
  return <section className="section wrap departments-section"><SectionHeading>Our <em>Departments</em></SectionHeading><p className="section-lede">NKOCET offers a diverse range of undergraduate and postgraduate engineering programs, including:</p><div className="department-grid">{departments.map((d) => <SiteLink key={d.label} to={d.href} className="department-card" style={{ backgroundImage: `linear-gradient(0deg,rgba(0,0,0,.58),rgba(0,0,0,.08)),url("${d.image.startsWith('/images/') ? d.image : asset(d.image)}")` }}><span>{d.label}</span><span className="circle-arrow"><Icon name="arrow" size={20} /></span></SiteLink>)}</div></section>;
}

function NewsSection() {
  const cards = (copy) => homepageStories.map((story) => <article className="news-card" key={`${copy}-${story.href}`}><SiteLink to={story.href} className="news-image"><img src={story.image} alt="" loading="lazy" /></SiteLink><div className="news-copy"><span className="date">{story.date}</span><h3><SiteLink to={story.href}>{story.title}</SiteLink></h3></div></article>);
  return <section className="section news-section"><div className="wrap"><div className="section-top"><SectionHeading>News &amp; <em>Updates</em></SectionHeading></div><div className="news-marquee" aria-label="Latest news and updates"><div className="news-track"><div className="news-group">{cards('first')}</div><div className="news-group" aria-hidden="true" inert>{cards('repeat')}</div></div></div><div className="center-actions"><SiteLink to="/news-updates/" className="button dark">All News <Icon name="arrow" size={16} /></SiteLink><SiteLink to="/events/" className="button dark"><Icon name="calendar" size={16} /> Event Calendar</SiteLink></div></div></section>;
}

function PlacementSection() {
  const logos = (copy) => recruiters.map((image, i) => <div className="recruiter-logo" key={`${copy}-${image}-${i}`}><img src={image} alt={copy === 'repeat' ? '' : image.split('/').pop().replace('.webp', '')} /></div>);
  return <section className="section placement-section wrap"><SectionHeading>Placements</SectionHeading><p className="section-lede">Prominent Recruiters Coming to Our Campus for Recruitment Opportunities</p><div className="recruiter-window" aria-label="Recruiters"><div className="recruiter-track"><div className="recruiter-group">{logos('first')}</div><div className="recruiter-group" aria-hidden="true" inert>{logos('repeat')}</div></div></div></section>;
}

function ExcellenceSection() {
  const items = [
    ['Vision', 'To emerge as a leading Technological Institute ensuring Academic Excellence, fostering industry readiness and developing globally Competent Technocrats.', 'eye'],
    ['Mission', 'Foster excellence in teaching, creativity, critical thinking, industry interaction, holistic education, employable skills, and innovation.', 'target'],
    ['Core Values', 'To provide quality education, foster innovation, promote excellence, teamwork, integrity, and trust, while transforming society and serving the people’s welfare.', 'hands'],
  ];
  const gallery = ['/images/foundation/campus-august-2.webp','/images/foundation/campus-august-1.webp','/images/foundation/image025-1024x683.webp'];
  return <section className="section values-section wrap"><div className="foundation-layout"><div className="foundation-gallery" aria-label="NKOCET campus and student projects">{gallery.map((path,i)=><img key={path} src={path} alt={['NKOCET campus building during Independence Day','NKOCET campus quad','NKOCET Team Ashwamedh Formula Student car'][i]} loading="lazy" />)}</div><div className="foundation-copy"><SectionHeading>The Foundation Of Our <em>Excellence</em></SectionHeading><div className="values-grid">{items.map(([title, text, icon]) => <article className="value-card" key={title}><span className="value-icon"><Icon name={icon} size={25} /></span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div><SiteLink to="/vision-mission-and-core-values/" className="button dark foundation-read-more">Read More <Icon name="arrow" size={16} /></SiteLink></div></div></section>;
}

function AlumniSection() {
  const [active, setActive] = useState(0);
  const person = alumni[active];
  useEffect(() => { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; const timer = window.setInterval(() => setActive((value) => (value + 1) % alumni.length), 6500); return () => window.clearInterval(timer); }, []);
  return <section className="section alumni-section wrap"><SectionHeading>Alumni Speaks</SectionHeading><div className="alumni-panel"><article className="alumni-card" key={active} aria-live="off"><p className="alumni-quote">{person.quote}</p><div className="stars" aria-label="5 out of 5 stars">★★★★★</div><div className="alumni-person"><img src={person.image} alt="" loading="lazy" /><div><h3>{person.name}</h3><p>{person.role}</p></div></div></article><div className="alumni-pagination" aria-label="Alumni testimonials">{alumni.map((x, i) => <button key={i} className={i === active ? 'active' : ''} aria-label={`Show ${x.name}'s testimonial`} aria-current={i === active ? 'true' : undefined} onClick={() => setActive(i)} />)}</div></div></section>;
}

function HomePage() {
  return <><AnnouncementTicker /><main id="content"><HomeHero /><NoticeSection /><DepartmentsSection /><NewsSection /><PlacementSection /><ExcellenceSection /><AlumniSection /></main></>;
}

function CallbackForm() {
  const [status, setStatus] = useState('');
  return <form className="callback-form" onSubmit={(e) => { e.preventDefault(); setStatus('Form submission is not connected in this local recreation.'); }}>
    <h3>Request A Call Back</h3><div className="callback-fields"><input aria-label="First Name" placeholder="First Name" required /><input aria-label="Last Name" placeholder="Last Name" required /><input type="tel" aria-label="Phone Number" placeholder="Phone Number" required /><button type="submit" className="button light">Submit <Icon name="arrow" size={15} /></button></div>{status && <p className="form-status" role="status">{status}</p>}
  </form>;
}

function SiteFooter() {
  return <footer className="site-footer"><div className="footer-top wrap"><div className="footer-intro"><img src={logo} alt="" /><p>Nagesh Karajagi Orchid College Of Engineering &amp; Technology (NKOCET), located in Solapur, is an autonomous college managed by the Pradnya Niketan Education Society (PNES) of Pune.</p></div><div className="footer-callback"><CallbackForm /></div></div><div className="footer-details wrap"><section className="footer-hours"><h3>Office Hours :</h3><div className="hours-row"><span>Monday - Saturday</span><strong>10.00 AM-05.30 PM</strong></div><div className="hours-row"><span>Sunday</span><strong>Closed</strong></div></section><section className="footer-links"><h3>Quick Links</h3><ul><li><a href="https://nkorchid.edupluscampus.com/">Faculty Login</a></li><li><SiteLink to="/photo-gallery/">Photo Gallery</SiteLink></li><li><a href="https://forms.gle/pE99WHfj8sRr5RV17">ID Card Application (Staff)</a></li><li><SiteLink to="/public-self-disclosure/">Public Self Disclosure</SiteLink></li><li><SiteLink to="/study-abroad/">Study Abroad Cell &amp; Foreign University Tie-Ups</SiteLink></li></ul></section><section className="footer-students"><h3>For Students</h3><ul><li><a href="https://mynkorchid.edupluscampus.com/">Student Login</a></li><li><a href="https://forms.gle/i9eo9z66cpQheNjQ6">ID Card Application (Students)</a></li><li><SiteLink to="/news-updates/">News &amp; Updates</SiteLink></li><li><SiteLink to="/examination-cell/">Examination Cell</SiteLink></li><li><SiteLink to="/research-development/">Research and Development</SiteLink></li></ul></section><section className="footer-contact"><h3>Contact Info</h3><p>Phone<br /><a href="tel:+912172990051"><strong>+91 217 299 0051</strong></a></p><p>Address<br /><strong>Gat No.16, Solapur-Tuljapur Road, Near Mashroom Ganapati Temple, Solapur-413002</strong></p><p>Email<br /><a href="mailto:office@orchidengg.ac.in"><strong>office@orchidengg.ac.in</strong></a></p></section></div><div className="footer-bottom"><div className="wrap footer-bottom-inner"><span>© 2026 N. K. Orchid College of Engineering &amp; Technology, Solapur | Designed and Developed by <a href="https://selectmedia.co.in/">Select Media</a> | Content by Duhita Deshmukh</span><div className="social-links"><a href="https://www.facebook.com/NKORCHIDENGG" aria-label="Facebook">f</a><a href="https://twitter.com/nk_orchid" aria-label="X-twitter">𝕏</a><a href="https://www.youtube.com/user/savitagungewale/videos" aria-label="Youtube">▶</a><a href="https://www.linkedin.com/in/nkorchidcollege" aria-label="Linkedin">in</a><a href="https://www.instagram.com/nkocet/" aria-label="Instagram">◎</a></div></div></div></footer>;
}

function ContactModal({ onClose }) {
  const [status, setStatus] = useState('');
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><section className="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-title"><button className="modal-close" aria-label="Close enquiry form" onClick={onClose}>×</button><h2 id="enquiry-title">Enquiry</h2><form onSubmit={(e) => { e.preventDefault(); setStatus('Form submission is not connected in this local recreation.'); }}><input placeholder="Your Name" aria-label="Your Name" required /><input type="email" placeholder="Your Email" aria-label="Your Email" required /><input type="tel" placeholder="Your Phone Number" aria-label="Your Phone Number" required /><input placeholder="Your State" aria-label="Your State" /><input placeholder="Your City" aria-label="Your City" /><select aria-label="Select Course" defaultValue=""><option value="" disabled>Select Course</option>{['AI & DS','Civil Engineering','Computer Science and Engineering','Electronics and Telecommunication Engineering','Electrical Engineering','Mechanical Engineering'].map((x)=><option key={x}>{x}</option>)}</select><button className="button dark" type="submit">Submit</button>{status && <p role="status" className="form-status">{status}</p>}</form></section></div>;
}

function FloatingControls() {
  const [showTop, setShowTop] = useState(false);
  const [modal, setModal] = useState(false);
  const [channelsOpen, setChannelsOpen] = useState(false);
  useEffect(() => { const f=()=>setShowTop(window.scrollY>350); window.addEventListener('scroll',f); return()=>window.removeEventListener('scroll',f); }, []);
  return <><div className="floating-controls"><button className="float-email" aria-label="Open enquiry form" onClick={()=>setModal(true)}><Icon name="mail" size={22} /></button><button className="float-orchivoice" type="button" aria-label="Orchid AI — OrchiVoice AI and chat assistant" onClick={()=>window.open('/orchivoice/index.html', '_blank', 'noopener,noreferrer')}><img src="/images/orchivoice-college-ai-logo.png" alt="" /><span><strong>Orchid AI</strong><small>OrchiVoice AI and chat assistant</small></span></button><a className="float-naac" href={asset('/wp-content/uploads/2025/04/naac.webp')} aria-label="Accredited by NAAC with CGPA 3.32"><img src={naac} alt="Accredited by NAAC with CGPA 3.32" /></a>{showTop && <button className="scroll-top" aria-label="Scroll to top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}><Icon name="up" size={21} /></button>}<div className="chaty"><button className="chaty-label" onClick={()=>setChannelsOpen((x)=>!x)}>Contact us</button><button className={`chaty-main ${channelsOpen?'open':''}`} aria-label="Open contact channels" aria-expanded={channelsOpen} onClick={()=>setChannelsOpen((x)=>!x)}><Icon name="bell" size={22} /></button>{channelsOpen && <div className="chaty-options"><a aria-label="Phone" href="tel:+919423084363"><Icon name="phone" /></a><a aria-label="WhatsApp" href="https://web.whatsapp.com/send?phone=919423084363&text=">WA</a><a aria-label="LinkedIn" href="https://www.linkedin.com/in/nkorchidcollege">in</a><a aria-label="Instagram" href="https://www.instagram.com/nkocet/">◎</a><a aria-label="Twitter" href="https://x.com/nk_orchid">𝕏</a></div>}</div></div>{modal && <ContactModal onClose={()=>setModal(false)} />}</>;
}

const routeCopy = {
  'overview-of-nkocet': { intro: 'Established in 2008, Nagesh Karajagi Orchid College of Engineering & Technology (NKOCET) in Solapur, Maharashtra, is a premier autonomous institution managed by the Pradnya Niketan Education Society (PNES), Pune. With a vision of providing locally rooted and globally competent education, NKOCET is committed to excellence in technical education, research, and innovation. The institute is approved by AICTE, recognized by the Government of Maharashtra, affiliated with Dr. Babasaheb Ambedkar Technological University (DBATU), Lonere, and has also been accredited with an NAAC A+ grade. The college offers a wide range of undergraduate and postgraduate programs in various engineering disciplines, ensuring students gain both theoretical knowledge and practical skills. Equipped with state-of-the-art infrastructure, modern laboratories, and a dynamic learning environment, NKOCET fosters an all-rounded educational experience that prepares students for successful careers in the rapidly evolving global industry.', sections: [['Our Departments', 'NKOCET offers a diverse range of undergraduate and postgraduate engineering programs, including:'], ['Campus, Careers & Global Success', 'Experience top-notch campus life, career opportunities, and global collaborations for success.'], ['Facilities & Campus Life', 'Spread across a picturesque 10.6-acre campus near Hipparga Lake, the college offers modern infrastructure, including well-equipped laboratories, smart classrooms, a comprehensive library accessible 24/7, hostel accommodations, a canteen, sports facilities, and a gymnasium. The student-friendly environment is supported by experienced faculty members dedicated to holistic education.'], ['Training, Placements & Industry Collaboration', 'NKOCET’s Training & Placement Cell provides career guidance, soft skills training, and industry interactions, ensuring high employability rates. The institute has signed MoUs with leading industries for advanced training, internships, and project mentorship. Specialized coaching for GATE, GRE, TOEFL, and IELTS is available through the Study Abroad Cell, helping students secure higher education opportunities globally.']] },
  'vision-mission-and-core-values': { sections: [['The Foundation of Our Excellence', ''], ['Our Vision', 'To be a leading technological institute recognized for academic excellence, industry readiness, and the development of globally competent technocrats.'], ['Our Mission', 'Foster excellence in teaching and learning, encouraging creativity and critical thinking. Strengthen industry-institute collaboration for practical exposure. Provide holistic education for well-rounded personality development. Instill universal values of respect, commitment, and teamwork. Deliver employable education through skill-based training. Promote innovation, research, and consultancy for technological advancement.'], ['Core Values', 'Quality Education; Innovation & Knowledge; Excellence & Growth; Collaboration & Teamwork; Integrity & Accountability; Social Responsibility.']] },
  'tender-notice-for-lift-installation': { image: '/wp-content/uploads/2026/09/Tender-Notice.jpg.jpeg', files: [['Click Here For Tender Form', '/wp-content/uploads/2026/09/Office/Tender%20form%20for%20lift.pdf']] },
  'study-abroad': { intro: 'The Study Abroad Cell (SAC) is a strategic initiative of NKOCET, focused on enabling students to explore higher education opportunities at premier international universities. SAC supports students throughout their journey—from test preparation to visa interviews—ensuring holistic guidance and success. Coordinator: Dr. Shriniwas S. Metan', sections: [['Objectives', 'Provide the right educational match to students. Assist in admissions to top global universities, especially with scholarship opportunities. Guide students for qualifying exams like GRE, TOEFL, and IELTS. Facilitate domain- and country-specific university applications. Offer VISA counseling and mock VISA interviews. Conduct cross-cultural training and provide international exposure. Enable student exchange programs. Offer foreign language courses.'], ['Distinctive Work Plan', '360° counseling involving students and parents. Guidance on resume building. GRE/TOEFL/IELTS preparation support. Help in drafting SOPs, LORs, and transcripts. University and domain selection support. Assist in funding options, including loan facilities. Guidance on university applications and assistantships. Scholarship assistance and application tracking.']] },
  'examination-cell': { intro: 'At NKOCET, the Examination Section plays a pivotal role in ensuring smooth and transparent conduct of all academic assessments. This dedicated space provides students, faculty, and stakeholders with access to important updates, documents, and resources related to examinations. We believe in upholding the principles of fairness, punctuality, and accuracy in our examination processes.', sections: [['Rules And Regulations Of Examination', 'Students must carry a valid college ID card and admit card to the examination hall. Electronic devices such as mobile phones, smart watches, and digital calculators are prohibited. Students must report 15 minutes before the exam. Malpractice leads to disciplinary action. Leaving within the first 30 minutes is not permitted. Silence must be maintained and seating arrangements followed.'], ['Exam Calendar', 'The calendar includes internal assessments, practical examinations, mid-semester exams, end-semester theory examinations, and make up examinations.'], ['Timetable', 'Current examination timetables are available by course selection. DBATU timetable is also available.'], ['Results', 'Results for various internal assessments and end-semester examinations are posted when released.'], ['Previous Question Papers', 'Browse by department, semester, and subject code.']] },
  'contact-us': { intro: 'Need assistance or have any questions? We’re here to help! Reach out to us for admissions, academic inquiries, or any other information. Our team is ready to assist you with prompt responses and the guidance you need. Get in touch today!', sections: [['Address', 'Gat No.16, Solapur-Tuljapur Road, Near Mashroom Ganapati Temple, Tale-Hipparaga, Solapur-413002'], ['Email Addresses', 'office@orchidengg.ac.in\ncontactus@orchidengg.ac.in\nadmission@orchidengg.ac.in\nsuggestion@orchidengg.ac.in'], ['Office Phone Numbers', '0217 299 0051 / 094230 84363'], ['Frequently Asked Questions', 'What programs does N. K. Orchid College offer?\nThe college offers undergraduate (B. Tech) programs in various engineering disciplines and postgraduate (MTech) programs.\n\nWhich engineering branches are available for B. Tech?\nThe B. Tech programs include Artificial Intelligence & Data Science, Civil Engineering, Computer Science & Engineering, Electronics & Telecommunication Engineering, Electrical Engineering, and Mechanical Engineering.\n\nWhat are the eligibility criteria for B. Tech admissions?\nCandidates must have passed HSC or its equivalent examination with Physics and Mathematics as compulsory subjects, along with an approved third subject and the required marks. Candidates should have appeared in all subjects in MHT-CET and obtained a non-zero score.\n\nIs there a direct second-year admission for diploma holders?\nYes, diploma holders can seek direct admission to the second year of B. Tech programs, subject to eligibility criteria specified by the Directorate of Technical Education, Maharashtra.\n\nHow can I apply for admission?\nCandidates are advised to follow the admission procedures as published by the Directorate of Technical Education, Maharashtra State, and submit applications to the notified Admission Authorities before the specified deadlines.\n\nDoes the college provide hostel facilities?\nYes, the college offers hostel facilities for students.\n\nWhat are the training and placement opportunities?\nThe Training & Placement Cell provides regular training programs on communication skills and soft skills to prepare students for campus selection.\n\nWhich companies have recruited students from the college?\nTop recruiting companies include TCS, Capgemini, Infosys, TIAA, and Virtusa, among others.\n\nAre there research and development opportunities?\nYes, the college has a dedicated Research and Development cell that encourages innovative projects and collaborations.\n\nDoes the college have industry collaborations?\nYes, the college has collaborations with various industries to enhance practical learning and provide internship opportunities.\n\nWhat extracurricular activities are available on campus?\nThe college offers sports, cultural events, and technical clubs to promote holistic development.\n\nIs there a library facility available?\nYes, the college has a well-equipped library with books, journals, and digital resources.\n\nAre there scholarship programs for students?\nYes, the college offers scholarship programs for eligible students. Details can be obtained from the administration office.\n\nFor admission inquiries, contact 0217 299 0051 / 094230 84363 or admission@orchidengg.ac.in.']] },
  'civil-engineering': { sections: [['About', ''], ['Vision Statement: Department of Civil Engineering', 'To develop competent Civil Engineers who design, build, and manage resilient, smart, and sustainable infrastructure—leveraging cutting-edge technologies such as BIM (Building Information Modeling), 3D printed and modular construction, structural health monitoring, and advanced materials to address India’s growing urbanization and infrastructure challenges.'], ['Mission Statement: Department of Civil Engineering', 'M1: Education & Curriculum Excellence — To impart a strong foundation in civil engineering principles integrated with emerging technologies—including BIM, smart materials, and digital construction methods—through an outcome-based, industry-aligned curriculum.\n\nM2: Applied Research & Innovation — To promote a culture of applied research and innovation in structural health monitoring, self-healing and advanced construction materials, and 3D-printed/modular construction technologies.\n\nM3: Hands-On Skills & Industry Readiness — To develop practical competencies through laboratory work, live project exposure, site visits, and collaborative engagement with industry and government bodies.\n\nM4: Sustainability & Social Responsibility — To instill a commitment to sustainable, resilient and inclusive infrastructure design aligned with national missions such as Smart Cities, PMAY, and disaster risk reduction.\n\nM5: Professional Values & Lifelong Learning.']] },
  'computer-science-and-engineering': { sections: [['About', 'The Department of Computer Science & Engineering at NKOCET is dedicated to imparting cutting-edge knowledge and skills essential for thriving in the rapidly evolving technology landscape. Established in 2008, the department has consistently aimed to bridge the gap between academia and industry by fostering an innovative and research-oriented learning environment. Equipped with state-of-the-art laboratories, high-performance computing systems, and industry-standard software, the department ensures students gain hands-on experience in emerging technologies. Our well-qualified faculty, including Ph.D. holders and postgraduate experts from reputed institutes, are committed to academic excellence, research, and industry collaboration.'], ['Key Highlights', 'Industry-Ready Infrastructure: The department boasts 10 modern laboratories with high-end Dell, HP, and Lenovo computers, all installed with the latest software. 24/7 Power Backup & Advanced Peripherals: Computing resources are backed by uninterrupted power supply (UPS); scanners, printers, multimedia peripherals, and high-speed internet connectivity enhance learning. Strong Industry-Academia Connect: Simulated software industry work environment, expert lectures, workshops, study tours and industry-sponsored projects. Holistic Student Development: The Computer Science and Engineering Students’ Association (CSESA) promotes co-curricular and extracurricular activities and encourages paper presentations and publications.']] },
  'artificial-intelligence-data-science': { sections: [['About', 'The Bachelor’s Degree Programme in Artificial Intelligence & Data Science (AI & DS) at NKOCET was launched in the academic year 2021 – 2022 with an intake capacity of 60 students. The department has been established with a clear vision to impart comprehensive core and technological knowledge in the rapidly growing field of AI and Data Science. The curriculum blends Computer Science with Mathematical Foundations, AI techniques, Machine Learning principles, Statistical Methods, and Data Science methodologies. Graduates are prepared for roles such as Data Scientist, AI Engineer, Machine Learning Engineer, Data Analyst, Software Engineer, Research Scientist, and AI Algorithm Specialist. The department is led by Dr. M. B. Patil, Head of the Department, and a team of highly motivated and dynamic faculty members.'], ['Key Highlights', 'Industry-ready infrastructure with Dell, HP, and Lenovo systems and AI and data science software including Python, R, TensorFlow, PyTorch, MATLAB, SQL, and cloud computing platforms. Dedicated UPS, high-speed internet, scanners, printers, multimedia peripherals, and cloud-based storage. Expert talks and workshops, industry visits and sponsored projects, hackathons, coding competitions, research initiatives, and personalized mentoring.'], ['Strengths of the Department', 'Holistic learning environment; quality student intake; strong alumni network; talented and motivated faculty; state-of-the-art laboratories.'], ['Vision', 'The Department of Artificial Intelligence and Data Science aims to be a leading centre for Artificial Intelligence and Data Science education, ensuring academic excellence, fostering industry-readiness, and promoting techno-societal research. Our goal is to shape future leaders in the field of AI and Data Science, preparing them to address real-world challenges with cutting-edge solutions.']] },
  'etc': { sections: [['About', 'The Electronics & Telecommunication Engineering (E&TC) Department at NKOCET is committed to shaping future engineers with a strong foundation in cutting-edge technology, industry-relevant skills, and research-driven innovation. With a focus on academic excellence, practical exposure, and holistic development, the department equips students to excel in communication, embedded systems, VLSI, and signal processing. Backed by state-of-the-art laboratories, experienced faculty, and active industry collaborations, it bridges theoretical knowledge and real-world applications.'], ['Key Highlights', 'Well-equipped laboratories for embedded systems, VLSI, signal processing, and communication technologies; industrial visits, expert talks, MoUs, internships, and skill-based training; outcome-based and project-based learning; support for startups, incubation, research projects, patents and publications; technical clubs, hackathons, seminars and workshops.'], ['Strengths of the Department', 'Qualified and experienced faculty; placement support; academic and industry collaborations; a holistic learning environment; alumni mentorship.'], ['Vision', 'To develop competent Electronics and Telecommunication Engineers who design, develop, and manage intelligent, connected, and sustainable electronic and Telecommunication systems leveraging cutting-edge technologies such as Embedded systems, VLSI design, IoT (Internet of Things), Next Generation Communication Systems, and AI-driven signal processing to address global growing digital and communication needs.'], ['Mission', 'M1: To deliver excellence in education by maintaining a curriculum that meets current industry and academic standards.\nM2: To promote Applied Research & Innovation.\nM3: To develop Hands-On Skills & Industry Readiness.\nM4: To instill Sustainability & Social Responsibility.\nM5: To nurture Professional Values & Lifelong Learning.'], ['Facilities', 'The department’s Electronics Components Library makes components and sensors available to students for project-based and do-it-yourself learning.']] },
  'electrical-engineering': { sections: [['About', 'The Electrical Engineering Department at N.K. Orchid College of Engineering & Technology (NKOCET), Solapur, is committed to shaping industry-ready professionals through quality education and hands-on training. It offers an industry-aligned curriculum, laboratories for power systems, machines, control systems and renewable energy, industrial visits, expert lectures, workshops, research opportunities, and placement support.'], ['Emerging Areas in Electrical Engineering', 'Smart Grids & Microgrids; Renewable Energy Systems; Electric Vehicles (EVs); Energy Storage Technologies; Power Electronics & Drives; IoT Applications in Energy; AI/ML in Power Systems; HVDC & FACTS; Cybersecurity for Power Systems; Smart Cities and Home Automation.'], ['Key Highlights', 'Established in 2011-12; industry collaboration with power generation, transmission, and distribution companies; 11 laboratories; diverse career opportunities; a 1:15 faculty-student ratio; research and innovation projects in emerging energy technologies.'], ['Strengths of the Department', 'Industry-ready curriculum; a skilled faculty team of 10; 11 modern laboratories; diverse career prospects; hands-on training and projects; industry network including MITCON, LHP, SPARTON, Exa Mobility, MSDCL and Spitzen Energy.'], ['Vision', 'To develop competent Electrical Engineers capable of designing, analysing, and managing intelligent, sustainable, and energy-efficient systems by leveraging emerging technologies such as smart grids, renewable energy, electric mobility, and automation to address national and global challenges.'], ['Mission', 'M1: Education and Curriculum Excellence — provide a strong foundation in electrical engineering principles integrated with modern technologies like smart grids, power electronics, IoT, and renewable energy through an outcome-based and industry-aligned curriculum.\nM2: Applied Research and Innovation — promote applied research and innovation in renewable energy systems, electric vehicles, automation, and intelligent control systems.']] },
  'mechanical-engineering': { sections: [['About', 'Established in 2008, the Mechanical Engineering Department at N.K. Orchid College of Engineering & Technology, Solapur, is committed to excellence in academics, research, and technical education. The department is supported by a dedicated and experienced faculty team, combining academic expertise with industry insight. Its modern laboratories cover Thermal, Design, Production, and CAD/CAM Engineering. Students engage in project-based learning, interdisciplinary activities, industry visits, internships, expert talks, sponsored projects, and community-oriented projects.'], ['Key Highlights', 'Experienced faculty; state-of-the-art Thermal, Design, Production, and CAD/CAM laboratories; hands-on, mini and major projects; industrial visits, internships, expert sessions and sponsored projects; student research and innovation; social responsibility and community engagement; career-oriented technical and soft skills.'], ['Departmental Strengths – Mechanical Engineering', 'Experienced and qualified faculty; modern infrastructure and laboratories; research and innovation; industry interaction and exposure; student-centric mentoring and student association MESA; career support and placements; recognition in AICTE-CII surveys and industry-institute interaction.'], ['Vision of the Department', 'To be a nationally recognized center of excellence in Mechanical and Multidisciplinary Engineering, empowering future-ready engineers who drive innovation in sustainable technologies, intelligent mobility, manufacturing, and indigenous solutions.'], ['Mission of the Department', 'M1: Deliver quality education through a dynamic curriculum aligned with emerging trends in Mechanical and Multidisciplinary Engineering.\nM2: Establish a vibrant research and innovation ecosystem in energy, sustainable technologies, intelligent mobility, and manufacturing.\nM3: Strengthen Industry-Institute collaboration through internships, industrial training, and multidisciplinary projects to enhance employability and professional competence.']] },
  'admissions': { intro: 'Welcome to the official admissions page of NKOCET, where aspiring engineers take their first step toward a bright future. Our institution offers undergraduate degrees in various branches of engineering, providing a dynamic learning environment, state-of-the-art facilities, and experienced faculty to help students excel in their careers.', sections: [['Departments offering undergraduate degrees', 'Civil Engineering — Intake 60. Computer Science and Engineering — Intake 180. Electronics & Telecommunication Engineering — Intake 60. Mechanical Engineering — Intake 120. Electrical Engineering — Intake 60. Artificial Intelligence & Data Science — Intake 60.'], ['Eligibility Criteria for Maharashtra State Candidates', 'The aspirant should be an Indian National and should have passed HSC or equivalent with Physics and Mathematics as compulsory subjects and one of Chemistry, Biotechnology, Biology or Technical Vocational subjects. Candidates should meet the applicable marks criteria and have a non-zero CET score.'], ['Direct Second Year Engineering (B. Tech)', 'Eligible candidates with a Diploma in Engineering, B.Sc. Degree, or D.Voc. qualification can apply for lateral entry into the second year.']] },
};

function PageTemplate({ page }) {
  const copy = routeCopy[page.slug] || {};
  const isDepartment = ['artificial-intelligence-data-science','civil-engineering','computer-science-and-engineering','etc','electrical-engineering','mechanical-engineering','general-engineering'].includes(page.slug);
  const sections = copy.sections || [];
  const hasSourceContent = Boolean(copy.intro || sections.length || copy.files || copy.image);
  return <main id="content" className="content-page">{hasSourceContent ? <><div className="page-hero wrap"><p className="breadcrumb"><SiteLink to="/">Home</SiteLink><span>/</span>{page.title}</p><h1>{page.title}</h1></div><div className="page-body wrap">{copy.intro && <p className="page-intro">{copy.intro}</p>}{copy.image && <img className="page-feature-image" src={asset(copy.image)} alt={page.title} />}{sections.map(([title, text])=><section className="page-section" key={title}><h2>{title}</h2>{text && <p>{text}</p>}</section>)}{copy.files && <div className="document-links">{copy.files.map(([label,href])=><a className="button dark" href={asset(href)} key={label}>{label}<Icon name="arrow" size={16}/></a>)}</div>}</div></> : <div className="source-page-frame"><iframe title={`${page.title} on the NKOCET website`} src={`${origin}${page.href}`} loading="lazy" /></div>}</main>;
}

function RoutePage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/+|\/+$/g, '');
  const page = sitemapPages.find((x)=>x.slug===slug) || { slug, title: slug.split('-').map((x)=>x.charAt(0).toUpperCase()+x.slice(1)).join(' '), href: pathname };
  if (page.slug === 'overview-of-nkocet') return <OverviewPage />;
  return <main id="content" className="source-page-frame"><iframe title={`${page.title} on the NKOCET website`} src={`${origin}${page.href}`} loading="lazy" /></main>;
}

function OverviewPage() {
  const leaders = [
    ['Dr. B. K. Sonage', 'Principal', '/wp-content/uploads/2025/05/principal.webp'],
    ['Dr. R. R. Patil', 'Dean T & P', '/wp-content/uploads/2025/05/Dr.-R.-R.-Patil-Dean-T-P.webp'],
    ['Dr. S. S. Metan', 'Professor', '/wp-content/uploads/2025/11/Dr.-S.-S.-Metan.jpeg'],
    ['Dr. V. K. Patki', 'Professor', '/wp-content/uploads/2025/11/Dr.-V.-K.-Patki.jpeg'],
    ['Dr. Mithun. B. Patil', 'HOD - AI & DS', '/wp-content/uploads/2025/03/DR.MBP_-768x553-1.webp'],
    ['Dr. S. B. More', 'HOD - Civil Engineering', '/wp-content/uploads/2025/07/DR.-S-B-More-Civil-Dept-HOD-Photo.webp'],
    ['Dr. V.V.Bag', 'HOD - CS & Engineering', '/wp-content/uploads/2025/05/Dr.-V.V.Bag-1.webp'],
    ['Prof. S. S. Dhotre', 'HOD - E & TC Engineering', '/wp-content/uploads/2025/05/entc-hod.webp'],
    ['Prof. S.S. Kale', 'HOD - Mechanical Engineering', '/wp-content/uploads/2025/05/Prof.-S.S.-Kale-1.webp'],
    ['Prof S D Jadhav', 'HOD - General Engineering', '/wp-content/uploads/2025/11/Prof.-S.-D.-Jadhav-1.jpeg'],
  ];
  return <main id="content" className="content-page overview-page"><div className="overview-title">Overview</div><div className="overview-content">
    <p>Established in 2008, Nagesh Karajagi Orchid College of Engineering &amp; Technology (NKOCET) in Solapur, Maharashtra, is a premier autonomous institution managed by the <a href="/about-pnes/">Pradnya Niketan Education Society (PNES), Pune.</a> With a vision of providing locally rooted and globally competent education, NKOCET is committed to excellence in technical education, research, and innovation. The institute is approved by AICTE, recognized by the Government of Maharashtra, affiliated with Dr. Babasaheb Ambedkar Technological University (DBATU), Lonere, and has also been accredited with an NAAC A+ grade.</p>
    <p>The college offers a wide range of undergraduate and postgraduate programs in various engineering disciplines, ensuring students gain both theoretical knowledge and practical skills. Equipped with state-of-the-art infrastructure, modern laboratories, and a dynamic learning environment, NKOCET fosters an all-rounded educational experience that prepares students for successful careers in the rapidly evolving global industry.</p>
    <SiteLink to="/contact-us/" className="button dark overview-contact">Contact Us</SiteLink>
    <h2>Our Departments</h2><p>NKOCET offers a diverse range of undergraduate and postgraduate engineering programs, including:</p><div className="overview-departments">{departments.map((d)=><SiteLink key={d.label} to={d.href}>{d.label}</SiteLink>)}</div>
    <h2>Campus, Careers &amp; Global Success</h2><p>Experience top-notch campus life, career opportunities, and global collaborations for success.</p>
    <h2>Facilities &amp; Campus Life</h2><p>Spread across a picturesque 10.6-acre campus near Hipparga Lake, the college offers modern infrastructure, including well-equipped laboratories, smart classrooms, a comprehensive library accessible 24/7, hostel accommodations, a canteen, sports facilities, and a gymnasium. The student-friendly environment is supported by experienced faculty members dedicated to holistic education.</p>
    <h2>Training, Placements &amp; Industry Collaboration</h2><p>NKOCET’s Training &amp; Placement Cell provides career guidance, soft skills training, and industry interactions, ensuring high employability rates. The institute has signed MoUs with leading industries for advanced training, internships, and project mentorship. Specialized coaching for GATE, GRE, TOEFL, and IELTS is available through the Study Abroad Cell, helping students secure higher education opportunities globally.</p>
    <h2>International Collaborations &amp; Student Development</h2><p>NKOCET fosters global exposure through exchange programs, technical competitions, and national-level events like “Orchitech.” The structured Soft Skills Training program enhances students’ communication, adaptability, and critical thinking skills, making them industry-ready professionals. With a steadfast commitment to academic excellence, industry readiness, and holistic student development, NKOCET continues to shape future engineers equipped to excel in their careers and contribute meaningfully to society.</p>
    <h2>Meet Our Leaders</h2><p>Get to know our esteemed leadership team, including the Principal, Vice Principal, and HODs.</p><div className="overview-leaders">{leaders.map(([name,role,image])=><article key={name}><img src={asset(image)} alt={name} loading="lazy"/><h3>{name}</h3><p>{role}</p></article>)}</div>
  </div></main>;
}

function App() {
  const [showTop, setShowTop] = useState(false);
  const location = useLocation();
  const slug = location.pathname.replace(/^\/+|\/+$/g, '');
  const authored = !slug || slug === 'overview-of-nkocet';
  useEffect(()=>{const f=()=>setShowTop(window.scrollY>350);window.addEventListener('scroll',f);return()=>window.removeEventListener('scroll',f)},[]);
  return <>{authored && <SiteHeader />}<Routes><Route path="/" element={<HomePage />} /><Route path="*" element={<RoutePage />} /></Routes>{authored && <><SiteFooter /><FloatingControls />{showTop && <button className="desktop-scroll-top" aria-label="Scroll to top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}><Icon name="up" /></button>}</>}</>;
}

export default App;
