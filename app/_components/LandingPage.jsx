'use client'
import { useState, useEffect, useRef } from "react";
import QuizGame from "./QuizGame";
import { useRouter } from "next/navigation";

const SCORES_PREVIEW = [
  { label: "Clarity", score: 3, note: "Stated but not structured. The argument needs a spine." },
  { label: "User impact", score: 4, note: "You considered the end user more than most do." },
  { label: "Defensibility", score: 2, note: "Collapsed under the second round of questioning." },
  { label: "Blind spots", score: null, note: "Mobile edge cases were never addressed." },
];
const STEPS = [
  { n: "01", title: "State your rationale", body: "Describe the design decision you have made and why. A layout choice, a pattern, a product call. Any decision counts." },
  { n: "02", title: "Defend under pressure", body: "The opponent pushes back. Three rounds. Each harder than the last. You respond, clarify, fight for your position." },
  { n: "03", title: "Take the verdict", body: "A structured score across four dimensions. Where your argument held. Where it cracked. What you missed entirely." },
];
const TESTIMONIALS = [
  { quote: "I was certain about a navigation decision I had spent two weeks defending. By round two I could not hold my own argument together. We redesigned it the next morning.", name: "Sara K.", role: "Senior Product Designer" },
  { quote: "The verdict flagged a blind spot I had been quietly skirting for a month. Cheaper and more honest than any design review I have sat through.", name: "Marcus T.", role: "UX Lead, fintech" },
  { quote: "It does not tell you what to do. It makes you realize you did not actually know why you were doing it. That is the uncomfortable part. Also the useful part.", name: "Priya M.", role: "Head of Design" },
];
const AUDIENCES = [
  {
    id: "leads", label: "Senior Designers",
    hook: "Your decisions carry weight. Test them before others do.",
    body: "You have defended that decision four times this week. To your PM. To your lead. To yourself. But have you actively tried to break it? Stress-testing your own rationale before someone else does is what separates a designer who ships from one who stands behind what they ship.",
  },
  {
    id: "solo", label: "Freelancers",
    hook: "Solo does not mean unchallenged.",
    body: "When you work alone, there is no one to tell you your decision is wrong. Which sounds like freedom — until you are three weeks into implementation and the core assumption was never questioned. Solo does not have to mean unchallenged.",
  },
  {
    id: "pm", label: "Product Managers",
    hook: "You are making design decisions.",
    body: "You called them product decisions. But someone had to choose what is above the fold. Someone picked the pattern. Someone decided what the empty state says. That was you. PMs who can clearly articulate design rationale under pressure are rare — and valuable.",
  },
  {
    id: "junior", label: "Junior Designers",
    hook: "The gap is not Figma skills.",
    body: "The gap between junior and mid-level is being able to stand in a review, explain clearly why you made the decision you made, and not fold when someone pushes back. That is a trainable skill. This is how you train it.",
  },
  {
    id: "founders", label: "Founders",
    hook: "You made five UX calls this week.",
    body: "You do not have a designer. You still made decisions about button placement, onboarding flow, empty state copy, pricing layout. Nobody challenged any of them. The absence of pushback is not validation. It is silence.",
  },
];

const DEMO_ROUNDS = [
  { round: 1, yourLabel: "Your rationale", yours: "We should use a carousel here. It is a familiar pattern users already know.", counter: "Familiarity is not the same as effectiveness. Carousels are a well-documented way to hide content. Most users never interact past the first frame. You have chosen a pattern users recognise, not one that serves them.", action: "Defend your position" },
  { round: 2, yourLabel: "Your defense", yours: "We tested it with users and they said they liked the visual variety. Engagement metrics were higher.", counter: "Reported preference and actual task completion diverge constantly in UX research. Higher engagement with a carousel often measures confusion or accidental swipes, not satisfaction or goal achievement.", action: "Push back" },
  { round: 3, yourLabel: "Final defense", yours: "Every major competitor in our space uses this pattern. It is an industry standard at this point.", counter: "You have now cited familiarity, metrics, and convention. None of which address whether users actually achieve their goal. Industry standard means widely adopted. It has never meant validated.", action: "Verdict incoming" },
];

function DSLogo({ size = 28, light = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M3 6 L14 14 L3 22" stroke={light ? "rgba(249,247,242,0.5)" : "#918D87"} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M25 6 L14 14 L25 22" stroke="#C63B15" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}


function useCountUp(target, duration) {
  var dur = duration || 1200;
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          observer.disconnect();
          let startTime = null;
          const step = (ts) => {
            if (!startTime) startTime = ts;
            const p = Math.min((ts - startTime) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return { count, ref };
}

function ProofNum({ target, suffix, special }) {
  const { count, ref } = useCountUp(target || 0, 1100);
  if (special) {
    return <span className="ds-proof-special" ref={ref}>{special}</span>;
  }
  const formatted = (target >= 1000) ? count.toLocaleString() : count;
  return <span className="ds-proof-num" ref={ref}>{formatted}{suffix || ""}</span>;
}

function AudienceSection() {
  const [active, setActive] = useState(0);
  const aud = AUDIENCES[active];
  return (
    <div>
      <div className="ds-aud-tabs">
        {AUDIENCES.map((a, i) => (
          <button
            key={a.id}
            className={"ds-aud-tab" + (i === active ? " ds-aud-tab-on" : "")}
            onClick={() => setActive(i)}
          >
            {a.label}
          </button>
        ))}
      </div>
      <div key={active}>
        <h3 className="ds-aud-hook" style={{ animation: "fade-up 0.3s ease both" }}>{aud.hook}</h3>
        <p className="ds-aud-body" style={{ animation: "fade-up 0.3s ease both 0.06s" }}>{aud.body}</p>
      </div>
    </div>
  );
}

function TypewriterText({ text, startDelay = 0 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    const start = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, 75);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(start);
  }, []);
  if (done) return <span className="ds-fight-loop">{text}</span>;
  return <>{displayed}{!done && <span className="ds-cursor">|</span>}</>;
}

function AnimatedCounter({ text }) {
  // Simple reliable render — entrance handled by .spar-counter-body CSS animation
  return <>{text}</>;
}

function Pips({ score, total = 5, size = "normal", animate = false }) {
  const w = size === "sm" ? 14 : 28;
  const h = size === "sm" ? 3 : 5;
  return (
    <div style={{ display: "flex", gap: size === "sm" ? 3 : 5 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: w, height: h,
          background: i < score ? "var(--ink)" : "var(--border)",
          transformOrigin: "left",
          transform: "scaleX(0)",
          animation: animate && i < score
            ? "pip-fill 0.3s ease " + (i * 90 + 150) + "ms both"
            : "pip-fill 0.15s ease " + (i * 25) + "ms both",
        }} />
      ))}
    </div>
  );
}

function useScrollReveal(deps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll(".ds-reveal");
      if (!els.length) return;
      const observer = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("ds-in-view"); observer.unobserve(e.target); }
        }),
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
      );
      els.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 150);
    return () => clearTimeout(timer);
  }, deps);
}

function downloadSession(session) {
  const dateStr = session.created_at
    ? new Date(session.created_at).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
    : "Unknown date";

  const verdict = session.verdict
    ? (typeof session.verdict === "string" ? JSON.parse(session.verdict) : session.verdict)
    : null;

  const exchanges = session.exchanges
    ? (typeof session.exchanges === "string" ? JSON.parse(session.exchanges) : session.exchanges)
    : [];

  let scoreDisplay = "No verdict";
  if (verdict && verdict.clarity && verdict.userImpact && verdict.defensibility) {
    const avg = Math.round((verdict.clarity + verdict.userImpact + verdict.defensibility) / 3);
    scoreDisplay = avg + " / 5";
  }

  const SEP = "=".repeat(52);
  const DIV = "-".repeat(40);
  const lines = [
    "DESIGN SPARRING — SESSION RECORD",
    SEP, "",
    "Date:   " + dateStr,
    "Score:  " + scoreDisplay,
    "", SEP,
    "YOUR RATIONALE",
    SEP,
    session.rationale || "",
    "",
  ];

  if (exchanges.length > 0) {
    lines.push(SEP);
    lines.push("FULL EXCHANGE");
    lines.push(SEP);
    lines.push("");
    exchanges.forEach((ex) => {
      if (ex.role === "counter") {
        lines.push("THE COUNTER — Round " + ex.round);
        lines.push(DIV);
        lines.push(ex.text);
        lines.push("");
      } else if (ex.role === "user") {
        lines.push("YOUR DEFENSE — Round " + ex.round);
        lines.push(DIV);
        lines.push(ex.text);
        lines.push("");
      }
    });
  }

  if (verdict) {
    lines.push(SEP);
    lines.push("THE VERDICT");
    lines.push(SEP);
    lines.push("");
    if (verdict.clarity)       lines.push("Clarity:        " + verdict.clarity + " / 5");
    if (verdict.userImpact)    lines.push("User Impact:    " + verdict.userImpact + " / 5");
    if (verdict.defensibility) lines.push("Defensibility:  " + verdict.defensibility + " / 5");
    if (verdict.blindSpots?.length) {
      lines.push("");
      lines.push("Blind Spots:");
      verdict.blindSpots.forEach((b) => lines.push("  x " + b));
    }
    if (verdict.summary) {
      lines.push("");
      lines.push("Summary:");
      lines.push(verdict.summary);
    }
    lines.push("");
  }

  lines.push(SEP);
  lines.push("design-sparring.org");

  const slug = dateStr.replace(/\s+/g, "-").toLowerCase();
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sparring-" + slug + ".txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function callSpar(messages, isVerdict = false) {
  const res = await fetch("/api/spar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, isVerdict }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Connection failed");
  return data.text;
}

function SparringInterface({ user, onExit, onSignup }) {
  const isPaid = user?.plan === "paid";
  const maxRounds = isPaid ? 3 : 1;
  const [status, setStatus] = useState("input");
  const [rationale, setRationale] = useState("");
  const [exchanges, setExchanges] = useState([]);
  const [defenseInput, setDefenseInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const roundsDone = exchanges.filter((e) => e.role === "counter").length;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [exchanges, loading, verdict]);

  const buildMessages = (extraUser) => {
    const msgs = [{ role: "user", content: "Design decision: " + rationale }];
    const counters = exchanges.filter((e) => e.role === "counter");
    const defenses = exchanges.filter((e) => e.role === "user");
    for (let i = 0; i < counters.length; i++) {
      msgs.push({ role: "assistant", content: counters[i].text });
      if (defenses[i]) msgs.push({ role: "user", content: defenses[i].text });
    }
    if (extraUser) msgs.push({ role: "user", content: extraUser });
    return msgs;
  };

  const startFight = async () => {
    if (!rationale.trim() || rationale.trim().length < 15) { setError("Give the opponent something to work with."); return; }
    setError(null); setLoading(true); setStatus("fighting");
    try {
      const text = await callSpar([{ role: "user", content: "Design decision: " + rationale }]);
      setExchanges([{ role: "counter", text, round: 1 }]);
      if (maxRounds === 1) setStatus("wall");
    } catch (e) { setError(e.message || "Connection failed."); setStatus("input"); }
    finally { setLoading(false); }
  };

  const submitDefense = async () => {
    if (!defenseInput.trim()) return;
    const nextRound = roundsDone + 1;
    const newEx = [...exchanges, { role: "user", text: defenseInput, round: nextRound }];
    setExchanges(newEx); setDefenseInput(""); setLoading(true); setError(null);
    try {
      const msgs = buildMessages(defenseInput);
      if (nextRound >= maxRounds) {
        const counterText = await callSpar(msgs);
        const finalEx = [...newEx, { role: "counter", text: counterText, round: nextRound + 1 }];
        setExchanges(finalEx);
        const vMsgs = [{ role: "user", content: "Verdict needed.\n\nRationale: " + rationale + "\n\n" + finalEx.map((e) => (e.role === "counter" ? "Counter" : "Designer") + " (Round " + e.round + "): " + e.text).join("\n\n") }];
        const vRaw = await callSpar(vMsgs, true);
        try {
          const parsedVerdict = JSON.parse(vRaw.replace(/```json|```/g, "").trim());
          setVerdict(parsedVerdict);
          setStatus("verdict");
          // Save session to history for paid users
          if (isPaid) {
            fetch("/api/sessions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ rationale, exchanges: finalEx, verdict: parsedVerdict }),
            }).catch((e) => console.error("Session save error:", e));
          }
        } catch { setError("Verdict parsing failed."); setStatus("verdict"); }
      } else {
        const text = await callSpar(msgs);
        setExchanges((prev) => [...prev, { role: "counter", text, round: nextRound + 1 }]);
      }
    } catch (e) { setError(e.message || "Connection failed."); }
    finally { setLoading(false); }
  };

  return (
    <div className="spar-page">
      <div className="spar-header">
        <button className="spar-exit" onClick={onExit}>Back</button>
        <div className="spar-progress">
          <div className="spar-prog-bar">
            {[0, 1, 2].map((r) => (
              <div key={r} className={"spar-prog-pip" + (roundsDone > r ? " spar-prog-pip-done" : roundsDone === r && status === "fighting" ? " spar-prog-pip-active" : "")} />
            ))}
          </div>
          <span className="spar-prog-label">
            {status === "input" ? "Ready" : status === "verdict" ? "Complete" : "Round " + (roundsDone + 1) + " / " + maxRounds}
          </span>
        </div>
      </div>
      {status === "input" && (
        <div>
          <h2 className="spar-prompt-title">State your rationale</h2>
          <p className="spar-prompt-sub">Describe a design decision you have made and why. Be specific.</p>
          <textarea className="spar-textarea" placeholder="e.g. We decided to use a bottom navigation bar because users need fast access to the four main sections..." value={rationale} onChange={(e) => { setRationale(e.target.value); setError(null); }} />
          {error && <div className="spar-error"><p className="spar-error-text">{error}</p></div>}
          <div className="spar-submit-row"><button className="ds-btn-primary" onClick={startFight} disabled={rationale.trim().length < 15}>Enter the ring</button></div>
          {!isPaid && <p className="spar-char-hint">Free tier - 1 round. Upgrade for 3 rounds and verdict scoring.</p>}
        </div>
      )}
      {(status === "fighting" || status === "wall" || status === "verdict") && (
        <>
          <div className="spar-thread">
            <div className="spar-turn">
              <span className="spar-turn-lbl">Your rationale</span>
              <p className="spar-turn-text spar-turn-text-user">"{rationale}"</p>
            </div>
            {exchanges.map((ex, i) => (
              <div className="spar-turn" key={i}>
                {ex.role === "counter" ? (
                  <>
                    <span className="spar-turn-lbl spar-turn-lbl-counter">The Counter - Round {ex.round}</span>
                    <div className="spar-counter-body" key={ex.text}>
                      <p className="spar-turn-text spar-turn-text-counter"><AnimatedCounter text={ex.text} /></p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="spar-turn-lbl">Your defense - Round {ex.round}</span>
                    <p className="spar-turn-text spar-turn-text-user">"{ex.text}"</p>
                  </>
                )}
              </div>
            ))}
          </div>
          {loading && (
            <div className="spar-loading">
              <div className="spar-loading-dots"><div className="spar-loading-dot" /><div className="spar-loading-dot" /><div className="spar-loading-dot" /></div>
              <span className="spar-loading-text">{roundsDone >= maxRounds ? "Calculating verdict..." : "Building counter..."}</span>
            </div>
          )}
          {error && <div className="spar-error"><p className="spar-error-text">{error}</p></div>}
          {!loading && status === "fighting" && roundsDone < maxRounds && exchanges[exchanges.length - 1]?.role === "counter" && (
            <div className="spar-defense">
              <span className="spar-defense-lbl">{roundsDone < maxRounds - 1 ? "Defend your position - Round " + (roundsDone + 1) : "Final defense - Round " + (roundsDone + 1)}</span>
              <textarea className="spar-textarea" placeholder="Defend your position..." value={defenseInput} onChange={(e) => setDefenseInput(e.target.value)} style={{ minHeight: 120 }} autoFocus />
              <div className="spar-submit-row"><button className="ds-btn-primary" onClick={submitDefense} disabled={!defenseInput.trim()}>{roundsDone < maxRounds - 1 ? "Push back" : "Final answer"}</button></div>
            </div>
          )}
          {status === "wall" && (
            <div className="spar-wall">
              <h3 className="spar-wall-title">Round 1 complete.</h3>
              <p className="spar-wall-sub">The free tier stops here. Upgrade to Sparring Partner for two more rounds and a scored verdict.</p>
              <div className="spar-wall-ctas"><button className="ds-btn-primary" onClick={onSignup}>Upgrade - $9/mo</button><button className="ds-btn-outline" onClick={onExit}>End session</button></div>
            </div>
          )}
          {status === "verdict" && verdict && (
            <div className="spar-verdict">
              <div className="spar-verdict-header"><h3 className="spar-verdict-title">The Verdict</h3><p className="spar-verdict-sub">After three rounds, here is how your argument held up.</p></div>
              <div className="spar-verdict-scores">
                {[{ label: "Clarity", score: verdict.clarity }, { label: "User impact", score: verdict.userImpact }, { label: "Defensibility", score: verdict.defensibility }].map((s, idx) => (
                  <div className="spar-verdict-row" key={s.label} style={{ animationDelay: (idx * 0.1) + "s" }}>
                    <span className="spar-verdict-lbl">{s.label}</span>
                    <Pips score={s.score} total={5} animate={true} />
                  </div>
                ))}
              </div>
              {verdict.blindSpots?.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div className="spar-blind-title">Blind spots</div>
                  {verdict.blindSpots.map((b, i) => <p className="spar-blind-item" key={i}>{b}</p>)}
                </div>
              )}
              {verdict.summary && <div className="spar-verdict-summary">{verdict.summary}</div>}
              <div className="spar-verdict-actions">
                <button className="ds-btn-primary" onClick={() => { setStatus("input"); setExchanges([]); setRationale(""); setVerdict(null); setDefenseInput(""); }}>New session</button>
                <button className="ds-btn-outline" onClick={onExit}>Back to home</button>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
}

function LegalPage({ page, onBack }) {
  useEffect(() => { window.scrollTo(0, 0); }, [page]);
  return (
    <div className="ds-legal">
      <button className="ds-back-btn" onClick={onBack}>Back</button>
      {page === "privacy" && <><h1 className="ds-legal-title">Privacy Policy</h1><span className="ds-legal-date">Effective date: May 2026</span><h2>What this is</h2><p>Design Sparring collects the minimum information necessary to provide the service.</p><h2>What we collect</h2><p>We collect your email address when you create an account, used solely for authentication via magic links. We store your sparring session data for up to 30 days on the paid tier.</p><h2>How we use your data</h2><ul><li>To send you a magic link for authentication</li><li>To associate your sessions with your account</li><li>To process payments securely through our payment provider</li></ul><h2>Data retention</h2><p>Your account is retained until you delete it. Session data is deleted automatically after 30 days.</p><h2>Contact</h2><p><a href="mailto:contact@design-sparring.org">contact@design-sparring.org</a></p></>}
      {page === "terms" && <><h1 className="ds-legal-title">Terms of Service</h1><span className="ds-legal-date">Effective date: May 2026</span><h2>Acceptance</h2><p>By creating an account or using Design Sparring, you agree to these terms.</p><h2>What the service is</h2><p>Design Sparring provides AI-generated counter-arguments and structured scoring for design decisions. It is a decision-support tool, not professional advice.</p><h2>Accounts and billing</h2><p>Accounts are available on the paid plan only. Cancel anytime. No refunds for partial months.</p><h2>Free tier</h2><p>The free tier (1 round, no account) is available without registration. No session data is retained.</p><h2>Contact</h2><p><a href="mailto:contact@design-sparring.org">contact@design-sparring.org</a></p></>}
      {page === "cookies" && <><h1 className="ds-legal-title">Cookie Policy</h1><span className="ds-legal-date">Effective date: May 2026</span><h2>What we use</h2><p>Design Sparring uses only essential cookies. No advertising, no cross-site tracking.</p><ul><li>Session cookie - keeps you authenticated</li><li>CSRF token - security against cross-site request forgery</li><li>Cookie consent - stores your preference</li></ul><h2>Contact</h2><p><a href="mailto:contact@design-sparring.org">contact@design-sparring.org</a></p></>}
    </div>
  );
}

export default function LandingPage({ user: initialUser, authStatus }) {
  const [user, setUser] = useState(initialUser || null);
  const [modal, setModal] = useState(null);
  const [email, setEmail] = useState("");
  const [authStep, setAuthStep] = useState("form");
  const [acctOpen, setAcctOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState(false);
  const [deleteAcknowledged, setDeleteAcknowledged] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState("home");
  const [cookiesAccepted, setCookiesAccepted] = useState(true); // true by default avoids flash
  const [activeRound, setActiveRound] = useState(0);
  const [sessions, setSessions] = useState(null);
  const [upgrading, setUpgrading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check cookie consent from localStorage
    const stored = localStorage.getItem("ds_cookies_consent");
    if (!stored) setCookiesAccepted(false);
    // Inject minimal mobile nav overrides
    const s = document.createElement("style");
    s.id = "ds-mobile-overrides";
    s.textContent = `
  /* mobile nav overrides */
  @media (max-width: 768px) {
    .ds-quiz-nav-pill { font-size: 11px; padding: 5px 10px; white-space: normal; text-align: center; line-height: 1.3; max-width: 110px; }
    .ds-account-btn .ds-avatar + * { display: none; }
    .ds-account-btn { padding: 6px 10px; }
    .ds-nav { gap: 6px; padding: 12px 14px; }
  }
`;
    if (!document.getElementById("ds-mobile-overrides")) document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch {} };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveRound((r) => (r + 1) % 3), 4000);
    return () => clearInterval(interval);
  }, []);

  // Cross-tab magic link sync — if another tab signs in, refresh this one
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "ds_auth_sync" && !user) { router.refresh(); }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [user]);

  useEffect(() => {
    if (!authStatus) return;
    if (authStatus === "success") {
      localStorage.setItem("ds_auth_sync", Date.now().toString());
      router.refresh();
      window.history.replaceState({}, "", "/");
    } else if (authStatus === "upgraded") {
      // Payment succeeded — refresh JWT from DB (handles webhook race condition)
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");
      fetch("/api/auth/refresh" + (sessionId ? "?session_id=" + sessionId : ""))
        .then((r) => r.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            showToast("Welcome to Sparring Partner. Full access unlocked.");
          }
          window.history.replaceState({}, "", "/");
        })
        .catch(() => {
          router.refresh();
          window.history.replaceState({}, "", "/");
        });
    } else if (authStatus === "expired") {
      setModal("auth-expired");
      window.history.replaceState({}, "", "/");
    } else {
      showToast("Something went wrong. Please try signing in again.");
      window.history.replaceState({}, "", "/");
    }
  }, [authStatus]);

  useEffect(() => {
    if (authStatus === "upgraded") return; // Coming from Stripe — refresh in progress
    if (user && user.plan !== "paid") { setModal("payment-gate"); }
  }, [user?.email, authStatus]);

  useEffect(() => {
    if (modal === "history" && user?.plan === "paid") {
      setSessions(null);
      fetch("/api/sessions")
        .then((r) => r.json())
        .then((d) => setSessions(d.sessions || []))
        .catch(() => setSessions([]));
    }
  }, [modal]);

  useScrollReveal([page]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const openModal = (t) => { setModal(t); setEmail(""); setAuthStep("form"); setDeleteStep(false); setAcctOpen(false); };
  const closeModal = () => { setModal(null); setEmail(""); setAuthStep("form"); setDeleteStep(false); setDeleteAcknowledged(false); setAuthError(null); };
  const goPage = (p) => { setPage(p); window.scrollTo(0, 0); };

  const handleAuth = async () => {
    if (!email.trim() || !email.includes("@")) return;
    setAuthError(null);
    const res = await fetch("/api/auth/send-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, mode: modal }),
    });
    if (res.ok) {
      setAuthStep("sent");
    } else {
      const data = await res.json();
      if (data.error === "exists") {
        setAuthError("An account with this email already exists.");
      } else if (data.error === "not_found") {
        setAuthError("No account found with this email.");
      } else {
        showToast("Something went wrong. Try again.");
      }
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null); setAcctOpen(false); showToast("Signed out.");
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        showToast(data.error || "Payment unavailable. Stripe may not be configured.");
        setUpgrading(false);
      }
    } catch {
      showToast("Connection error. Try again.");
      setUpgrading(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    const res = await fetch("/api/sessions?id=" + sessionId, { method: "DELETE" });
    if (res.ok) setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleCancelSub = async () => {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else showToast("Something went wrong.");
  };

  const handleDelete = async () => {
    if (!deleteStep) { setDeleteStep(true); return; }
    const res = await fetch("/api/account", { method: "DELETE" });
    if (res.ok) { setUser(null); closeModal(); showToast("Account deleted."); }
  };

  const handleGoFree = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null); closeModal(); showToast("Using free tier. No account needed.");
  };

  const currentRound = DEMO_ROUNDS[activeRound];

  return (
    <div className="ds" onClick={() => acctOpen && setAcctOpen(false)}>
      {/* NAV */}
      <nav className="ds-nav">
        <div className="ds-logo-wrap" onClick={() => goPage("home")}>
          <DSLogo size={26} />
          <span className="ds-logo">Design Sparring</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button className="ds-quiz-nav-pill" onClick={() => goPage("quiz")}>Take a test: your decision style</button>
          {user && user.plan === "paid" ? (
            <div className="ds-account-wrap" onClick={(e) => e.stopPropagation()}>
              <button className="ds-account-btn" onClick={() => setAcctOpen(!acctOpen)}>
                <div className="ds-avatar">{user.email[0].toUpperCase()}</div>
                Your account
              </button>
              {acctOpen && (
                <div className="ds-dropdown">
                  <div className="ds-dropdown-meta">
                    <span className="ds-dropdown-email">{user.email}</span>
                    <span className="ds-tag">Sparring Partner</span>
                  </div>
                  <button className="ds-dropdown-item" onClick={() => { setAcctOpen(false); openModal("history"); }}>Session history</button>
                  <div className="ds-dropdown-divider" />
                  <button className="ds-dropdown-item" onClick={handleCancelSub}>Manage billing</button>
                  <button className="ds-dropdown-item" onClick={handleLogout}>Sign out</button>
                  <button className="ds-dropdown-item ds-danger-item" onClick={() => { setAcctOpen(false); openModal("delete"); }}>Delete account</button>
                </div>
              )}
            </div>
          ) : (
            <div className="ds-nav-links">
              <button className="ds-link-btn" onClick={() => openModal("login")}>Sign in</button>
              <button className="ds-cta-sm" onClick={() => openModal("signup")}>Get full access</button>
            </div>
          )}
        </div>
      </nav>

      {/* ROUTES */}
      {page === "quiz" && <QuizGame onClose={() => goPage("home")} />}
      {page === "spar" && <SparringInterface user={user} onExit={() => goPage("home")} onSignup={() => { goPage("home"); openModal("signup"); }} />}
      {["privacy", "terms", "cookies"].includes(page) && <LegalPage page={page} onBack={() => goPage("home")} />}

      {/* HOME */}
      {page === "home" && (
        <>
          {/* HERO */}
          <section className="ds-hero">
            <div className="ds-hero-inner">
              <div>
                <span className="ds-eyebrow">Design Decision Tool</span>
                <h1 className="ds-h1">Your design<br />decisions deserve<br /><em><TypewriterText text="a fight." startDelay={950} /></em></h1>
                <p className="ds-hero-sub">Paste your design rationale. Get a structured counter-argument.<br />Three rounds. A scored verdict. No encouragement.</p>
                <div className="ds-hero-ctas">
                  <button className="ds-btn-primary" onClick={() => goPage("spar")}>{user?.plan === "paid" ? "Start Sparring" : "Start sparring free"}</button>
                  <a className="ds-btn-ghost" href="#pricing">See pricing</a>
                </div>
                {user?.plan !== "paid" && <p className="ds-hero-free-note">Free tier - no account required</p>}
              </div>
              <div className="ds-carousel">
                <div className="ds-carousel-card" key={activeRound}>
                  <div className="ds-card-top">
                    <div className="ds-card-lbl">{currentRound.yourLabel} - Round 0{currentRound.round}</div>
                    <div className="ds-card-rounds">
                      {[0, 1, 2].map((i) => <div key={i} className={"ds-card-round-pip" + (i === activeRound ? " ds-card-round-pip-on" : "")} />)}
                    </div>
                  </div>
                  <div className="ds-card-txt ds-card-yours">"{currentRound.yours}"</div>
                  <hr className="ds-card-hr" />
                  <div className="ds-card-lbl ds-card-lbl-vs">The Counter</div>
                  <div className="ds-card-txt ds-card-counter">{currentRound.counter}</div>
                  <div className="ds-card-foot">
                    <span className="ds-round-lbl">Round 0{currentRound.round} / 03</span>
                    <span className="ds-defend-lbl">{currentRound.action}</span>
                  </div>
                </div>
                <div className="ds-carousel-dots">
                  {[0, 1, 2].map((i) => (
                    <button key={i} className={"ds-carousel-dot" + (i === activeRound ? " ds-carousel-dot-on" : "")} onClick={() => setActiveRound(i)} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SOCIAL PROOF */}
          <div className="ds-proof">
            <div className="ds-proof-item">
              <ProofNum target={2800} suffix="+" />
              <span className="ds-proof-label">design decisions stress-tested</span>
            </div>
            <div className="ds-proof-item">
              <ProofNum special="1 in 3" />
              <span className="ds-proof-label">arguments don't survive round two</span>
            </div>
            <div className="ds-proof-item">
              <ProofNum target={1200} suffix="+" />
              <span className="ds-proof-label">active designers</span>
            </div>
            <div className="ds-proof-item">
              <ProofNum target={91} suffix="%" />
              <span className="ds-proof-label">found a blind spot they had missed</span>
            </div>
          </div>

          {/* HOW IT WORKS */}
          <section className="ds-section">
            <div className="ds-section-inner">
              <span className="ds-section-lbl ds-reveal">The process</span>
              <div className="ds-steps">
                {STEPS.map((s, idx) => (
                  <div key={s.n} className={"ds-reveal ds-reveal-d" + (idx + 1)}>
                    <div className="ds-step-num">{s.n}</div>
                    <h3 className="ds-step-title">{s.title}</h3>
                    <p className="ds-step-body">{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* VERDICT */}
          <section className="ds-verdict-landing">
            <div className="ds-verdict-split">
              <div className="ds-verdict-content" style={{padding:"48px 44px 48px 56px"}}>
                <span className="ds-section-lbl ds-reveal">The verdict</span>
                <h2 className="ds-verdict-h2 ds-reveal ds-reveal-d1" style={{marginBottom:"12px"}}>
                  <span className="ds-verdict-line1">Four dimensions.</span>
                  <span className="ds-verdict-line2">No softening.</span>
                </h2>
                <div className="ds-scores">
                  {SCORES_PREVIEW.map((s, idx) => (
                    <div className={"ds-score-row ds-reveal ds-reveal-d" + (idx + 1)} key={s.label}>
                      <div className="ds-score-meta">
                        <span className="ds-score-lbl">{s.label}</span>
                        <span className="ds-score-note">{s.note}</span>
                      </div>
                      {s.score !== null ? <Pips score={s.score} /> : <span className="ds-score-flag">Flagged</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="ds-verdict-image" style={{backgroundImage: "url('/verdict-bg.jpg')"}} />
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="ds-section">
            <div className="ds-section-inner">
              <span className="ds-section-lbl ds-reveal">In the field</span>
              <div className="ds-testi-grid">
                {TESTIMONIALS.map((t, i) => (
                  <div className={"ds-testi ds-reveal ds-reveal-d" + (i + 1)} key={i}>
                    <div className="ds-testi-mark">"</div>
                    <p className="ds-testi-quote">{t.quote}</p>
                    <div className="ds-testi-author">
                      <span className="ds-testi-name">{t.name}</span>
                      <span className="ds-testi-role">{t.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* WHO IT'S FOR */}
          <section className="ds-section">
            <div className="ds-section-inner">
              <span className="ds-section-lbl ds-reveal">Who it is for</span>
              <AudienceSection />
            </div>
          </section>

          {/* PRICING */}
          <section className="ds-section ds-section-alt" id="pricing">
            <div className="ds-section-inner">
              <span className="ds-section-lbl ds-reveal">Pricing</span>
              <div className="ds-pricing">
                <div className="ds-plan ds-reveal ds-reveal-d1">
                  <div className="ds-plan-head"><h3 className="ds-plan-name">Challenger</h3><span className="ds-plan-price">Free</span></div>
                  <p className="ds-plan-desc">Try the sparring. No account needed.</p>
                  <ul className="ds-plan-list"><li>3 sessions per day</li><li>1 round per session</li><li>No sign-in required</li><li>No session memory</li><li>No verdict scoring</li></ul>
                  <p className="ds-plan-note">No account required</p>
                  <button className="ds-btn-outline" onClick={() => goPage("spar")}>{user?.plan === "paid" ? "Start Sparring" : "Start sparring free"}</button>
                </div>
                <div className="ds-plan ds-plan-dark ds-reveal ds-reveal-d2">
                  <div className="ds-plan-head"><h3 className="ds-plan-name">Sparring Partner</h3><span className="ds-plan-price">$9<span className="ds-plan-per">/mo</span></span></div>
                  <p className="ds-plan-desc">The full fight, saved for 30 days.</p>
                  <ul className="ds-plan-list"><li>Unlimited sessions</li><li>Full 3-round format</li><li>30-day session history</li><li>Scored verdict on every session</li><li>Download session records</li></ul>
                  <p className="ds-plan-note">Account required</p>
                  <button className="ds-btn-primary" onClick={() => openModal("signup")}>Get full access</button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* FOOTER */}
      <footer style={{padding:"36px 48px 28px",background:"var(--ink)",display:"flex",flexDirection:"column",gap:"20px"}}>
        {/* Row 1: Logo left | Email+LinkedIn center */}
        <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",width:"100%"}}>
          <div className="ds-logo-wrap" onClick={() => goPage("home")}>
            <DSLogo size={22} light={true} />
            <span className="ds-logo">Design Sparring</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"28px"}}>
            <a href="mailto:contact@design-sparring.org" style={{fontFamily:"'Roboto',sans-serif",fontSize:"13px",color:"rgba(249,247,242,0.9)",textDecoration:"none",fontWeight:400,transition:"color 0.2s"}}
              onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(249,247,242,0.9)"}>
              contact@design-sparring.org
            </a>
            <a href="https://www.linkedin.com/company/design-decision" target="_blank" rel="noopener noreferrer"
              style={{display:"flex",alignItems:"center",gap:"7px",fontFamily:"'Roboto',sans-serif",fontSize:"13px",color:"rgba(249,247,242,0.9)",textDecoration:"none",fontWeight:400,transition:"color 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(249,247,242,0.9)"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Design Sparring on LinkedIn
            </a>
          </div>
          <div />
        </div>
        {/* Row 2: divider */}
        <div style={{borderTop:"1px solid rgba(249,247,242,0.1)"}} />
        {/* Row 3: Legal center | Rights right */}
        <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",width:"100%"}}>
          <div />
          <div style={{display:"flex",gap:"20px",alignItems:"center",justifyContent:"center"}}>
            {["privacy","terms","cookies"].map(p => (
              <button key={p} onClick={() => goPage(p)} style={{fontFamily:"'Roboto',sans-serif",fontSize:"13px",color:"rgba(249,247,242,0.45)",background:"none",border:"none",cursor:"pointer",padding:0,fontWeight:400,textTransform:"capitalize",transition:"color 0.2s"}}
                onMouseEnter={e=>e.target.style.color="rgba(249,247,242,0.85)"} onMouseLeave={e=>e.target.style.color="rgba(249,247,242,0.45)"}>
                {p.charAt(0).toUpperCase()+p.slice(1)}
              </button>
            ))}
          </div>
          <div style={{textAlign:"right"}}>
            <span style={{fontFamily:"'Roboto',sans-serif",fontSize:"12px",color:"rgba(249,247,242,0.35)",fontWeight:400}}>All rights reserved @design-sparring.org. 2026</span>
          </div>
        </div>
      </footer>

      {/* COOKIE */}
      {!cookiesAccepted && (
        <div className="ds-cookie">
          <p className="ds-cookie-text">We use essential cookies for authentication only. <button onClick={() => goPage("cookies")}>Learn more</button></p>
          <div className="ds-cookie-actions">
            <button className="ds-cookie-decline" onClick={() => { localStorage.setItem("ds_cookies_consent","declined"); setCookiesAccepted(true); }}>Decline non-essential</button>
            <button className="ds-cookie-accept" onClick={() => { localStorage.setItem("ds_cookies_consent","accepted"); setCookiesAccepted(true); }}>Accept</button>
          </div>
        </div>
      )}

      {/* MODALS */}
      {modal && (
        <div className="ds-overlay" onClick={modal === "payment-gate" ? undefined : closeModal}>
          <div className={"ds-modal" + (modal === "payment-gate" ? " ds-modal-wide" : "")} onClick={(e) => e.stopPropagation()}>
            {modal !== "payment-gate" && <button className="ds-modal-x" onClick={closeModal}>x</button>}

            {modal === "payment-gate" && (
              <>
                <div className="ds-gate-header">
                  <h2 className="ds-gate-title">You are in. Choose how to continue.</h2>
                  <p className="ds-gate-sub">Full access requires a subscription. Or use the tool free without an account.</p>
                </div>
                <div className="ds-gate-cards">
                  <div className="ds-gate-card ds-gate-card-dark">
                    <div className="ds-gate-card-head">
                      <span className="ds-gate-card-name">Sparring Partner</span>
                      <span className="ds-gate-card-price">$9<span className="ds-gate-card-per">/mo</span></span>
                    </div>
                    <ul className="ds-gate-list">
                      <li>Full 3-round sessions</li>
                      <li>Scored verdict on every fight</li>
                      <li>30-day session history</li>
                      <li>Download session records</li>
                      <li>Unlimited sessions</li>
                    </ul>
                    <button className="ds-gate-btn-primary" onClick={handleUpgrade} disabled={upgrading} style={{opacity: upgrading ? 0.6 : 1}}>{upgrading ? "Redirecting to payment..." : "Unlock full access"}</button>
                    <p className="ds-gate-terms">Cancel anytime. No refunds for partial months.</p>
                  </div>
                  <div className="ds-gate-card">
                    <div className="ds-gate-card-head">
                      <span className="ds-gate-card-name">Free tier</span>
                      <span className="ds-gate-card-price">Free</span>
                    </div>
                    <ul className="ds-gate-list">
                      <li>1 round per session</li>
                      <li>3 sessions per day</li>
                      <li>No session memory</li>
                      <li>No verdict scoring</li>
                      <li>No account needed</li>
                    </ul>
                    <button className="ds-gate-btn-outline" onClick={handleGoFree}>I changed my mind, use free</button>
                    <p className="ds-gate-note">You will be signed out. No data is saved on the free tier.</p>
                  </div>
                </div>
              </>
            )}

            {(modal === "login" || modal === "signup") && authStep === "form" && (
              <>
                <h2 className="ds-modal-title">{modal === "login" ? "Sign in" : "Create account"}</h2>
                <p className="ds-modal-sub">{modal === "login" ? "Enter your email. We will send a link." : "Sparring Partner plan - $9/mo. Enter your email to get started."}</p>
                <input className="ds-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setAuthError(null); }} onKeyDown={(e) => e.key === "Enter" && handleAuth()} autoFocus />
                {authError && (
                  <div className="ds-auth-error">
                    {authError}
                    {authError.includes("already exists") && <> <button className="ds-text-btn" style={{fontSize:13}} onClick={() => { setAuthError(null); openModal("login"); }}>Sign in instead</button>.</>}
                    {authError.includes("No account") && <> <button className="ds-text-btn" style={{fontSize:13}} onClick={() => { setAuthError(null); openModal("signup"); }}>Create an account</button>.</>}
                  </div>
                )}
                <button className="ds-btn-primary ds-btn-full" onClick={handleAuth}>{modal === "login" ? "Send link" : "Continue"}</button>
                <p className="ds-modal-switch">
                  {modal === "login"
                    ? <span>New here? <button className="ds-text-btn" onClick={() => openModal("signup")}>Create an account</button></span>
                    : <span>Already have one? <button className="ds-text-btn" onClick={() => openModal("login")}>Sign in</button></span>}
                </p>
              </>
            )}

            {(modal === "login" || modal === "signup") && authStep === "sent" && (
              <>
                <h2 className="ds-modal-title">Check your email</h2>
                <p className="ds-modal-sub">A sign-in link is on its way to <strong>{email}</strong></p>
                <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 400, lineHeight: 1.7 }}>Click the link to sign in. It expires in 15 minutes.</p>
              </>
            )}

            {modal === "auth-expired" && (
              <>
                <h2 className="ds-modal-title">Link expired</h2>
                <p className="ds-modal-sub">This sign-in link is no longer active. Links expire after 15 minutes and can only be used once.</p>
                <button className="ds-btn-primary ds-btn-full" onClick={() => { closeModal(); openModal("login"); }}>Request a new link</button>
              </>
            )}

            {modal === "history" && (
              <>
                <h2 className="ds-modal-title">Session history</h2>
                <p className="ds-modal-sub" style={{ marginBottom: 20 }}>Last 30 days. Download a full record of any session.</p>
                {sessions === null && <p style={{ fontSize: 14, color: "var(--muted)", padding: "20px 0" }}>Loading...</p>}
                {sessions !== null && sessions.length === 0 && (
                  <div className="ds-history-empty">
                    <p className="ds-history-empty-title">No sessions yet</p>
                    <p className="ds-history-empty-sub">Start a sparring session and your history will appear here. Sessions are kept for 30 days.</p>
                    <button className="ds-btn-primary" onClick={() => { closeModal(); goPage("spar"); }}>Start sparring</button>
                  </div>
                )}
                {sessions !== null && sessions.length > 0 && (
                  <div className="ds-history-list">
                    <div className="ds-history-lbl">Recent sessions</div>
                    {sessions.map((s) => (
                      <div className="ds-history-row" key={s.id}>
                        <div className="ds-history-info">
                          <span className="ds-history-title">{s.rationale?.slice(0, 48) + (s.rationale?.length > 48 ? "..." : "")}</span>
                          <span className="ds-history-date">{new Date(s.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="ds-history-right">
                          {s.verdict && <Pips score={Math.round(((typeof s.verdict === "string" ? JSON.parse(s.verdict) : s.verdict).clarity + (typeof s.verdict === "string" ? JSON.parse(s.verdict) : s.verdict).userImpact + (typeof s.verdict === "string" ? JSON.parse(s.verdict) : s.verdict).defensibility) / 3)} size="sm" />}
                          <button className="ds-download-btn" onClick={() => downloadSession(s)}>Download</button>
                          <button className="ds-delete-session-btn" onClick={() => handleDeleteSession(s.id)} title="Delete session">×</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {modal === "delete" && (
              <>
                <h2 className="ds-modal-title">Delete account</h2>
                <p className="ds-modal-sub" style={{ marginBottom: 20 }}>
                  {deleteStep
                    ? "Last chance. This cannot be undone."
                    : "Permanently removes your account and all associated data."}
                </p>
                {!deleteStep ? (
                  <>
                    {user?.plan === "paid" && (
                      <label className="ds-check-label">
                        <input
                          type="checkbox"
                          checked={deleteAcknowledged}
                          onChange={(e) => setDeleteAcknowledged(e.target.checked)}
                        />
                        <span className="ds-check-text">
                          I understand that my Sparring Partner subscription will be cancelled immediately
                          and my entire session history will be permanently deleted. There is no refund for
                          the current billing period.
                        </span>
                      </label>
                    )}
                    <button
                      className="ds-btn-danger"
                      onClick={handleDelete}
                      disabled={user?.plan === "paid" && !deleteAcknowledged}
                      style={{ opacity: user?.plan === "paid" && !deleteAcknowledged ? 0.4 : 1, cursor: user?.plan === "paid" && !deleteAcknowledged ? "not-allowed" : "pointer" }}
                    >
                      Delete my account
                    </button>
                  </>
                ) : (
                  <div className="ds-delete-stack">
                    <button className="ds-btn-danger" onClick={handleDelete}>Yes, delete permanently</button>
                    <button className="ds-btn-outline ds-btn-full" onClick={closeModal}>Cancel</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {toast && <div className="ds-toast">{toast}</div>}
    </div>
  );
}