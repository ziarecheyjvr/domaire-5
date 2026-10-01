import { useEffect, useReducer, useRef, useState } from 'react';
import villaBefore from './assets/villa-before.png';
import villaNight from './assets/villa-night.webp';
import monogramChalk from './assets/monogram-chalk.png';
import monogramOlive from './assets/monogram-olive.png';
import {
  ADVICE, AFTER, AREAS, FOOTER_COLS, HOTS, MOMENTS, NAV, NUM, SKY,
  STATEMENT, STATEMENT_IMAGES, STEPS, TILES
} from './data.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = t => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;
const fmt = h => { let hh = Math.floor(h), mm = Math.round((h - hh) * 12) * 5; if (mm === 60) { hh++; mm = 0; } return String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0'); };

export default function App({ motion: motionProp = true, showConceptLabels = true }) {
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, vh: window.innerHeight }));
  const [y, setY] = useState(() => window.scrollY);
  const [manualT, setManualT] = useState(0);
  const [manualBA, setManualBA] = useState(1);
  const [hot, setHot] = useState(0);
  const [sel, setSel] = useState(['pool', 'planting', 'okitchen']);
  const [form, setForm] = useState({ name: '', email: '', area: 'Marbella', msg: '', consent: true, sent: false });
  const [, forceUpdate] = useReducer(n => n + 1, 0);

  const heroRef = useRef(null), stRef = useRef(null), txRef = useRef(null), procRef = useRef(null);

  useEffect(() => {
    let raf = null;
    const onR = () => setVp({ w: window.innerWidth, vh: window.innerHeight });
    const onS = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = null; setY(window.scrollY); }); };
    window.addEventListener('resize', onR); window.addEventListener('scroll', onS, { passive: true });
    // Section refs are measured during render, so re-render once they exist and again after fonts settle
    forceUpdate();
    const t = setTimeout(forceUpdate, 300);
    return () => { window.removeEventListener('resize', onR); window.removeEventListener('scroll', onS); cancelAnimationFrame(raf); clearTimeout(t); };
  }, []);

  const m = motionProp && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const { w, vh } = vp, wide = w >= 1180;

  // Progress through a tall sticky section (0 at its top, 1 when its end reaches the viewport bottom)
  const prog = ref => { const el = ref.current; if (!el) return 0; const r = el.getBoundingClientRect(); const run = r.height - vh; return run > 0 ? clamp(-r.top / run, 0, 1) : 0; };
  // Progress of a section entering the viewport
  const enter = (ref, a, b) => { const el = ref.current; if (!el) return 0; const top = el.getBoundingClientRect().top; return clamp((vh * a - top) / (vh * b), 0, 1); };
  const scrollIn = (ref, p) => { const el = ref.current; if (!el) return; window.scrollTo({ top: el.offsetTop + p * (el.offsetHeight - vh), behavior: 'smooth' }); };
  const toggle = id => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Hero: a day at the villa
  const hp = m ? prog(heroRef) : manualT;
  const tt = clamp((hp - .08) / .92, 0, 1), hour = 7 + tt * 15.5;
  let k = 0; while (k < SKY.length - 2 && hour > SKY[k + 1][0]) k++;
  const A = SKY[k], B = SKY[k + 1], f = clamp((hour - A[0]) / (B[0] - A[0]), 0, 1), v = i => lerp(A[i], B[i], f);
  const sky = {
    filter: 'brightness(' + v(1).toFixed(3) + ') saturate(' + v(2).toFixed(3) + ') sepia(' + v(3).toFixed(3) + ')',
    tint: 'rgb(' + [4, 5, 6].map(i => Math.round(v(i))).join(',') + ')',
    glow: v(8).toFixed(3),
    zoom: (1.08 - .08 * hp).toFixed(4)
  };
  // The lit night photograph crossfades in on the way into After Dark
  const night = ease(clamp((hour - 20.4) / 1.2, 0, 1));
  const tp = h => .08 + ((h - 7) / 15.5) * .92;
  let act = 0; MOMENTS.forEach((mo, i) => { if (hour >= mo[0] - 1.2) act = i; });
  const capIn = clamp((hp - .04) / .08, 0, 1);
  const goMoment = h => m ? scrollIn(heroRef, tp(h)) : setManualT(tp(h));
  const dayFrac = clamp((hour - 7) / 13.5, 0, 1), ang = Math.PI * (1 - dayFrac);
  const warm = hour < 9 || hour > 17.5;
  const sun = {
    left: (50 + 50 * Math.cos(ang)).toFixed(2) + '%',
    top: (100 - 100 * Math.sin(ang)).toFixed(2) + '%',
    background: warm ? '#E7A57E' : '#FFF4DE',
    boxShadow: '0 0 24px 6px ' + (warm ? 'rgba(231,165,126,.6)' : 'rgba(255,240,210,.6)'),
    opacity: hour > 20.5 ? 0 : 1
  };

  // Statement
  const sp = m ? enter(stRef, .9, .55) : 1;
  let imgIdx = 0;
  const stTokens = STATEMENT.split(' ').map(t => {
    const mm = t.match(/^\[(\w+)\]$/);
    if (mm) { const d = STATEMENT_IMAGES[mm[1]], q = clamp(sp * 1.6 - (imgIdx++) * .14, 0, 1); return { img: d[0], size: d[1], pos: d[2], alt: d[3], w: (ease(q) * 1.9).toFixed(3) + 'em' }; }
    return { t: t.replace(/\*/g, ''), it: t.startsWith('*') };
  });

  // Transformation
  const tx = m ? prog(txRef) : manualBA;
  const rv = ease(clamp((tx - .05) / .5, 0, 1));
  const bw = wide ? Math.min(w - 560, (vh - 130) * 4 / 3) : Math.min(w - 40, Math.max(220, (vh - 330) * 4 / 3));
  const box = { w: Math.round(Math.max(260, bw)), h: Math.round(Math.max(260, bw) * .75) };
  const after = rv > .6;
  const ring = Math.round(40 + rv * 300);
  const hots = HOTS.map(([x, yy, t, d], i) => { const on = tx > .6 + i * .06; return { x, y: yy, t, d, n: '0' + (i + 1), on, active: hot === i && on }; });
  const goBA = val => m ? scrollIn(txRef, val) : setManualBA(val);

  // Configurator
  const chosen = TILES.filter(d => sel.includes(d[0]));
  const specs = []; chosen.forEach(d => d[6].forEach(s => { if (!specs.includes(s)) specs.push(s); }));
  const hasIn = chosen.some(d => d[1] === 'in'), hasOut = chosen.some(d => d[1] === 'out');
  const summaryLine = !chosen.length ? 'Pick what you would like to change — inside, outside, or both.'
    : hasIn && hasOut ? 'Inside and out, as one joined-up project — one team, one programme.'
    : NUM[specs.length] + ' specialists, one ' + (hasOut ? 'outdoor idea' : 'renovation') + '. We coordinate all of them.';

  // Approach
  const pp = m ? enter(procRef, .85, .7) : 1;

  // Header switches to light once the hero has scrolled past
  const heroEl = heroRef.current, heroEnd = heroEl ? heroEl.offsetTop + heroEl.offsetHeight - 70 : vh;
  const dark = y < heroEnd;
  const hdr = dark ? { bg: 'transparent', blur: 0, ink: '#F6F3EC' } : { bg: 'rgba(246,243,236,.92)', blur: 10, ink: '#232824' };

  const canSend = form.consent && form.name.trim() && form.email.trim();
  const firstName = form.name.trim().split(' ')[0];

  const renderTile = d => {
    const on = sel.includes(d[0]);
    return (
      <button key={d[0]} className={'tile' + (on ? ' is-on' : '')} onClick={() => toggle(d[0])} aria-pressed={on}>
        <span className="tile-media">
          <span role="img" aria-label={d[2]} className="tile-img" style={{ backgroundImage: `url(${d[3]})`, backgroundSize: d[4], backgroundPosition: d[5], filter: (d[7] ? d[7] + ' ' : '') + (on ? 'none' : 'saturate(.55)') }} />
          <span className="tile-check">{on ? '✓' : '+'}</span>
        </span>
        <span className="tile-label">{d[2]}</span>
      </button>
    );
  };

  const selChips = cls => chosen.map(d => (
    <button key={d[0]} className={'chip ' + cls} onClick={() => toggle(d[0])}>{d[2]} <span className="chip-x">×</span></button>
  ));

  return (
    <div className="page">

      <header className="hdr" style={{ '--hdr-ink': hdr.ink, background: hdr.bg, backdropFilter: `blur(${hdr.blur}px)` }}>
        <div className="hdr-inner">
          <a href="#top" aria-label="DOMAIRE home" className="brand">
            <span className="brand-mark">
              <img src={monogramChalk} alt="" style={{ opacity: dark ? 1 : 0 }} />
              <img src={monogramOlive} alt="" style={{ opacity: dark ? 0 : 1 }} />
            </span>
            <span className="brand-text">
              <span className="brand-name">DOMΛIRE</span>
              <span className="brand-tag">DESIGN · BUILD · RENOVATE</span>
            </span>
          </a>
          <nav className="nav">
            {wide && NAV.map(n => <a key={n} href="#" className="nav-link">{n}</a>)}
            <a href="#start" className="nav-cta">Start a project</a>
          </nav>
        </div>
      </header>

      <section id="top" ref={heroRef} className="hero" data-screen-label="01 Hero — A day at the villa" style={{ height: m ? '440vh' : '100vh' }}>
        <div className="hero-stage">
          <img src={AFTER} alt="Concept: Mediterranean villa garden with natural stone pool, planting and outdoor kitchen" className="hero-layer hero-img" style={{ filter: sky.filter, transform: `scale(${sky.zoom})` }} />
          <div className="hero-layer hero-tint" style={{ background: sky.tint }} />
          <div className="hero-layer hero-glow" style={{ opacity: (sky.glow * (1 - night)).toFixed(3) }} />
          <img src={villaNight} alt="" aria-hidden="true" className="hero-layer hero-img" style={{ opacity: night.toFixed(3), transform: `scale(${sky.zoom})` }} />
          <div className="hero-layer hero-shade" />
          <div className="hero-layer hero-shade-night" style={{ opacity: night.toFixed(3) }} />

          <div className="hero-title" style={{ opacity: (1 - clamp(hp / .07, 0, 1)).toFixed(3), transform: `translateY(${Math.round(-hp * 400)}px)` }}>
            <span className="eyebrow">MARBELLA &amp; THE COSTA DEL SOL</span>
            <h1 className="hero-h1">Transforming homes.<br /><em>Inside and out.</em></h1>
          </div>

          <div className="hero-cap" style={{ opacity: capIn.toFixed(3), pointerEvents: capIn > .5 ? 'auto' : 'none' }}>
            <div className="moments">
              {MOMENTS.map(([, label, caption], i) => (
                <div key={label} className="moment" style={{ opacity: i === act ? 1 : 0, transform: `translateY(${i === act ? 0 : i < act ? -24 : 24}px)` }}>
                  <span className="moment-k">{label}</span>
                  <span className="moment-t">{caption}</span>
                </div>
              ))}
            </div>
            <div className="dial-wrap">
              <div className="dial">
                <div className="dial-arc" />
                <div className="dial-sun" style={sun} />
                <div className="dial-horizon" />
              </div>
              <div className="clock">
                <span className="clock-time">{fmt(hour)}</span>
                <span className="clock-phase">{MOMENTS[act][1]}</span>
              </div>
            </div>
          </div>

          <div className="timeline">
            <div className="timeline-track"><div className="timeline-fill" style={{ width: (tt * 100).toFixed(2) + '%' }} /></div>
            <div className="timeline-stops">
              {MOMENTS.map(([h, label], i) => (
                <button key={label} className="timeline-stop" onClick={() => goMoment(h)} style={{ color: i <= act && capIn > .5 ? '#F6F3EC' : 'rgba(246,243,236,.5)' }}>
                  <span className="timeline-time">{fmt(h)}</span>
                  {w >= 700 && <span className="timeline-k">{label}</span>}
                </button>
              ))}
            </div>
          </div>
          {showConceptLabels && <span className="hero-concept concept-mark">CONCEPT VISUALISATION · {m ? 'SCROLL THROUGH THE DAY' : 'TAP A TIME'}</span>}
        </div>
      </section>

      <section ref={stRef} className="statement" data-screen-label="02 Statement">
        <span className="eyebrow">A BETTER WAY TO LIVE AT HOME</span>
        <p className="statement-text">
          {stTokens.map((tk, i) => tk.img
            ? <span key={i} role="img" aria-label={tk.alt} className="statement-img" style={{ width: tk.w, backgroundImage: `url(${tk.img})`, backgroundSize: tk.size, backgroundPosition: tk.pos }} />
            : <span key={i} className={tk.it ? 'statement-em' : undefined}>{tk.t}</span>)}
        </p>
        <div className="statement-foot">
          <p className="copy statement-lede">DOMAIRE designs, builds and renovates homes across Marbella and the Costa del Sol, with a particular specialism in exceptional outdoor spaces.</p>
          <a href="#compose" className="text-link">Compose your project ↓</a>
        </div>
      </section>

      <section ref={txRef} className="tx" data-screen-label="03 The transformation" style={{ height: m ? '300vh' : 'auto' }}>
        <div className="tx-stage">
          <div className="tx-row">
            <div className="tx-copy">
              <span className="eyebrow">FEATURED CONCEPT · BENAHAVÍS</span>
              <h2 className="tx-title">{after ? 'A garden built around how the family lives.' : 'The house was beautiful. The lawn gave it nothing back.'}</h2>
              <div className="toggle">
                {[['BEFORE', 0], ['AFTER', 1]].map(([label, val]) => (
                  <button key={label} className={'toggle-btn' + (after === !!val ? ' is-on' : '')} onClick={() => goBA(val)}>{label}</button>
                ))}
              </div>
              <div className="hot-list" style={{ display: vh >= 700 || !wide ? 'flex' : 'none' }}>
                {hots.map((h, i) => (
                  <button key={h.t} className={'hot-row' + (h.active ? ' is-active' : '')} onMouseEnter={() => setHot(i)} onClick={() => setHot(i)} style={{ opacity: h.on ? 1 : 0 }}>
                    <span className="hot-n">{h.n}</span>
                    <span className="hot-t">{h.t}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="tx-frame" style={{ width: box.w, height: box.h }}>
              <div className="tx-media">
                <img src={villaBefore} alt="Before: villa with an open lawn" />
                <img src={AFTER} alt="After: natural stone pool, planting and outdoor kitchen" style={{ clipPath: `circle(${(rv * 135).toFixed(2)}% at 62% 78%)`, transition: m ? 'none' : 'clip-path 1.4s cubic-bezier(.6,0,.2,1)' }} />
                <div className="tx-ring" style={{ width: ring, height: ring, margin: `${-ring / 2}px 0 0 ${-ring / 2}px`, opacity: rv > 0 && rv < .95 ? (1 - rv).toFixed(2) : 0 }} />
                <span className={'stage-pill' + (after ? ' is-after' : '')}>{after ? 'AFTER' : 'BEFORE'}</span>
                {showConceptLabels && <span className="tx-concept concept-mark">CONCEPT VISUALISATION — NOT A COMPLETED PROJECT</span>}
              </div>
              {hots.map((h, i) => (
                <button key={h.t} className={'hot-pin' + (h.active ? ' is-active' : '')} onMouseEnter={() => setHot(i)} onClick={() => setHot(i)} aria-label={h.t}
                  style={{ left: h.x + '%', top: h.y + '%', transform: `scale(${h.on ? (h.active ? 1.15 : 1) : 0})`, opacity: h.on ? 1 : 0, pointerEvents: h.on ? 'auto' : 'none' }}>
                  <span />
                </button>
              ))}
              {hots.map(h => (
                <div key={h.t} className="hot-card" style={{ left: h.x + '%', top: h.y + '%', transform: `translate(${h.x > 55 ? 'calc(-100% - 28px)' : '28px'},-50%)`, opacity: h.active && box.w > 520 ? 1 : 0 }}>
                  <span className="hot-card-t">{h.t}</span>
                  <span className="hot-card-d">{h.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="compose" className="compose" data-screen-label="04 Compose your project">
        <div className="compose-main">
          <div className="section-head">
            <span className="eyebrow">WHAT WE DO · COMPOSE YOUR PROJECT</span>
            <h2 className="h2">Choose what you'd like<br /><em>to change.</em></h2>
            <p className="copy compose-copy">Outdoor is what we're known for. When the work moves inside, the same team carries it through. Select anything — we'll show you who it takes.</p>
          </div>
          <div className="tile-group">
            <span className="label">OUTSIDE</span>
            <div className="tile-grid">{TILES.filter(d => d[1] === 'out').map(renderTile)}</div>
          </div>
          <div className="tile-group">
            <span className="label">INSIDE</span>
            <div className="tile-grid">{TILES.filter(d => d[1] === 'in').map(renderTile)}</div>
          </div>
        </div>
        <aside className="brief">
          <div className="brief-head">
            <span className="label label--stone">YOUR PROJECT</span>
            <img src={monogramChalk} alt="" />
          </div>
          <div className="brief-count-row">
            <span className="brief-count">{String(chosen.length).padStart(2, '0')}</span>
            <span className="brief-word">{chosen.length === 1 ? 'element' : 'elements'}</span>
          </div>
          <div className="chips">
            {selChips('chip--outline')}
            {!chosen.length && <span className="brief-empty">Nothing selected yet.</span>}
          </div>
          <div className="brief-specs">
            <span className="label label--stone">SPECIALISTS WE BRING TOGETHER · {specs.length}</span>
            <div className="chips">{specs.map(s => <span key={s} className="spec">{s}</span>)}</div>
          </div>
          <p className="brief-summary">{summaryLine}</p>
          <a href="#start" className="pill-cta">Continue with this brief <span className="pill-cta-arrow">→</span></a>
        </aside>
      </section>

      <section ref={procRef} className="approach" data-screen-label="05 Approach">
        <div className="approach-inner">
          <div className="approach-head">
            <div className="section-head">
              <span className="eyebrow">OUR APPROACH</span>
              <h2 className="h2">One project.<br /><em>The right people.</em></h2>
            </div>
            <p className="copy approach-copy">Good projects need clear scope, the right specialists, realistic decisions and disciplined delivery.</p>
          </div>
          <div className="steps">
            <div className="steps-track"><div className="steps-fill" style={{ width: (pp * 100).toFixed(1) + '%' }} /></div>
            <div className="steps-grid">
              {STEPS.map(([n, t, d], i) => (
                <div key={n} className={'step' + (pp * 5.4 > i + .4 ? ' is-on' : '')}>
                  <span className="step-n">{n}</span>
                  <span className="step-t">{t}</span>
                  <span className="step-d">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="areas" data-screen-label="06 Areas band">
        <div className="marquee" style={{ transform: `translateX(${m ? -Math.round((y * .35) % 2400) : 0}px)` }}>
          {[...AREAS, ...AREAS, ...AREAS].map((t, i) => (
            <span key={i} className="marquee-item"><span className="marquee-word">{t}</span><span className="marquee-dot">●</span></span>
          ))}
        </div>
        <div className="areas-foot">
          <span className="label label--stone">SELECTED PROJECTS ACROSS THE WESTERN COSTA DEL SOL</span>
          <div className="advice">{ADVICE.map(a => <a key={a} href="#" className="advice-link">{a}</a>)}</div>
        </div>
      </section>

      <section id="start" className="enquiry" data-screen-label="07 Enquiry">
        {!form.sent ? (
          <div className="enquiry-grid">
            <div className="enquiry-intro">
              <span className="eyebrow">START A PROJECT</span>
              <h2 className="h2">Tell us what you would<br /><em>like to change.</em></h2>
              <p className="copy enquiry-copy">Your brief carries over from above. Add a few words about the property and we'll come back to you personally.</p>
              <div className="chips">
                {selChips('chip--solid')}
                <a href="#compose" className="chip--add">+ Add to brief</a>
              </div>
            </div>
            <div className="form">
              <div className="form-row">
                <label className="field">NAME<input className="input" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Your name" /></label>
                <label className="field">EMAIL OR WHATSAPP<input className="input" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="How to reach you" /></label>
              </div>
              <div className="field-group">
                <span className="field">WHERE IS THE PROPERTY?</span>
                <div className="chips">
                  {[...AREAS.slice(0, 3), 'Elsewhere'].map(t => (
                    <button key={t} className={'area-btn' + (form.area === t ? ' is-on' : '')} onClick={() => setField('area', t)}>{t}</button>
                  ))}
                </div>
              </div>
              <label className="field">ABOUT THE PROPERTY<textarea className="input" value={form.msg} onChange={e => setField('msg', e.target.value)} rows={3} placeholder="Levels, views, what isn't working today…" /></label>
              <div className="form-foot">
                <label className="consent"><input type="checkbox" checked={form.consent} onChange={() => setField('consent', !form.consent)} />I agree to the privacy policy.</label>
                <button className={'send' + (canSend ? ' is-ready' : '')} onClick={() => canSend && setField('sent', true)}>Send my brief <span className="send-arrow">→</span></button>
              </div>
            </div>
          </div>
        ) : (
          <div className="thanks">
            <img src={monogramOlive} alt="" />
            <p>Thank you{firstName ? ', ' + firstName : ''}. Your brief for {form.area === 'Elsewhere' ? 'the Costa del Sol' : form.area} is with us — we'll be in touch personally.</p>
            <button className="ghost-btn" onClick={() => setField('sent', false)}>Edit brief</button>
          </div>
        )}
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <img src={monogramChalk} alt="" />
              <p className="footer-motto">Transforming homes.<br />Inside and out.</p>
              <p className="footer-blurb">Design, build and renovation across Marbella and the Costa del Sol, specialising in outdoor transformations and complete villa renovations.</p>
            </div>
            {FOOTER_COLS.map(col => (
              <div key={col.h} className="footer-col">
                <span className="label">{col.h}</span>
                {col.items.map(i => <a key={i} href="#" className="footer-link">{i}</a>)}
              </div>
            ))}
          </div>
          <div className="footer-base"><span>© DOMAIRE · DESIGN · BUILD · RENOVATE</span><span>Privacy · Legal notice · Cookies · Instagram · LinkedIn · English / Español</span></div>
        </div>
      </footer>
    </div>
  );
}
