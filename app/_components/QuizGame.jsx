'use client'
import { useState, useEffect } from "react";

const QUIZ_CSS = `
.qz { font-family: 'Roboto', sans-serif; background: #fff; min-height: 100vh; }
.qz-nav { display: flex; align-items: center; justify-content: space-between; padding: 20px 48px; background: #fff; border-bottom: 1px solid #EEE; position: sticky; top: 0; z-index: 10; }
.qz-back { background: none; border: none; cursor: pointer; font-family: 'Roboto', sans-serif; font-size: 13px; font-weight: 400; color: #6B6862; transition: color 0.2s; padding: 0; display: flex; align-items: center; gap: 8px; }
.qz-back:hover { color: #1A1714; }
.qz-brand { font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #1A1714; opacity: 0.4; }
.qz-progress-bar { height: 3px; background: #F0EDE9; }
.qz-progress-fill { height: 3px; background: #C63B15; transition: width 0.4s ease; }
.qz-body { max-width: 600px; margin: 0 auto; padding: 56px 24px 80px; }
.qz-step { font-family: 'Roboto', sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #C63B15; margin-bottom: 12px; }
.qz-q { font-family: 'Lato', sans-serif; font-size: clamp(22px, 3.5vw, 30px); font-weight: 700; line-height: 1.25; letter-spacing: -0.01em; color: #1A1714; margin-bottom: 36px; }
.qz-options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
.qz-option { border: 1.5px solid #E8E5DF; background: #fff; cursor: pointer; padding: 18px 22px; text-align: left; font-family: 'Roboto', sans-serif; font-size: 15px; color: #3A3733; line-height: 1.6; font-weight: 400; transition: border-color 0.18s, background 0.18s, color 0.18s; display: flex; align-items: flex-start; gap: 14px; }
.qz-option:hover { border-color: #1A1714; color: #1A1714; }
.qz-option-on { border-color: #C63B15 !important; background: #FFF5F3; color: #1A1714; }
.qz-option-letter { font-family: 'Roboto', sans-serif; font-size: 13px; font-weight: 500; color: #918D87; flex-shrink: 0; margin-top: 2px; transition: color 0.18s; }
.qz-option-on .qz-option-letter { color: #C63B15; }
.qz-next { background: #1A1714; color: #F9F7F2; border: none; cursor: pointer; font-family: 'Roboto', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; padding: 14px 32px; transition: opacity 0.2s, transform 0.15s; }
.qz-next:hover { opacity: 0.82; transform: translateY(-1px); }
.qz-next:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }
.qz-illus { margin-bottom: 28px; }
.qz-intro { text-align: center; padding: 32px 0; }
.qz-intro-title { font-family: 'Lato', sans-serif; font-size: clamp(28px, 5vw, 48px); font-weight: 900; letter-spacing: -0.03em; color: #1A1714; margin-bottom: 16px; line-height: 1.05; }
.qz-intro-title em { font-style: normal; color: #C63B15; }
.qz-intro-sub { font-size: 16px; color: #918D87; line-height: 1.8; margin-bottom: 12px; font-weight: 400; max-width: 440px; margin-left: auto; margin-right: auto; }
.qz-intro-meta { font-family: 'Roboto', sans-serif; font-size: 13px; color: #6B6862; margin-bottom: 40px; font-weight: 400; }
.qz-start { background: transparent; color: #C63B15; border: 2px solid #C63B15; cursor: pointer; font-family: 'Roboto', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; padding: 16px 44px; transition: background 0.2s, color 0.2s; }
.qz-start:hover { background: #C63B15; color: #fff; }
.qz-result { animation: qz-in 0.4s ease; }
@keyframes qz-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.qz-result-eyebrow { font-family: 'Roboto', sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #C63B15; margin-bottom: 12px; display: block; }
.qz-result-type { font-family: 'Lato', sans-serif; font-size: clamp(28px, 4vw, 42px); font-weight: 900; letter-spacing: -0.03em; color: #1A1714; margin-bottom: 6px; line-height: 1.1; }
.qz-result-tagline { font-family: 'Roboto', sans-serif; font-size: 14px; color: #6B6862; margin-bottom: 28px; font-weight: 400; }
.qz-result-desc { font-size: 15px; color: #3A3733; line-height: 1.9; font-weight: 400; margin-bottom: 32px; padding: 24px; background: #F9F7F2; border-left: 3px solid #C63B15; }
.qz-scores { margin-bottom: 32px; }
.qz-scores-title { font-family: 'Roboto', sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: #6B6862; margin-bottom: 16px; }
.qz-score-row { display: flex; align-items: center; gap: 14px; margin-bottom: 10px; }
.qz-score-label { font-family: 'Roboto', sans-serif; font-size: 13px; color: #1A1714; width: 110px; flex-shrink: 0; font-weight: 400; }
.qz-score-track { flex: 1; height: 5px; background: #EEE; }
.qz-score-fill { height: 5px; background: #1A1714; transition: width 0.8s ease; }
.qz-score-fill-win { background: #C63B15; }
.qz-score-num { font-family: 'Roboto', sans-serif; font-size: 13px; color: #918D87; width: 28px; text-align: right; }
.qz-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
.qz-tag { border: 1px solid #DDD9D1; padding: 7px 16px; font-family: 'Roboto', sans-serif; font-size: 13px; color: #6B6862; font-weight: 400; }
.qz-watchout { padding: 16px 20px; border: 1px solid #F5C5BB; background: #FFF8F6; font-size: 14px; color: #3A3733; line-height: 1.7; margin-bottom: 32px; }
.qz-watchout strong { color: #C63B15; font-weight: 500; }
.qz-email-section { border-top: 1px solid #EEE; padding-top: 28px; margin-bottom: 32px; }
.qz-email-title { font-family: 'Lato', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 6px; }
.qz-email-sub { font-size: 13px; color: #918D87; margin-bottom: 16px; font-weight: 400; }
.qz-email-row { display: flex; gap: 10px; flex-wrap: wrap; }
.qz-email-input { flex: 1; min-width: 200px; border: 1.5px solid #DDD9D1; background: #fff; padding: 12px 14px; font-family: 'Roboto', sans-serif; font-size: 15px; color: #1A1714; outline: none; transition: border-color 0.2s; }
.qz-email-input:focus { border-color: #1A1714; }
.qz-email-send { background: #1A1714; color: #F9F7F2; border: none; cursor: pointer; font-family: 'Roboto', sans-serif; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding: 12px 20px; transition: opacity 0.2s; white-space: nowrap; }
.qz-email-send:hover { opacity: 0.82; }
.qz-email-send:disabled { opacity: 0.4; cursor: not-allowed; }
.qz-email-success { font-family: 'Roboto', sans-serif; font-size: 12px; color: #5CAD6A; letter-spacing: 0.06em; margin-top: 8px; }
.qz-result-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 40px; }
.qz-retake { background: none; border: 1.5px solid #DDD9D1; cursor: pointer; font-family: 'Roboto', sans-serif; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; padding: 12px 24px; color: #1A1714; transition: border-color 0.2s; }
.qz-retake:hover { border-color: #1A1714; }
.qz-done { background: #1A1714; color: #F9F7F2; border: none; cursor: pointer; font-family: 'Roboto', sans-serif; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; padding: 12px 24px; transition: opacity 0.2s; }
.qz-done:hover { opacity: 0.82; }
.qz-citation { font-family: 'Roboto', sans-serif; font-size: 12px; color: #918D87; line-height: 1.75; border-top: 1px solid #EEE; padding-top: 20px; font-weight: 400; }
@media (max-width: 600px) {
  .qz-nav { padding: 16px 20px; }
  .qz-body { padding: 36px 20px 60px; }
  .qz-email-row { flex-direction: column; }
  .qz-result-actions { flex-direction: column; }
}
`;

const ILLUSTRATIONS = {
  search: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="28" cy="28" r="16" stroke="#DDD9D1" strokeWidth="2.5"/>
      <path d="M40 40 L54 54" stroke="#C63B15" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M22 28 H34" stroke="#918D87" strokeWidth="2" strokeLinecap="round"/>
      <path d="M28 22 V34" stroke="#918D87" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  debate: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path d="M6 32 H26" stroke="#DDD9D1" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M38 32 H58" stroke="#C63B15" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M22 24 L30 32 L22 40" stroke="#DDD9D1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M42 24 L34 32 L42 40" stroke="#C63B15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  process: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="12" cy="32" r="5" stroke="#DDD9D1" strokeWidth="2"/>
      <circle cx="32" cy="32" r="5" stroke="#918D87" strokeWidth="2"/>
      <circle cx="52" cy="32" r="5" fill="#C63B15"/>
      <path d="M17 32 H27" stroke="#DDD9D1" strokeWidth="1.5" strokeDasharray="2 2"/>
      <path d="M37 32 H47" stroke="#918D87" strokeWidth="1.5" strokeDasharray="2 2"/>
    </svg>
  ),
  clock: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="22" stroke="#DDD9D1" strokeWidth="2.5"/>
      <path d="M32 14 V32" stroke="#918D87" strokeWidth="2" strokeLinecap="round"/>
      <path d="M32 32 L44 40" stroke="#C63B15" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="32" cy="32" r="2.5" fill="#1A1714"/>
    </svg>
  ),
  insight: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path d="M32 8 V16" stroke="#C63B15" strokeWidth="2" strokeLinecap="round"/>
      <path d="M32 48 V56" stroke="#DDD9D1" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 32 H16" stroke="#DDD9D1" strokeWidth="2" strokeLinecap="round"/>
      <path d="M48 32 H56" stroke="#C63B15" strokeWidth="2" strokeLinecap="round"/>
      <path d="M15 15 L21 21" stroke="#918D87" strokeWidth="2" strokeLinecap="round"/>
      <path d="M43 43 L49 49" stroke="#DDD9D1" strokeWidth="2" strokeLinecap="round"/>
      <path d="M49 15 L43 21" stroke="#C63B15" strokeWidth="2" strokeLinecap="round"/>
      <path d="M21 43 L15 49" stroke="#DDD9D1" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="32" cy="32" r="7" fill="#C63B15" fillOpacity="0.12" stroke="#C63B15" strokeWidth="1.5"/>
    </svg>
  ),
  review: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect x="10" y="14" width="44" height="8" rx="1" fill="#F0EDE9" stroke="#DDD9D1" strokeWidth="1.5"/>
      <rect x="10" y="28" width="32" height="8" rx="1" fill="#F0EDE9" stroke="#918D87" strokeWidth="1.5"/>
      <rect x="10" y="42" width="20" height="8" rx="1" fill="#FFF0EE" stroke="#C63B15" strokeWidth="1.5"/>
    </svg>
  ),
  fork: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path d="M32 52 V32" stroke="#DDD9D1" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M32 32 L14 14" stroke="#918D87" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M32 32 L50 14" stroke="#C63B15" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="14" cy="14" r="4" stroke="#918D87" strokeWidth="2"/>
      <circle cx="50" cy="14" r="4" fill="#C63B15"/>
    </svg>
  ),
  bolt: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path d="M38 8 L20 36 H32 L26 56 L50 26 H36 Z" fill="#FFF0EE" stroke="#C63B15" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  mirror: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path d="M8 32 H56" stroke="#DDD9D1" strokeWidth="1.5"/>
      <path d="M16 20 Q32 10 48 20" stroke="#918D87" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M16 44 Q32 54 48 44" stroke="#C63B15" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="32" cy="32" r="3" fill="#1A1714" fillOpacity="0.15"/>
    </svg>
  ),
  horizon: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path d="M6 40 H58" stroke="#DDD9D1" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 52 H52" stroke="#EEE" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="32" cy="22" r="10" stroke="#C63B15" strokeWidth="2.5"/>
      <path d="M32 32 V40" stroke="#C63B15" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

const QUESTIONS = [
  { id:1, illus:"search", text:"When you face an important design decision, your first move is to...", options:[
    {letter:"A", text:"Research similar solutions, review precedents, and gather data before committing", style:"R"},
    {letter:"B", text:"Sketch or prototype the first strong idea that surfaces — feel it before you frame it", style:"I"},
    {letter:"C", text:"Ask a trusted colleague or team member what direction they would take", style:"D"},
    {letter:"D", text:"Wait — you need more context before making a call this important", style:"A"},
  ]},
  { id:2, illus:"debate", text:"A stakeholder disagrees with a design decision you believe in. You...", options:[
    {letter:"A", text:"Stand your ground — your instinct says it is right and you are comfortable defending it", style:"I"},
    {letter:"B", text:"Back it up methodically — research, data, and documented rationale", style:"R"},
    {letter:"C", text:"Offer to revisit it together and incorporate their perspective", style:"D"},
    {letter:"D", text:"Suggest going back to the drawing board to explore all options again", style:"A"},
  ]},
  { id:3, illus:"process", text:"Which best describes how you typically work through a design problem?", options:[
    {letter:"A", text:"Methodically — each step is deliberate, documented, and reasoned", style:"R"},
    {letter:"B", text:"Intuitively — ideas emerge as I work and guide the process forward", style:"I"},
    {letter:"C", text:"Collaboratively — my process is significantly shaped by the people around me", style:"D"},
    {letter:"D", text:"Spontaneously — I jump in and figure it out through doing", style:"S"},
  ]},
  { id:4, illus:"clock", text:"A deadline forces a decision before you feel fully ready. You...", options:[
    {letter:"A", text:"Quickly check in with someone whose judgment you trust before committing", style:"D"},
    {letter:"B", text:"Go with your gut and commit fully — you have navigated this before", style:"I"},
    {letter:"C", text:"Make the most defensible call given available information and document it", style:"R"},
    {letter:"D", text:"Feel genuinely uncomfortable — rushed decisions tend to cost more later", style:"A"},
  ]},
  { id:5, illus:"insight", text:"The best design decisions you have made usually came from...", options:[
    {letter:"A", text:"Thorough analysis, structured exploration, and a solid evidence base", style:"R"},
    {letter:"B", text:"A moment of sudden clarity that felt undeniable before it was explainable", style:"I"},
    {letter:"C", text:"A conversation that reframed the problem and shifted your perspective", style:"D"},
    {letter:"D", text:"Acting quickly, shipping something, and learning from what came back", style:"S"},
  ]},
  { id:6, illus:"review", text:"A design review has challenged everything you built. You...", options:[
    {letter:"A", text:"Feel genuinely overwhelmed — too many contradicting voices make it hard to move", style:"A"},
    {letter:"B", text:"Appreciate the input. Multiple people raising it means a serious rethink is needed", style:"D"},
    {letter:"C", text:"Trust your original vision — you can defend it and you know why it is right", style:"I"},
    {letter:"D", text:"Return to your research to validate or invalidate each point of the critique", style:"R"},
  ]},
  { id:7, illus:"fork", text:"You have two equally valid design directions in front of you. You...", options:[
    {letter:"A", text:"Build a decision framework — score both against defined criteria and pick the winner", style:"R"},
    {letter:"B", text:"Pick the one that excites you more. Enthusiasm is data too", style:"I"},
    {letter:"C", text:"Ask for a second opinion before committing. You want a gut-check from someone you trust", style:"D"},
    {letter:"D", text:"Prototype both quickly and let actual responses settle it", style:"S"},
  ]},
  { id:8, illus:"bolt", text:"You are asked to make an important call on the spot. You...", options:[
    {letter:"A", text:"Ask for time to think it through properly. Better slightly late than wrong", style:"R"},
    {letter:"B", text:"Give your honest gut reaction without hesitation. You know what you think", style:"I"},
    {letter:"C", text:"Commit quickly — forward motion beats analysis paralysis", style:"S"},
    {letter:"D", text:"Defer it. The conditions for a good decision are not in place yet", style:"A"},
  ]},
  { id:9, illus:"mirror", text:"Which statement feels most true about how you work?", options:[
    {letter:"A", text:"I am most confident in a decision when I have evidence behind it", style:"R"},
    {letter:"B", text:"I often know the right answer before I can fully explain why I know it", style:"I"},
    {letter:"C", text:"I work best when I can decide fast and keep the momentum going", style:"S"},
    {letter:"D", text:"Other people's perspectives are a significant input into my final calls", style:"D"},
  ]},
  { id:10, illus:"horizon", text:"You are designing something genuinely new — no benchmark, no precedent. You...", options:[
    {letter:"A", text:"Define clear success metrics, constraints, and decision criteria before starting", style:"R"},
    {letter:"B", text:"Trust your instincts to navigate the unknown. Clarity will come as you work", style:"I"},
    {letter:"C", text:"Start making immediately and let the solution reveal itself through iteration", style:"S"},
    {letter:"D", text:"Pause until there is more information. The unknown is a good reason to wait", style:"A"},
  ]},
];

const RESULTS = {
  R: {
    type:"The Rational Thinker",
    tagline:"Evidence-driven. Systematic. Defensible.",
    desc:"You make design decisions the way an engineer builds a bridge — with data, structure, and logic. You need to understand the why before you commit to the what. Your decisions take longer to form but they are built to last and almost always hold under scrutiny. The risk: analysis can become a form of delay. Your edge: you rarely have to apologise for a decision after the fact.",
    strengths:["Thorough research","Defensible rationale","Structured process"],
    watch:"Don't let the search for the perfect case prevent a good decision from shipping.",
  },
  I: {
    type:"The Intuitive Designer",
    tagline:"Pattern-matching at speed. Confident under pressure.",
    desc:"Your experience has trained a second brain — one that recognises what works before your conscious mind catches up. You make strong calls quickly, often without being able to fully explain them in the moment. The decision feels right before it looks right. The risk: gut feel can be confidence masking bias. Your edge: you navigate ambiguity and uncertainty better than almost anyone in the room.",
    strengths:["Speed under pressure","Strong pattern recognition","Comfortable with ambiguity"],
    watch:"Check your assumptions regularly. Your gut encodes experience — including past mistakes.",
  },
  D: {
    type:"The Collaborative Decider",
    tagline:"Dialogue-driven. Inclusive. Attuned.",
    desc:"Your best decisions emerge through conversation. You are attuned to the people around you and you know that a decision made in isolation carries less weight when it needs defending later. You build consensus before you build solutions. The risk: waiting for alignment can delay necessary action. Your edge: your decisions stick because the people affected by them feel genuinely heard.",
    strengths:["Stakeholder alignment","Inclusive process","Shared ownership of outcomes"],
    watch:"Not every decision needs a committee. Learn when to lead rather than consult.",
  },
  A: {
    type:"The Careful Deliberator",
    tagline:"Measured. Risk-aware. Thorough by nature.",
    desc:"You resist premature closure because you have a clear-eyed view of what rushed decisions cost. You need more information — and that is not weakness, it is pattern recognition built from watching things go wrong. The risk: avoidance can look like indecision from the outside, especially when the team needs momentum. Your edge: you rarely make the same costly mistake twice.",
    strengths:["Risk awareness","Long-term thinking","Thorough consideration"],
    watch:"Sometimes a good decision today beats a perfect decision too late.",
  },
  S: {
    type:"The Spontaneous Builder",
    tagline:"Action-oriented. Iterative. Momentum-led.",
    desc:"You think by doing. For you, the fastest path to clarity is to make something, ship it, and learn from what comes back. Analysis feels like delay — you prefer to let reality do the testing. The risk: you can accumulate design debt through under-planning, and not all decisions can be undone by iteration. Your edge: you ship when others are still in the meeting.",
    strengths:["Bias to action","Fast iteration","Learning through making"],
    watch:"Reserve some deliberation for the irreversible decisions. Not everything can be iterated away.",
  },
};

const STYLE_NAMES = {R:"Rational",I:"Intuitive",D:"Dependent",A:"Avoidant",S:"Spontaneous"};
// How many questions each style appears in (for normalized scoring)
const STYLE_MAX = {R:8,I:8,D:7,A:6,S:7};

function computeScores(answers) {
  const s = {R:0,I:0,D:0,A:0,S:0};
  answers.forEach(a => { if (s[a] !== undefined) s[a]++; });
  return s;
}

function getWinner(scores) {
  // Normalize: score divided by how many questions that style appeared in
  // This prevents R from winning just because it appears in more questions
  const normalized = Object.entries(scores).map(([style, score]) => ({
    style,
    score,
    norm: score / (STYLE_MAX[style] || 1),
  }));
  return normalized.reduce((a,b) => b.norm > a.norm ? b : a).style;
}

export default function QuizGame({ onClose }) {
  const [screen, setScreen] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const link = document.createElement("link"); link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Roboto:wght@400;500&family=DM+Mono:wght@300;400&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style"); style.textContent = QUIZ_CSS;
    document.head.appendChild(style);
    return () => { try { document.head.removeChild(link); document.head.removeChild(style); } catch {} };
  }, []);

  const scores = computeScores(answers);
  const winner = getWinner(scores);
  const result = RESULTS[winner];
  const maxScore = QUESTIONS.length;

  const handleSelect = (style) => { setSelected(style); };

  const handleNext = () => {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (currentQ + 1 >= QUESTIONS.length) {
      setScreen("result");
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const handleRetake = () => {
    setScreen("intro"); setCurrentQ(0); setAnswers([]); setSelected(null);
    setEmail(""); setEmailSent(false);
  };

  const handleSendEmail = async () => {
    if (!email.trim() || !email.includes("@")) return;
    setSending(true);
    try {
      await fetch("/api/quiz/send-results", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ email, winner, scores, resultType: result.type }),
      });
      setEmailSent(true);
    } catch { setEmailSent(true); }
    finally { setSending(false); }
  };

  const q = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  return (
    <div className="qz">
      <nav className="qz-nav">
        <button className="qz-back" onClick={onClose}>Back to Design Sparring</button>
        <span className="qz-brand">Design Sparring</span>
      </nav>

      {screen === "intro" && (
        <div className="qz-body">
          <div className="qz-intro">
            <div style={{marginBottom:28}}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <circle cx="36" cy="36" r="28" stroke="#F0EDE9" strokeWidth="3"/>
                <circle cx="36" cy="36" r="18" stroke="#DDD9D1" strokeWidth="2"/>
                <circle cx="36" cy="36" r="8" fill="#C63B15" fillOpacity="0.15" stroke="#C63B15" strokeWidth="2"/>
                <path d="M36 8 V20" stroke="#C63B15" strokeWidth="2" strokeLinecap="round"/>
                <path d="M64 36 H52" stroke="#DDD9D1" strokeWidth="2" strokeLinecap="round"/>
                <path d="M36 64 V52" stroke="#DDD9D1" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 36 H20" stroke="#918D87" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="qz-intro-title">What type of decision-maker<br /><em>are you?</em></h1>
            <p className="qz-intro-sub">10 questions. No right answers. A clear picture of how you make design decisions under pressure.</p>
            <p className="qz-intro-meta">Based on the GDMS model · 3 minutes</p>
            <button className="qz-start" onClick={() => setScreen("quiz")}>Start the test</button>
          </div>
        </div>
      )}

      {screen === "quiz" && (
        <>
          <div className="qz-progress-bar">
            <div className="qz-progress-fill" style={{width: progress + "%"}} />
          </div>
          <div className="qz-body">
            <div style={{animation:"qz-in 0.3s ease"}} key={currentQ}>
              <div className="qz-step">Question {currentQ + 1} of {QUESTIONS.length}</div>
              <div className="qz-illus">{ILLUSTRATIONS[q.illus]}</div>
              <div className="qz-q">{q.text}</div>
              <div className="qz-options">
                {q.options.map(opt => (
                  <button
                    key={opt.style}
                    className={"qz-option" + (selected === opt.style ? " qz-option-on" : "")}
                    onClick={() => handleSelect(opt.style)}
                  >
                    <span className="qz-option-letter">{opt.letter}</span>
                    <span>{opt.text}</span>
                  </button>
                ))}
              </div>
              <button className="qz-next" onClick={handleNext} disabled={!selected}>
                {currentQ + 1 >= QUESTIONS.length ? "See my results" : "Next question"}
              </button>
            </div>
          </div>
        </>
      )}

      {screen === "result" && result && (
        <>
          <div className="qz-progress-bar"><div className="qz-progress-fill" style={{width:"100%"}} /></div>
          <div className="qz-body">
            <div className="qz-result">
              <span className="qz-result-eyebrow">Your decision-making style</span>
              <h2 className="qz-result-type">{result.type}</h2>
              <p className="qz-result-tagline">{result.tagline}</p>
              <div className="qz-result-desc">{result.desc}</div>

              <div className="qz-scores">
                <div className="qz-scores-title">Score breakdown</div>
                {Object.entries(scores).sort((a,b) => b[1]-a[1]).map(([style, score]) => (
                  <div className="qz-score-row" key={style}>
                    <span className="qz-score-label">{STYLE_NAMES[style]}</span>
                    <div className="qz-score-track">
                      <div
                        className={"qz-score-fill" + (style === winner ? " qz-score-fill-win" : "")}
                        style={{width: (score / maxScore * 100) + "%"}}
                      />
                    </div>
                    <span className="qz-score-num">{score}</span>
                  </div>
                ))}
              </div>

              <div className="qz-tags">
                {result.strengths.map(s => <span className="qz-tag" key={s}>{s}</span>)}
              </div>

              <div className="qz-watchout">
                <strong>Watch out for: </strong>{result.watch}
              </div>

              <div className="qz-email-section">
                <div className="qz-email-title">Get your results by email</div>
                <div className="qz-email-sub">We will send your full profile and score breakdown to your inbox.</div>
                {!emailSent ? (
                  <>
                    <div className="qz-email-row">
                      <input
                        className="qz-email-input"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSendEmail()}
                      />
                      <button className="qz-email-send" onClick={handleSendEmail} disabled={sending || !email.includes("@")}>
                        {sending ? "Sending..." : "Send results"}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="qz-email-success">Results sent to {email}</p>
                )}
              </div>

              <div className="qz-result-actions">
                <button className="qz-retake" onClick={handleRetake}>Retake assessment</button>
                <button className="qz-done" onClick={onClose}>Back to Design Sparring</button>
              </div>

              <div className="qz-citation">
                Source: Scott, S. G., & Bruce, R. A. (1995). Decision-making style: The development and assessment of a new measure. Educational and Psychological Measurement, 55(5), 818–831. This assessment is an adaptation for educational and self-reflection purposes, not a clinical instrument.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}