/* BR Lawn Care — Static Chatbot
   No API. Pure keyword-matched knowledge base.
   Short answers, always nudging to the estimate form or phone.
*/
(function () {
  if (window.__brChatbotLoaded) return;
  window.__brChatbotLoaded = true;

  // --- Config ------------------------------------------------------------
  const PHONE_DISPLAY = '252.503.0984';
  const PHONE_TEL = 'tel:2525030984';
  const ESTIMATE_HREF = location.pathname.endsWith('contact.html') ? '#estimate-form' : 'contact.html';
  const ESTIMATE_LABEL = location.pathname.endsWith('contact.html') ? 'Jump to the form' : 'Get Free Estimate';

  // --- Knowledge base ----------------------------------------------------
  // Keep every answer to 1–3 short sentences. Always set a cta.
  const KB = [
    {
      id: 'pricing',
      kws: ['price','pricing','cost','costs','how much','rate','rates','charge','fee','fees','expensive','cheap','affordable','dollar','$','budget','estimate cost','ballpark'],
      a: "Lawn care starts at $55. Every quote is free and fixed — no hidden fees. For an exact number on your yard, the estimate form takes 30 seconds.",
      cta: 'estimate'
    },
    {
      id: 'services',
      kws: ['service','services','what do you do','offer','offerings','do you do','do you offer','provide'],
      a: "Six core services: mowing, tree & stump removal, land clearing, landscape installs, pressure washing, and ongoing property management.",
      cta: 'estimate'
    },
    {
      id: 'mowing',
      kws: ['mow','mowing','mower','cut grass','cutting','grass','trim','trimming','edge','edging','weekly','bi-weekly','biweekly','recurring'],
      a: "We mow one-time, weekly, or bi-weekly. Edging, string-trimming, and blow-off are included every visit. Starts at $55.",
      cta: 'estimate'
    },
    {
      id: 'tree',
      kws: ['tree','trees','stump','stumps','grinding','grind','branch','branches','limb','limbs','takedown','fell','fall','prune','pruning'],
      a: "Full tree takedowns, trimming, and stump grinding — cleanup and haul-off included. Send a photo through the estimate form for the fastest quote.",
      cta: 'estimate'
    },
    {
      id: 'clearing',
      kws: ['clear','clearing','land clearing','lot','brush','overgrown','jungle','debris','haul','junk','trash','wooded'],
      a: "Overgrown lots, brush, downed trees, debris — we clear it for residential and commercial parcels. Free on-site walk-through.",
      cta: 'estimate'
    },
    {
      id: 'landscape',
      kws: ['landscape','landscaping','install','installs','installation','sod','mulch','rock','stone','plant','plants','planting','bed','beds','design','makeover','curb appeal'],
      a: "Sod, mulch, rock, plantings, and full yard makeovers built to last. Share photos + a rough idea and we'll come back with a plan.",
      cta: 'estimate'
    },
    {
      id: 'pressure',
      kws: ['pressure','power wash','wash','washing','driveway','siding','deck','patio','walkway','concrete','stain'],
      a: "Driveways, siding, decks, patios, and walkways — soft-washed or pressure-washed based on the surface.",
      cta: 'estimate'
    },
    {
      id: 'commercial',
      kws: ['commercial','business','office','hoa','rental','rentals','property manager','property management','portfolio','multiple','apartment','complex'],
      a: "Yes — commercial lots, rentals, and HOA common areas. One point of contact, one monthly invoice, consistent schedule.",
      cta: 'estimate'
    },
    {
      id: 'area',
      kws: ['area','areas','location','locations','where','serve','serving','city','town','zip','cover','county','counties','near me','nearby','travel','distance','nc','north carolina','eastern','raleigh','greenville','wilson','rocky mount'],
      a: "We cover Eastern North Carolina and surrounding counties. Not sure if your address is in range? Drop it in the estimate form and we'll confirm same day.",
      cta: 'estimate'
    },
    {
      id: 'insurance',
      kws: ['insure','insured','insurance','liable','liability','license','licensed','bonded','coi','certificate','damage'],
      a: "Fully insured for residential and commercial work. Certificate of insurance available on request for HOAs and property managers.",
      cta: 'estimate'
    },
    {
      id: 'speed',
      kws: ['fast','quick','how long','turnaround','reply','response','soon','same day','today','tomorrow','this week','how quickly'],
      a: "Estimates back within 24 hours, usually same-day. Most jobs get on the schedule the same week.",
      cta: 'estimate'
    },
    {
      id: 'contact',
      kws: ['contact','phone','number','email','text','reach','get in touch','talk','speak'],
      a: "Call or text " + PHONE_DISPLAY + " — or send a few property details through the estimate form. Either way you get a reply within 24 hours.",
      cta: 'both'
    },
    {
      id: 'hours',
      kws: ['hour','hours','open','closed','when','weekend','saturday','sunday','monday','schedule'],
      a: "Mon–Sat, 7am–7pm. Closed Sundays. After-hours messages get a reply first thing next morning.",
      cta: 'estimate'
    },
    {
      id: 'payment',
      kws: ['pay','payment','cash','card','credit','debit','venmo','zelle','cashapp','check','invoice','bill','financing'],
      a: "Cash, check, card, Venmo, or Zelle — whatever's easiest. Commercial accounts run on a monthly invoice.",
      cta: 'estimate'
    },
    {
      id: 'emergency',
      kws: ['emergency','urgent','asap','right now','immediately','storm','fallen tree','down','hurricane','damage'],
      a: "Storm damage or fallen trees — call " + PHONE_DISPLAY + " directly. We triage urgent jobs same-day when we have capacity.",
      cta: 'call'
    },
    {
      id: 'gallery',
      kws: ['before','after','photo','photos','picture','pictures','example','examples','portfolio','work','gallery','see'],
      a: "Scroll up to the Before & After slider for real yards we turned around. Want examples closer to your project? Ask in the estimate form.",
      cta: 'estimate'
    },
    {
      id: 'quality',
      kws: ['good','reliable','trust','trustworthy','review','reviews','reputation','rated','quality','professional'],
      a: "Locally owned, fully insured, and we show up when we say we will. Every job ends with a walk-through before we leave.",
      cta: 'estimate'
    },
    {
      id: 'contract',
      kws: ['contract','agreement','commitment','cancel','cancellation','lock','sign'],
      a: "No long-term contracts on residential mowing — pause or cancel anytime. Commercial accounts get a simple service agreement.",
      cta: 'estimate'
    },
    {
      id: 'equipment',
      kws: ['equipment','gear','mower','tools','truck','trailer'],
      a: "Commercial-grade mowers, trimmers, blowers, and a branded trailer — every job gets the right tool, not a homeowner rig.",
      cta: 'estimate'
    },
    {
      id: 'fertilizer',
      kws: ['fertilize','fertilizer','weed','weeds','seed','seeding','aerate','aeration','treatment','lawn treatment'],
      a: "Seasonal fertilization, over-seeding, and weed control — usually bundled with a mowing plan. Tell us your grass type and we'll build a schedule.",
      cta: 'estimate'
    },
    {
      id: 'leaves',
      kws: ['leaf','leaves','fall cleanup','fall','spring cleanup','cleanup','leaf removal'],
      a: "Fall and spring cleanups: leaves, sticks, bed edge-outs, the works. Book early — these fill up fast in season.",
      cta: 'estimate'
    },
    {
      id: 'gutter',
      kws: ['gutter','gutters','downspout'],
      a: "Gutter cleaning rolls into most pressure washing or seasonal cleanup visits — just add it to the estimate form.",
      cta: 'estimate'
    },
    {
      id: 'fence',
      kws: ['fence','fencing','gate'],
      a: "Fence work isn't our core trade, but we partner with trusted local crews for installs. Ask in the estimate form and we'll point you right.",
      cta: 'estimate'
    },
    {
      id: 'irrigation',
      kws: ['irrigation','sprinkler','sprinklers','watering'],
      a: "We don't install irrigation, but we mow and manage yards with existing systems without issue. Let us know what you're running.",
      cta: 'estimate'
    },
    {
      id: 'owner',
      kws: ['owner','who owns','who runs','who are you','about you','about','story'],
      a: "Locally owned and operated in Eastern NC. Small crew, hands-on — the owner's on almost every job.",
      cta: 'estimate'
    },
    {
      id: 'greeting',
      kws: ['hi','hello','hey','howdy','yo','sup','good morning','good afternoon','good evening'],
      a: "Hey! Ask me about pricing, services, or how fast we can get out there. Or tap one of the quick questions below.",
      cta: null
    },
    {
      id: 'thanks',
      kws: ['thanks','thank you','appreciate','great','cool','awesome','perfect','sounds good','okay','ok'],
      a: "You got it. Want me to pull you over to the estimate form?",
      cta: 'estimate'
    },
    {
      id: 'bye',
      kws: ['bye','goodbye','see ya','later','cya'],
      a: "Catch you later. Estimate form's open 24/7 when you're ready.",
      cta: 'estimate'
    }
  ];

  const FALLBACK = {
    a: "I don't want to guess on that one. Fastest path is the estimate form — include a photo and we'll reply within 24 hours. Or call " + PHONE_DISPLAY + " directly.",
    cta: 'both'
  };

  const QUICK_REPLIES = [
    "How much does it cost?",
    "What areas do you serve?",
    "Are you insured?",
    "How fast can you come out?"
  ];

  // --- Matching ----------------------------------------------------------
  function findAnswer(raw) {
    const text = ' ' + raw.toLowerCase().trim() + ' ';
    let best = null, bestScore = 0;
    for (const entry of KB) {
      let score = 0;
      for (const kw of entry.kws) {
        const needle = kw.toLowerCase();
        if (text.includes(needle)) {
          // score by length so longer phrase matches win
          score += needle.length;
        }
      }
      if (score > bestScore) { bestScore = score; best = entry; }
    }
    return bestScore >= 2 ? best : FALLBACK;
  }

  // --- Styles ------------------------------------------------------------
  const css = `
    .brc-toggle{position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:9999px;
      background:linear-gradient(135deg,#2AA5FF 0%,#1A6FCF 100%);
      box-shadow:0 18px 42px -14px rgba(42,165,255,0.7),inset 0 1px 0 rgba(255,255,255,0.35);
      display:flex;align-items:center;justify-content:center;cursor:pointer;
      z-index:55;border:none;outline:none;color:#fff;
      transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s ease}
    .brc-toggle:hover{transform:scale(1.08);box-shadow:0 22px 52px -14px rgba(42,165,255,0.9),inset 0 1px 0 rgba(255,255,255,0.45)}
    .brc-toggle:active{transform:scale(.96)}
    .brc-toggle:focus-visible{outline:2px solid #fff;outline-offset:3px}
    .brc-toggle .brc-dot{position:absolute;top:2px;right:2px;width:12px;height:12px;border-radius:9999px;
      background:#4ade80;box-shadow:0 0 0 2px #0B0E14;animation:brc-pulse 2s ease-in-out infinite}
    @keyframes brc-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.88)}}
    @media (min-width:640px){.brc-toggle{bottom:24px;right:24px;width:64px;height:64px}}

    .brc-panel{position:fixed;bottom:96px;right:20px;z-index:55;
      width:calc(100vw - 40px);max-width:380px;max-height:min(580px,70vh);
      background:#12161F;border:1px solid rgba(255,255,255,0.08);
      border-radius:22px;overflow:hidden;
      box-shadow:0 40px 80px -20px rgba(0,0,0,0.8),0 2px 0 rgba(255,255,255,0.04) inset;
      display:none;flex-direction:column;
      opacity:0;transform:translateY(14px) scale(.98);transform-origin:bottom right;
      transition:opacity .22s ease,transform .22s cubic-bezier(.16,1,.3,1);
      font-family:'Satoshi',system-ui,sans-serif}
    .brc-panel.brc-open{display:flex;opacity:1;transform:translateY(0) scale(1)}
    @media (min-width:640px){.brc-panel{right:24px;bottom:104px;width:384px}}

    .brc-head{padding:16px 18px;background:linear-gradient(135deg,#2AA5FF 0%,#1A6FCF 100%);color:#fff;
      display:flex;align-items:center;justify-content:space-between;gap:8px}
    .brc-head-title{font-family:'Cabinet Grotesk','Satoshi',sans-serif;font-weight:800;font-size:16px;letter-spacing:-0.02em;line-height:1}
    .brc-head-sub{font-size:11px;opacity:.85;display:flex;align-items:center;gap:6px;margin-top:4px}
    .brc-head-sub::before{content:'';width:6px;height:6px;border-radius:9999px;background:#4ade80}
    .brc-close{background:transparent;border:none;color:rgba(255,255,255,.8);font-size:24px;line-height:1;
      cursor:pointer;padding:4px 8px;border-radius:8px;transition:color .15s ease,background .15s ease}
    .brc-close:hover{color:#fff;background:rgba(255,255,255,.12)}
    .brc-close:focus-visible{outline:2px solid #fff;outline-offset:2px}

    .brc-body{flex:1;overflow-y:auto;padding:16px;background:#0B0E14;
      display:flex;flex-direction:column;gap:10px;scrollbar-width:thin;scrollbar-color:#2AA5FF33 transparent}
    .brc-body::-webkit-scrollbar{width:6px}
    .brc-body::-webkit-scrollbar-thumb{background:#2AA5FF33;border-radius:9999px}

    .brc-msg{max-width:85%;padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.45;
      animation:brc-rise .28s cubic-bezier(.16,1,.3,1) both;overflow-wrap:anywhere}
    .brc-msg.brc-bot{align-self:flex-start;background:#161B26;color:#EAF2FF;
      border:1px solid rgba(255,255,255,0.06);border-bottom-left-radius:6px}
    .brc-msg.brc-user{align-self:flex-end;background:linear-gradient(135deg,#2AA5FF 0%,#1A6FCF 100%);color:#06101E;
      font-weight:600;border-bottom-right-radius:6px}
    @keyframes brc-rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}

    .brc-typing{align-self:flex-start;background:#161B26;padding:12px 16px;border-radius:16px;border-bottom-left-radius:6px;
      border:1px solid rgba(255,255,255,0.06);display:inline-flex;gap:4px;animation:brc-rise .28s cubic-bezier(.16,1,.3,1) both}
    .brc-typing span{width:6px;height:6px;border-radius:9999px;background:#7BC3FF;opacity:.5;
      animation:brc-bounce 1s infinite ease-in-out}
    .brc-typing span:nth-child(2){animation-delay:.15s}
    .brc-typing span:nth-child(3){animation-delay:.3s}
    @keyframes brc-bounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}

    .brc-cta-row{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px;align-self:flex-start;max-width:85%;
      animation:brc-rise .32s cubic-bezier(.16,1,.3,1) both}
    .brc-cta{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:9999px;
      font-size:12.5px;font-weight:700;letter-spacing:-0.01em;text-decoration:none;
      transition:transform .2s ease,background .2s ease,border-color .2s ease}
    .brc-cta-primary{background:#2AA5FF;color:#06101E;
      box-shadow:0 10px 24px -10px rgba(42,165,255,0.65),inset 0 1px 0 rgba(255,255,255,.3)}
    .brc-cta-primary:hover{background:#49B4FF;transform:translateY(-1px)}
    .brc-cta-ghost{background:rgba(255,255,255,.04);color:#EAF2FF;border:1px solid rgba(255,255,255,.14)}
    .brc-cta-ghost:hover{border-color:#2AA5FF;background:rgba(42,165,255,.08)}

    .brc-quick{padding:10px 14px;border-top:1px solid rgba(255,255,255,0.06);background:#0F131B;
      display:flex;flex-wrap:wrap;gap:6px}
    .brc-quick button{background:rgba(42,165,255,0.08);color:#7BC3FF;border:1px solid rgba(42,165,255,0.22);
      padding:7px 12px;border-radius:9999px;font-size:12px;font-weight:600;cursor:pointer;
      transition:background .2s ease,color .2s ease,border-color .2s ease;font-family:inherit}
    .brc-quick button:hover{background:rgba(42,165,255,0.18);color:#fff;border-color:#2AA5FF}
    .brc-quick button:focus-visible{outline:2px solid #2AA5FF;outline-offset:2px}

    .brc-form{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,0.06);background:#12161F}
    .brc-input{flex:1;padding:10px 14px;background:#0B0E14;border:1px solid rgba(255,255,255,0.08);
      border-radius:9999px;color:#EAF2FF;font-size:13.5px;font-family:inherit;outline:none;
      transition:border-color .2s ease}
    .brc-input::placeholder{color:rgba(255,255,255,.3)}
    .brc-input:focus{border-color:#2AA5FF}
    .brc-send{padding:10px 16px;background:#2AA5FF;color:#06101E;border:none;border-radius:9999px;
      font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;
      transition:background .2s ease,transform .2s ease}
    .brc-send:hover{background:#49B4FF}
    .brc-send:active{transform:scale(.96)}
    .brc-send:focus-visible{outline:2px solid #fff;outline-offset:2px}

    @media (max-width:480px){
      .brc-panel{max-height:72vh;bottom:90px}
      .brc-msg{font-size:13.5px}
    }
  `;

  // --- DOM ---------------------------------------------------------------
  function el(tag, props, ...children) {
    const n = document.createElement(tag);
    if (props) for (const k in props) {
      if (k === 'class') n.className = props[k];
      else if (k === 'html') n.innerHTML = props[k];
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), props[k]);
      else n.setAttribute(k, props[k]);
    }
    for (const c of children) if (c != null) n.append(c.nodeType ? c : document.createTextNode(c));
    return n;
  }

  function mount() {
    // styles
    const style = document.createElement('style');
    style.id = 'brc-chatbot-styles';
    style.textContent = css;
    document.head.appendChild(style);

    // toggle
    const toggle = el('button', {
      class: 'brc-toggle',
      type: 'button',
      'aria-label': 'Open BR Lawn Care helper',
      'aria-expanded': 'false',
      'aria-controls': 'brc-panel'
    });
    toggle.innerHTML = `
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span class="brc-dot" aria-hidden="true"></span>
    `;

    // panel
    const panel = el('div', { class: 'brc-panel', id: 'brc-panel', role: 'dialog', 'aria-label': 'BR Lawn Care chat assistant' });

    const head = el('header', { class: 'brc-head' });
    const headLeft = el('div');
    headLeft.appendChild(el('div', { class: 'brc-head-title' }, 'BR Lawn Care Helper'));
    headLeft.appendChild(el('div', { class: 'brc-head-sub' }, 'Eastern NC · Usually replies fast'));
    const close = el('button', { class: 'brc-close', type: 'button', 'aria-label': 'Close chat' });
    close.innerHTML = '&times;';
    head.append(headLeft, close);

    const body = el('div', { class: 'brc-body', id: 'brc-body' });
    const quick = el('div', { class: 'brc-quick', id: 'brc-quick' });

    const form = el('form', { class: 'brc-form', id: 'brc-form' });
    const input = el('input', { class: 'brc-input', type: 'text', id: 'brc-input', placeholder: 'Ask about pricing, services, areas…', autocomplete: 'off', 'aria-label': 'Type your question' });
    const send = el('button', { class: 'brc-send', type: 'submit' }, 'Send');
    form.append(input, send);

    panel.append(head, body, quick, form);

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    // --- State + handlers ---
    let greeted = false;

    function addMsg(text, who) {
      const m = el('div', { class: 'brc-msg brc-' + who }, text);
      body.appendChild(m);
      body.scrollTop = body.scrollHeight;
      return m;
    }

    function addCtaRow(cta) {
      if (!cta) return;
      const row = el('div', { class: 'brc-cta-row' });
      if (cta === 'estimate' || cta === 'both') {
        row.appendChild(el('a', { class: 'brc-cta brc-cta-primary', href: ESTIMATE_HREF }, ESTIMATE_LABEL + ' →'));
      }
      if (cta === 'call' || cta === 'both') {
        row.appendChild(el('a', { class: 'brc-cta brc-cta-ghost', href: PHONE_TEL }, '📞 Call ' + PHONE_DISPLAY));
      }
      body.appendChild(row);
      body.scrollTop = body.scrollHeight;
    }

    function addTyping() {
      const t = el('div', { class: 'brc-typing' });
      t.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(t);
      body.scrollTop = body.scrollHeight;
      return t;
    }

    function renderQuick(items) {
      quick.innerHTML = '';
      if (!items || !items.length) { quick.style.display = 'none'; return; }
      quick.style.display = 'flex';
      for (const q of items) {
        const b = el('button', { type: 'button', onclick: () => { input.value = ''; handleUser(q); renderQuick([]); } }, q);
        quick.appendChild(b);
      }
    }

    function greet() {
      if (greeted) return;
      greeted = true;
      addMsg("Hey — I'm the BR Lawn Care helper. Ask me anything about services, pricing, or scheduling. Short answers, no fluff.", 'bot');
      addCtaRow('estimate');
      renderQuick(QUICK_REPLIES);
    }

    function handleUser(text) {
      const clean = text.trim();
      if (!clean) return;
      addMsg(clean, 'user');
      const t = addTyping();
      const match = findAnswer(clean);
      const delay = 450 + Math.min(900, clean.length * 20);
      setTimeout(() => {
        t.remove();
        addMsg(match.a, 'bot');
        addCtaRow(match.cta);
      }, delay);
    }

    function openPanel() {
      panel.classList.add('brc-open');
      toggle.setAttribute('aria-expanded', 'true');
      greet();
      setTimeout(() => input.focus({ preventScroll: true }), 250);
    }
    function closePanel() {
      panel.classList.remove('brc-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', () => {
      panel.classList.contains('brc-open') ? closePanel() : openPanel();
    });
    close.addEventListener('click', closePanel);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && panel.classList.contains('brc-open')) closePanel();
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const v = input.value;
      input.value = '';
      handleUser(v);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
