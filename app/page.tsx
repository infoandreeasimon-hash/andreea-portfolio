'use client';

import Image from 'next/image';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function Section({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section id={id} className="section collapsibleSection">
      <button className="sectionToggle" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <div className="sectionToggleLeft">
          <span className="sectionNum">{num}</span>
          <h2>{title}</h2>
        </div>
        <span className={`toggleIcon ${open ? 'open' : ''}`}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="sectionBody">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.75, ease: 'easeOut' }
};

const Img = ({ src, alt, className = '' }: { src: string; alt: string; className?: string }) => (
  <Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 50vw" className={className} />
);

const Chip = ({ children }: { children: React.ReactNode }) => <span className="chip">{children}</span>;

/* ── Typewriter ── */
function Typewriter({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx % words.length];
    let timer: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < word.length) {
      timer = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timer = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx(i => i + 1);
    }
    return () => clearTimeout(timer);
  }, [displayed, deleting, idx, words]);

  return (
    <span className="typewriter">
      {displayed}<span className="cursor">|</span>
    </span>
  );
}

/* ── Animated counter ── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1600;
        const steps = 50;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          setCount(Math.round(target * (step / steps)));
          if (step >= steps) clearInterval(timer);
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Marquee ticker ── */
function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="marqueeWrap">
      <div className="marqueeTrack">
        {doubled.map((item, i) => (
          <span key={i} className="marqueeItem">{item} <span className="marqueeDot">✦</span></span>
        ))}
      </div>
    </div>
  );
}

/* ── Cursor sparkles ── */
function CursorSparkles() {
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    let throttle = false;
    const onMove = (e: MouseEvent) => {
      if (throttle) return;
      throttle = true;
      setTimeout(() => { throttle = false; }, 80);
      const id = counter.current++;
      setSparks(s => [...s.slice(-12), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setSparks(s => s.filter(p => p.id !== id)), 700);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="sparkleLayer" aria-hidden>
      {sparks.map(s => (
        <span key={s.id} className="sparkle" style={{ left: s.x, top: s.y }}>✦</span>
      ))}
    </div>
  );
}

export default function Home() {
  const marqueeItems = [
    'Brand Strategy', 'Fashion Marketing', 'Digital Campaigns',
    'Cultural Storytelling', 'Product Development', 'Trend Forecasting',
    'Event Production', 'Social Media', 'Luxury Positioning', 'Creative Direction'
  ];

  return (
    <main>
      <CursorSparkles />

      <nav className="nav">
        <a href="#top" className="brand">Andreea Simon</a>
        <div className="navLinks">
          <a href="#profile">Profile</a>
          <a href="#work">Work</a>
          <a href="#skills">Skills</a>
          <a href="#education">Education</a>
          <a href="mailto:infoandreeasimon@gmail.com">Contact</a>
        </div>
      </nav>

      <section id="top" className="hero">
        <motion.div className="heroCopy" {...fade}>
          <p className="eyebrow">✦ Marketing Professional · Brand Builder · Creative Strategist</p>
          <h1>Culture, brands &<br /><Typewriter words={['digital experiences.', 'bold stories.', 'lasting impact.', 'beautiful ideas.']} /></h1>
          <div className="pinkDivider" />
          <p className="lead">I create visual stories, product concepts, digital campaigns, and consumer experiences for fashion, lifestyle, and modern brands.</p>
          <div className="actions">
            <a className="button dark" href="#work">View Portfolio</a>
            <a className="button" href="mailto:infoandreeasimon@gmail.com">Contact</a>
          </div>
          <p className="note">A feminine editorial portfolio built around brand strategy, product innovation, and digital media.</p>
        </motion.div>
        <motion.div className="heroImage imageFrame" {...fade} transition={{ duration: .85, delay: .1 }}>
          <Img src="/assets/andreea-hero.jpg" alt="Andreea Simon portrait" />
          <div className="glass">Fashion · Product Development · E-commerce · Digital Storytelling</div>
        </motion.div>
      </section>

      <Marquee items={marqueeItems} />

      <Section id="profile" num="01" title="Profile">
        <div className="split" style={{gap:'2.5rem'}}>
          <motion.div {...fade}>
            <div className="imageFrame" style={{height:'340px',borderRadius:'20px',overflow:'hidden',position:'relative'}}>
              <Img src="/assets/andreea-brand.jpg" alt="Andreea Simon creative strategist" />
            </div>
          </motion.div>
          <motion.div {...fade}>
            <p className="bigText">Creative Arts Leader, Marketer, and Event Producer with international experience across fashion, branding, cultural event production, and strategic communications — from Reebok Boston to Afro Milano Fashion Week to Fashion TV Italia.</p>
            <p className="bodyText">I work at the intersection of aesthetics, consumer insight, and culture. My focus is not only what I create, but how I think: visually, strategically, and with deep cross-cultural understanding.</p>
            <div className="statGrid">
              <div><strong><Counter target={3} /></strong><span>Degrees & Certs</span></div>
              <div><strong><Counter target={4} /></strong><span>Languages Spoken</span></div>
              <div><strong><Counter target={3} /></strong><span>Countries Worked In</span></div>
              <div><strong><Counter target={4} suffix="M+" /></strong><span>Campaign Impressions</span></div>
            </div>
          </motion.div>
        </div>
      </Section>

      <Section id="work" num="02" title="Selected Work">
        <motion.div {...fade} style={{marginBottom:'2rem'}}>
          <p>A curated selection of work across fashion, branding, e-commerce, consumer products, and experiential marketing.</p>
        </motion.div>

        <Project
          number="01"
          title="MÁS by Andreea Simon"
          subtitle="Founder · Brand Strategy · E-commerce"
          body="Independent fashion and lifestyle brand concept developed with a feminine, modern, and aspirational identity. The project includes visual direction, product mockups, brand positioning, and digital advertising ideas."
          image="/assets/billboard.jpg"
          chips={["Brand Identity", "E-commerce", "Digital Advertising", "Visual Direction", "Lifestyle Marketing"]}
        />

        <CaseStudy label="Brand · E-commerce · Visual Direction" title="MÁS by Andreea Simon — Brand Images">
          <div className="editorialGrid" style={{marginTop:'1.5rem'}}>
            <div className="imageFrame"><Img src="/assets/hoodie-close.jpg" alt="MÁS hoodie mockup" /></div>
            <div className="imageFrame tall"><Img src="/assets/hoodie-studio.jpg" alt="MÁS studio mockup" /></div>
            <div className="imageFrame"><Img src="/assets/street-coffee.jpg" alt="MÁS lifestyle mockup" /></div>
          </div>
        </CaseStudy>

        <Project
          reverse
          number="02"
          title="Fashion Week & Event Production"
          subtitle="Fashion Production · Event Marketing"
          body="Experience supporting fashion production, backstage coordination, model preparation, designer communication, and brand presentation. This work shows my ability to manage creative environments and turn fashion moments into brand experiences."
          image="/assets/fashion-backstage.jpg"
          chips={["Event Marketing", "Fashion Production", "Brand Activation", "Creative Operations"]}
        />

        <CaseStudy label="Content Direction · Social Media" title="Digital Lifestyle Campaign">
          <p style={{marginTop:'1rem'}}>A visual campaign direction for modern consumers, using fashion imagery, clean styling, and digital-first brand communication. Designed for social media, e-commerce, and paid digital placements.</p>
          <div className="campaignCard" style={{marginTop:'1.5rem'}}>
            <div className="campaignStat"><span>4M+</span><p>Campaign Impressions</p></div>
            <div className="campaignStat"><span>Gen Z</span><p>Primary Audience</p></div>
            <div className="campaignStat"><span>3</span><p>Platforms</p></div>
            <div className="campaignStat"><span>↑ 68%</span><p>Engagement Rate</p></div>
            <div className="campaignQuote">"Strategy is beautiful when done with purpose."</div>
          </div>
          <div className="chips" style={{marginTop:'1rem'}}>
            <Chip>Social Media</Chip><Chip>Campaign Concept</Chip><Chip>Consumer Targeting</Chip><Chip>Content Creation</Chip>
          </div>
        </CaseStudy>

        <CaseStudy label="✦ Real Experience · Global Marketing Intern · Boston, MA · 2025" title="Reebok: Reclaiming the Cultural Edge">
          <div className="reebokEssay" style={{marginTop:'1.5rem'}}>
            <p className="essayLead">What if Reebok stopped chasing relevance — and started defining it?</p>
            <p>In 2025 I joined Reebok's global marketing team in Boston as a Marketing Intern, working directly on brand strategy and storytelling initiatives for global campaigns. I assisted with trend research, Gen Z consumer insights, mood boards, and cultural trend analysis — contributing to projects at the intersection of sport culture, fashion collaboration, and brand innovation.</p>
            <h4 className="essaySection">The Insight</h4>
            <p>Gen Z and millennial consumers don't just buy products — they buy into worlds. The brands that win aren't the loudest; they're the ones with the most coherent cultural story. Reebok's story is already extraordinary: it dressed hip-hop before hip-hop was mainstream, it outfitted aerobics when women were finally claiming space in sport, and it has collaborated with everyone from Kendrick Lamar to Cottweiler.</p>
            <h4 className="essaySection">The Concept — "ORIGINAL FUTURE"</h4>
            <p>The campaign idea is built on a single tension: <em>roots as rocket fuel</em>. "Original Future" repositions Reebok not as a nostalgia play, but as a brand that uses its past as a launching pad for the next cultural moment.</p>
            <p>Three pillars anchor the concept: <strong>Cultural Archive</strong>, <strong>Luxury Adjacency</strong>, and <strong>Community Futures</strong>.</p>
            <h4 className="essaySection">The Strategy</h4>
            <p>Three phases: cultural re-entry via underground tastemakers → digital storytelling series → luxury capsule collaboration unveiled at a cultural moment.</p>
            <h4 className="essaySection">Why This Matters</h4>
            <p>Brand strategy at its best isn't about selling products — it's about giving people a story to belong to. Reebok already has the story. This concept is about finally telling it with the boldness it deserves.</p>
          </div>
          <div className="essayTags" style={{marginTop:'1.5rem'}}>
            <span className="chip">Brand Repositioning</span>
            <span className="chip">Cultural Strategy</span>
            <span className="chip">Campaign Architecture</span>
            <span className="chip">Luxury Adjacency</span>
            <span className="chip">Gen Z Marketing</span>
            <span className="chip">Trend Forecasting</span>
          </div>
        </CaseStudy>

        <CaseStudy label="✦ Collection Assistant · Poland · Dec 2025 – Mar 2026" title="MODIVO S.A. — Product Development">
          <p style={{fontSize:'1.05rem',lineHeight:1.75,marginTop:'1.5rem'}}>At MODIVO S.A. (CCC Group) in Poland, I supported product development and collection coordination for international fashion and lifestyle brands. My work spanned trend research, market analysis, competitor benchmarking, and cross-functional collaboration between design, sourcing, and external supplier teams.</p>
          <div className="essayTags" style={{marginTop:'1.5rem'}}>
            <span className="chip">Product Development</span>
            <span className="chip">Trend Research</span>
            <span className="chip">Collection Coordination</span>
            <span className="chip">Cross-Functional Teams</span>
            <span className="chip">International Fashion</span>
          </div>
        </CaseStudy>

        <CaseStudy label="Case Study" title="Product Development & Brand Direction">
          <p style={{marginTop:'1rem'}}>Brand and product concept work across consumer products, packaging, visual direction, and market positioning.</p>
          <div className="productBoard" style={{marginTop:'1.5rem'}}>
            {[
              { label: 'Trend Research', icon: '🔍', desc: 'Market analysis, competitor benchmarking & consumer behavior mapping' },
              { label: 'Collection Direction', icon: '✦', desc: 'Mood boards, colorways, material sourcing & visual identity alignment' },
              { label: 'Brand Positioning', icon: '◈', desc: 'Naming, packaging concept, pricing strategy & channel fit' },
              { label: 'Go-to-Market', icon: '→', desc: 'Launch campaigns, influencer seeding & digital rollout strategy' },
              { label: 'Supplier Coordination', icon: '⬡', desc: 'Cross-functional collaboration with design, sourcing & production teams' },
              { label: 'Performance Review', icon: '↑', desc: 'KPI tracking, sell-through analysis & iteration roadmap' },
            ].map(({ label, icon, desc }) => (
              <div key={label} className="productTile">
                <span className="productIcon">{icon}</span>
                <strong>{label}</strong>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </CaseStudy>

        <CaseStudy label="✦ Visual Campaigns" title="Brand Film & Content Direction">
          <p style={{marginTop:'1rem'}}>Editorial campaign footage showcasing fashion storytelling, street style, and brand visual identity — the creative direction behind MÁS by Andreea Simon.</p>
          <div className="videoReel" style={{marginTop:'1.5rem'}}>
            {[
              { src: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3E2sL45EfCZlbUXl76IYkOwEZZf/64c4ffa0-c95f-4bdd-b892-6c5182d0219a.mp4', label: 'Campaign — Hero Film' },
              { src: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3E2sL45EfCZlbUXl76IYkOwEZZf/6413ee4b-946c-4053-8171-f3973ebeb409.mp4', label: 'Campaign — Street Style' },
              { src: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3E2sL45EfCZlbUXl76IYkOwEZZf/0c3a68d0-8e7a-4ecf-938c-c3b6007c7cd4.mp4', label: 'Campaign — Editorial' },
            ].map(({ src, label }) => (
              <div key={src} className="videoCard">
                <video src={src} autoPlay muted loop playsInline />
                <span className="videoLabel">{label}</span>
              </div>
            ))}
          </div>
        </CaseStudy>
      </Section>

      <Marquee items={['Brand Strategy', 'Social Media', 'Fashion', 'Creative Direction', 'Campaigns', 'Storytelling', 'Luxury', 'Innovation', 'Culture', 'Design']} />

      <Section id="skills" num="03" title="Capabilities">
        <motion.div className="skillsGrid" {...fade}>
          <Skill title="Brand Strategy" text="Positioning, storytelling, identity, messaging, and audience definition." />
          <Skill title="Digital Marketing" text="Campaign concepts, social media strategy, e-commerce, and content planning." />
          <Skill title="Consumer Insights" text="Trend forecasting, market research, surveys, and customer behavior analysis." />
          <Skill title="Product Development" text="Concept creation, packaging direction, supplier coordination, and merchandising thinking." />
          <Skill title="Fashion Marketing" text="Event production, brand activations, visual culture, and luxury positioning." />
          <Skill title="Creative Tools" text="Canva, Shopify, Google Analytics, Google Ads, Microsoft Office, and social platforms." />
        </motion.div>
      </Section>

      <Section id="education" num="04" title="Education">
        <motion.div {...fade} style={{marginBottom:'1rem'}}><p>Academic foundation built across the US — with High Honors.</p></motion.div>
        <div className="eduGrid">
          <motion.div className="eduCard" {...fade} transition={{ duration: .7, delay: .0 }}>
            <div className="eduIcon">🎓</div>
            <h3 className="eduDegree">B.S. Business Administration — Marketing</h3>
            <p className="eduSchool">Southern New Hampshire University (SNHU)</p>
            <p className="eduLocation">Manchester, NH</p>
            <div className="eduBadge">Bachelor's Degree</div>
          </motion.div>
          <motion.div className="eduCard" {...fade} transition={{ duration: .7, delay: .15 }}>
            <div className="eduIcon">🏆</div>
            <h3 className="eduDegree">A.A.S. in Digital Marketing</h3>
            <p className="eduSchool">Bellevue College</p>
            <p className="eduLocation">Bellevue, WA</p>
            <div className="eduBadge honors">Graduated with High Honors</div>
          </motion.div>
          <motion.div className="eduCard" {...fade} transition={{ duration: .7, delay: .3 }}>
            <div className="eduIcon">📜</div>
            <h3 className="eduDegree">Certificate in Human Resource Management</h3>
            <p className="eduSchool">Bellevue College</p>
            <p className="eduLocation">Bellevue, WA</p>
            <div className="eduBadge honors">Graduated with High Honors</div>
          </motion.div>
        </div>
        <motion.div className="langSection" {...fade}>
          <h3 className="langTitle">Languages</h3>
          <div className="langGrid">
            <div className="langCard"><span className="langFlag">🇮🇹</span><strong>Italian</strong><span>Native</span></div>
            <div className="langCard"><span className="langFlag">🇷🇴</span><strong>Romanian</strong><span>Native</span></div>
            <div className="langCard"><span className="langFlag">🇺🇸</span><strong>English</strong><span>Professional</span></div>
            <div className="langCard"><span className="langFlag">🇫🇷</span><strong>French</strong><span>Basic</span></div>
          </div>
        </motion.div>
      </Section>

      <section id="contact" className="section contact">
        <motion.div {...fade}>
          <p className="eyebrow">✦ Let's Connect</p>
          <h2>Let's build something memorable.</h2>
          <div className="pinkDivider" />
          <p>Available for marketing, brand strategy, digital media, product development, and creative campaign opportunities.</p>
          <a className="button light" href="mailto:infoandreeasimon@gmail.com">infoandreeasimon@gmail.com</a>
        </motion.div>
      </section>

      <footer className="footer">
        <p>© 2026 <span>Andreea Simon</span> · Marketing Strategist &amp; Brand Builder ✦</p>
      </footer>
    </main>
  );
}

function Project({ number, title, subtitle, body, image, chips, reverse = false }: any) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="projectAccordion"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
    >
      <button className="projectRow" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <div className="projectRowLeft">
          <span className="projectNum">{number}</span>
          <div>
            <h3 className="projectRowTitle">{title}</h3>
            <span className="projectRowSub">{subtitle}</span>
          </div>
        </div>
        <span className={`toggleIcon ${open ? 'open' : ''}`}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <article className={`project ${reverse ? 'reverse' : ''}`} style={{marginTop:'1rem'}}>
              {image && <div className="projectMedia imageFrame"><Img src={image} alt={title} /></div>}
              <div className="projectCopy">
                <p className="eyebrow">{subtitle}</p>
                <p>{body}</p>
                <div className="chips">{chips.map((c: string) => <Chip key={c}>{c}</Chip>)}</div>
              </div>
            </article>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CaseStudy({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="projectAccordion">
      <button className="projectRow" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <div className="projectRowLeft">
          <span className="projectNum" style={{fontSize:'10px'}}>{label}</span>
          <h3 className="projectRowTitle">{title}</h3>
        </div>
        <span className={`toggleIcon ${open ? 'open' : ''}`}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{paddingBottom:'2rem'}}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Skill({ title, text }: { title: string; text: string }) {
  return (
    <motion.div
      className="skill"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <h4>{title}</h4>
      <p>{text}</p>
    </motion.div>
  );
}
