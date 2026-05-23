'use client'
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const FONTS = "https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Roboto:wght@400;500&family=DM+Mono:wght@300;400&display=swap";

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #F9F7F2; --ink: #1A1714; --accent: #C63B15;
  --muted: #7A7570; --surface: #F2EFE9; --border: #DDD9D1;
  --display: 'Lato', sans-serif; --sans: 'Roboto', sans-serif; --mono: 'DM Mono', monospace;
}
body { background: var(--bg); }

.ds {
  font-family: var(--sans); color: var(--ink); min-height: 100vh; font-size: 16px; line-height: 1.6;
  background-color: var(--bg);
  background-image: radial-gradient(circle, rgba(26,23,20,0.1) 1.5px, transparent 1.5px);
  background-size: 22px 22px;
}

button:focus-visible, a:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

/* NAV */
.ds-nav { display: flex; align-items: center; justify-content: space-between; padding: 20px 48px; position: sticky; top: 0; background: var(--bg); z-index: 100; box-shadow: 0 1px 0 var(--border), 0 4px 20px rgba(0,0,0,0.04); }
.ds-logo-wrap { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.ds-logo { font-family: var(--mono); font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink); }
.ds-nav-links { display: flex; align-items: center; gap: 12px; }
.ds-link-btn { background: none; border: none; cursor: pointer; font-family: var(--sans); font-size: 14px; color: var(--muted); padding: 8px 12px; transition: color 0.2s; }
.ds-link-btn:hover { color: var(--ink); }
.ds-cta-sm { background: var(--ink); color: var(--bg); border: none; cursor: pointer; font-family: var(--mono); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; padding: 10px 20px; transition: opacity 0.2s; }
.ds-cta-sm:hover { opacity: 0.8; }
.ds-account-wrap { position: relative; }
.ds-account-btn { display: flex; align-items: center; gap: 10px; background: none; border: 1px solid var(--border); cursor: pointer; font-family: var(--sans); font-size: 13px; color: var(--ink); padding: 7px 14px; transition: border-color 0.2s; }
.ds-account-btn:hover { border-color: var(--ink); }
.ds-avatar { width: 22px; height: 22px; border-radius: 50%; background: var(--accent); color: white; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; font-family: var(--mono); flex-shrink: 0; }
.ds-dropdown { position: absolute; right: 0; top: calc(100% + 8px); background: var(--bg); border: 1px solid var(--border); min-width: 220px; z-index: 200; padding: 8px 0; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
.ds-dropdown-meta { padding: 10px 16px 12px; border-bottom: 1px solid var(--border); margin-bottom: 4px; }
.ds-dropdown-email { font-size: 12px; color: var(--muted); display: block; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ds-tag { font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); }
.ds-dropdown-item { display: block; width: 100%; text-align: left; background: none; border: none; padding: 10px 16px; font-family: var(--sans); font-size: 14px; color: var(--ink); cursor: pointer; transition: background 0.15s; }
.ds-dropdown-item:hover { background: var(--surface); }
.ds-dropdown-divider { border: none; border-top: 1px solid var(--border); margin: 4px 0; }
.ds-danger-item { color: var(--accent) !important; }

/* SOCIAL PROOF BAR */
.ds-proof { background: var(--ink); padding: 22px 48px; display: flex; justify-content: center; gap: 72px; flex-wrap: wrap; }
.ds-proof-item { display: flex; flex-direction: column; align-items: center; gap: 5px; }
.ds-proof-num { font-family: var(--mono); font-size: 48px; color: var(--accent); letter-spacing: -0.03em; font-weight: 400; line-height: 1; }
.ds-proof-special { font-family: var(--mono); font-size: 32px; color: var(--accent); letter-spacing: -0.02em; font-weight: 400; line-height: 1; animation: proof-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }
@keyframes proof-pop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
.ds-proof-label { font-family: var(--sans); font-size: 12px; color: rgba(249,247,242,0.5); font-weight: 300; text-align: center; max-width: 160px; line-height: 1.4; }

/* HERO */
.ds-hero { padding: 88px 48px 80px; }
.ds-hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; max-width: 1100px; margin: 0 auto; }
.ds-eyebrow { font-family: var(--mono); font-size: 13px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); display: block; margin-bottom: 28px; animation: fade-up 0.6s ease both 0.1s; }
.ds-h1 { font-family: var(--display); font-size: clamp(44px, 5.5vw, 72px); font-weight: 900; line-height: 1.05; margin-bottom: 28px; animation: fade-up 0.6s ease both 0.2s; letter-spacing: -0.02em; }
.ds-h1 em { font-style: normal; color: var(--accent); font-weight: 400; }
.ds-cursor { color: var(--accent); animation: cursor-blink 0.75s step-end infinite; }
@keyframes cursor-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes fight-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }
.ds-fight-loop { animation: fight-pulse 2.8s ease-in-out infinite; display: inline-block; }
.ds-hero-sub { font-size: 16px; color: var(--muted); line-height: 1.85; margin-bottom: 44px; font-weight: 400; animation: fade-up 0.6s ease both 0.3s; }
.ds-hero-ctas { display: flex; gap: 20px; align-items: center; animation: fade-up 0.6s ease both 0.4s; }
.ds-hero-free-note { font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; color: var(--muted); text-transform: uppercase; margin-top: 14px; animation: fade-up 0.6s ease both 0.5s; }

/* CAROUSEL */
.ds-carousel { position: relative; animation: fade-up 0.7s ease both 0.35s; }
.ds-carousel-card { background: white; border: 1px solid var(--border); padding: 28px; animation: card-slide-fade 0.55s ease; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
@keyframes card-slide-fade { from { opacity: 0; transform: translateX(12px) translateY(4px); } to { opacity: 1; transform: translateX(0) translateY(0); } }
.ds-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.ds-card-lbl { font-family: var(--mono); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
.ds-card-lbl-vs { color: var(--accent); }
.ds-card-rounds { display: flex; gap: 4px; }
.ds-card-round-pip { width: 20px; height: 3px; background: var(--border); transition: background 0.3s; }
.ds-card-round-pip-on { background: var(--accent); }
.ds-card-txt { font-size: 14px; line-height: 1.7; margin-bottom: 16px; font-weight: 400; }
.ds-card-yours { color: var(--muted); font-style: italic; }
.ds-card-counter { color: var(--ink); }
.ds-card-hr { border: none; border-top: 1px solid var(--border); margin: 16px 0; }
.ds-card-foot { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border); }
.ds-round-lbl { font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
.ds-defend-lbl { font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); }
.ds-carousel-dots { display: flex; gap: 6px; justify-content: center; margin-top: 14px; }
.ds-carousel-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border); cursor: pointer; transition: background 0.3s; border: none; padding: 0; }
.ds-carousel-dot-on { background: var(--accent); }

/* SECTIONS */
.ds-section { padding: 96px 48px; }
.ds-section-alt { background: var(--surface); }
.ds-section-dark { background: var(--ink); }
.ds-section-inner { max-width: 1100px; margin: 0 auto; }
.ds-section-lbl { font-family: var(--mono); font-size: 13px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); display: block; margin-bottom: 52px; }
.ds-h2 { font-family: var(--display); font-size: clamp(34px, 4vw, 52px); font-weight: 700; line-height: 1.1; margin-bottom: 52px; letter-spacing: -0.02em; }

/* HOW IT WORKS */
.ds-steps { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 48px; padding-top: 8px; }
.ds-step-num { font-family: var(--mono); font-size: 13px; color: var(--accent); letter-spacing: 0.12em; margin-bottom: 20px; opacity: 0.7; }
.ds-step-title { font-family: var(--display); font-size: 22px; font-weight: 700; margin-bottom: 16px; line-height: 1.2; }
.ds-step-body { font-size: 15px; color: var(--muted); line-height: 1.85; font-weight: 400; }

/* VERDICT SECTION */
.ds-scores { }
.ds-score-row { display: flex; align-items: center; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid rgba(0,0,0,0.08); gap: 32px; }
.ds-score-row:first-child { border-top: 1px solid rgba(0,0,0,0.08); }
.ds-score-meta { flex: 1; }
.ds-score-lbl { font-family: var(--sans); font-size: 15px; font-weight: 500; display: block; margin-bottom: 4px; }
.ds-score-note { font-size: 13px; color: var(--muted); font-style: italic; font-weight: 400; }
.ds-score-flag { font-family: var(--mono); font-size: 13px; color: var(--accent); letter-spacing: 0.08em; white-space: nowrap; }

/* TESTIMONIALS */
.ds-testi-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; }
.ds-testi { display: flex; flex-direction: column; gap: 20px; background: white; padding: 32px; box-shadow: 0 2px 16px rgba(0,0,0,0.05); }
.ds-testi-mark { font-family: var(--display); font-size: 56px; font-weight: 900; color: var(--accent); line-height: 0.8; opacity: 0.2; }
.ds-testi-quote { font-size: 15px; line-height: 1.85; color: var(--ink); font-weight: 400; flex: 1; }
.ds-testi-author { padding-top: 16px; border-top: 1px solid var(--border); }
.ds-testi-name { font-family: var(--sans); font-size: 13px; font-weight: 500; display: block; }
.ds-testi-role { font-family: var(--mono); font-size: 13px; color: var(--muted); letter-spacing: 0.06em; margin-top: 3px; display: block; }

/* PRICING */
.ds-pricing { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.ds-plan { padding: 40px; border: 1px solid var(--border); display: flex; flex-direction: column; gap: 22px; box-shadow: 0 2px 16px rgba(0,0,0,0.05); }
.ds-plan-dark { background: var(--ink); color: var(--bg); border-color: var(--ink); box-shadow: 0 4px 32px rgba(0,0,0,0.15); }
.ds-plan-head { display: flex; justify-content: space-between; align-items: baseline; }
.ds-plan-name { font-family: var(--display); font-size: 26px; font-weight: 700; }
.ds-plan-price { font-family: var(--mono); font-size: 22px; }
.ds-plan-per { font-size: 14px; opacity: 0.5; }
.ds-plan-desc { font-size: 15px; opacity: 0.7; font-weight: 400; }
.ds-plan-list { list-style: none; display: flex; flex-direction: column; gap: 11px; flex: 1; }
.ds-plan-list li { font-size: 14px; padding-left: 18px; position: relative; opacity: 0.85; font-weight: 400; }
.ds-plan-list li::before { content: '-'; position: absolute; left: 0; opacity: 0.35; }
.ds-plan-note { font-family: var(--mono); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-top: -10px; }
.ds-plan-dark .ds-plan-note { color: rgba(249,247,242,0.35); }

/* BUTTONS */
.ds-btn-primary { background: var(--ink); color: var(--bg); border: none; cursor: pointer; font-family: var(--mono); font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; padding: 16px 36px; transition: transform 0.15s, box-shadow 0.2s; align-self: flex-start; box-shadow: 0 2px 10px rgba(0,0,0,0.22); }
.ds-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(0,0,0,0.28); }
.ds-btn-primary:disabled { opacity: 0.35; cursor: not-allowed; transform: none; box-shadow: none; }
.ds-plan-dark .ds-btn-primary { background: var(--bg); color: var(--ink); }
.ds-btn-outline { background: none; border: 1px solid var(--border); cursor: pointer; font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; padding: 14px 28px; color: var(--ink); transition: border-color 0.2s, transform 0.15s; align-self: flex-start; }
.ds-btn-outline:hover { border-color: var(--ink); transform: translateY(-1px); }
.ds-btn-ghost { background: transparent; border: 1.5px solid var(--ink); cursor: pointer; font-family: var(--mono); font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink); padding: 14px 28px; text-decoration: none; transition: color 0.2s, border-color 0.2s; display: inline-block; }
.ds-btn-ghost:hover { color: var(--accent); border-color: var(--accent); }
.ds-btn-danger { background: var(--accent); color: white; border: none; cursor: pointer; font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; padding: 14px 28px; transition: opacity 0.2s; width: 100%; }
.ds-btn-danger:hover { opacity: 0.85; }
.ds-btn-full { width: 100%; text-align: center; align-self: stretch; }
.ds-back-btn { background: none; border: none; cursor: pointer; font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink); padding: 0; display: flex; align-items: center; gap: 8px; transition: color 0.2s; margin-bottom: 48px; opacity: 0.7; }
.ds-back-btn:hover { opacity: 1; color: var(--accent); }

/* FOOTER */
.ds-footer { padding: 36px 48px; background: var(--ink); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.ds-footer-links { display: flex; gap: 24px; flex-wrap: wrap; }
.ds-footer .ds-logo { color: var(--bg); opacity: 0.7; }
.ds-footer-links button { font-size: 13px; color: rgba(249,247,242,0.5); transition: color 0.2s; background: none; border: none; cursor: pointer; font-family: var(--sans); padding: 0; font-weight: 400; }
.ds-footer-links button:hover { color: var(--bg); }
.ds-footer-copy { font-family: var(--mono); font-size: 12px; color: rgba(249,247,242,0.4); }

/* MODALS */
.ds-overlay { position: fixed; inset: 0; background: rgba(26,23,20,0.7); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 24px; backdrop-filter: blur(4px); }
.ds-modal { background: var(--bg); border: 1px solid var(--border); padding: 52px; width: 100%; max-width: 440px; position: relative; animation: modal-in 0.28s ease; max-height: 90vh; overflow-y: auto; box-shadow: 0 8px 48px rgba(0,0,0,0.15); }
.ds-modal-wide { max-width: 700px; padding: 48px; }
@keyframes modal-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
.ds-modal-x { position: absolute; top: 18px; right: 22px; background: none; border: none; cursor: pointer; font-size: 18px; color: var(--muted); line-height: 1; transition: color 0.2s; }
.ds-modal-x:hover { color: var(--ink); }
.ds-modal-title { font-family: var(--display); font-size: 30px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.02em; }
.ds-modal-sub { font-size: 14px; color: var(--muted); margin-bottom: 28px; line-height: 1.7; font-weight: 400; }
.ds-modal-sub strong { color: var(--ink); font-weight: 500; }
.ds-input { width: 100%; border: 1px solid var(--border); background: white; padding: 13px 14px; font-family: var(--sans); font-size: 15px; color: var(--ink); margin-bottom: 16px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; border-radius: 0; -webkit-appearance: none; font-weight: 400; }
.ds-input:focus { border-color: var(--ink); box-shadow: 0 0 0 3px rgba(26,23,20,0.08); }
.ds-modal-switch { margin-top: 22px; font-size: 13px; color: var(--muted); text-align: center; font-weight: 400; }
.ds-text-btn { background: none; border: none; cursor: pointer; font-family: var(--sans); font-size: 13px; color: var(--ink); text-decoration: underline; padding: 0; }
.ds-delete-stack { display: flex; flex-direction: column; gap: 12px; }
.ds-delete-stack .ds-btn-outline { width: 100%; text-align: center; }

/* HISTORY */
.ds-history-list { display: flex; flex-direction: column; margin-bottom: 8px; }
.ds-history-lbl { font-family: var(--mono); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
.ds-history-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border); gap: 12px; }
.ds-history-row:first-of-type { border-top: 1px solid var(--border); }
.ds-history-info { flex: 1; min-width: 0; }
.ds-history-title { font-size: 13px; font-weight: 500; display: block; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ds-history-date { font-family: var(--mono); font-size: 12px; color: var(--muted); }
.ds-history-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.ds-download-btn { background: none; border: 1px solid var(--border); cursor: pointer; font-family: var(--mono); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); padding: 5px 10px; transition: all 0.2s; }
.ds-download-btn:hover { border-color: var(--ink); color: var(--ink); }
.ds-history-empty { text-align: center; padding: 40px 0; }
.ds-history-empty-title { font-family: var(--display); font-size: 20px; font-weight: 700; margin-bottom: 8px; }
.ds-history-empty-sub { font-size: 14px; color: var(--muted); margin-bottom: 24px; line-height: 1.7; }

/* COOKIE */
.ds-cookie { position: fixed; bottom: 0; left: 0; right: 0; background: var(--ink); color: var(--bg); padding: 18px 48px; display: flex; align-items: center; justify-content: space-between; gap: 24px; z-index: 400; animation: cookie-in 0.4s ease; flex-wrap: wrap; }
@keyframes cookie-in { from { transform: translateY(100%); } to { transform: translateY(0); } }
.ds-cookie-text { font-size: 13px; font-weight: 400; opacity: 0.85; line-height: 1.6; flex: 1; min-width: 240px; }
.ds-cookie-text button { background: none; border: none; color: inherit; text-decoration: underline; cursor: pointer; font-size: 13px; opacity: 0.7; padding: 0; font-family: var(--sans); }
.ds-cookie-actions { display: flex; gap: 12px; align-items: center; flex-shrink: 0; }
.ds-cookie-accept { background: var(--bg); color: var(--ink); border: none; cursor: pointer; font-family: var(--mono); font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; padding: 10px 20px; transition: opacity 0.2s; }
.ds-cookie-accept:hover { opacity: 0.85; }
.ds-cookie-decline { background: none; border: 1px solid rgba(249,247,242,0.3); color: var(--bg); cursor: pointer; font-family: var(--mono); font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; padding: 10px 20px; opacity: 0.7; transition: opacity 0.2s; }
.ds-cookie-decline:hover { opacity: 1; }

/* PAYMENT GATE */
.ds-gate-header { margin-bottom: 32px; text-align: center; }
.ds-gate-title { font-family: var(--display); font-size: 28px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 8px; }
.ds-gate-sub { font-size: 14px; color: var(--muted); font-weight: 400; line-height: 1.7; }
.ds-gate-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.ds-gate-card { padding: 28px; border: 1px solid var(--border); display: flex; flex-direction: column; gap: 14px; }
.ds-gate-card-dark { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.ds-gate-card-head { display: flex; justify-content: space-between; align-items: baseline; }
.ds-gate-card-name { font-family: var(--display); font-size: 20px; font-weight: 700; }
.ds-gate-card-price { font-family: var(--mono); font-size: 18px; }
.ds-gate-card-per { font-size: 12px; opacity: 0.5; }
.ds-gate-list { list-style: none; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.ds-gate-list li { font-size: 13px; padding-left: 16px; position: relative; opacity: 0.85; font-weight: 400; }
.ds-gate-list li::before { content: '-'; position: absolute; left: 0; opacity: 0.4; }
.ds-gate-btn-primary { background: var(--bg); color: var(--ink); border: none; cursor: pointer; font-family: var(--mono); font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; padding: 13px 20px; width: 100%; transition: opacity 0.2s; }
.ds-gate-btn-primary:hover { opacity: 0.85; }
.ds-gate-btn-outline { background: none; border: 1px solid var(--border); cursor: pointer; font-family: var(--mono); font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; padding: 13px 20px; width: 100%; color: var(--ink); transition: border-color 0.2s; }
.ds-gate-btn-outline:hover { border-color: var(--ink); }
.ds-gate-terms { font-family: var(--mono); font-size: 12px; letter-spacing: 0.04em; color: rgba(249,247,242,0.35); line-height: 1.6; }
.ds-gate-note { font-family: var(--mono); font-size: 12px; letter-spacing: 0.04em; color: var(--muted); line-height: 1.6; }

/* SPARRING */
.spar-page { max-width: 680px; margin: 0 auto; padding: 48px 48px 100px; min-height: calc(100vh - 70px); }
.spar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 52px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
.spar-exit { background: none; border: none; cursor: pointer; font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink); transition: color 0.2s; padding: 0; opacity: 0.6; }
.spar-exit:hover { opacity: 1; color: var(--accent); }
.spar-progress { display: flex; align-items: center; gap: 10px; }
.spar-prog-bar { display: flex; gap: 5px; }
.spar-prog-pip { width: 32px; height: 4px; background: var(--border); transition: background 0.4s; }
.spar-prog-pip-active { background: var(--accent); }
.spar-prog-pip-done { background: var(--ink); }
.spar-prog-label { font-family: var(--mono); font-size: 13px; letter-spacing: 0.1em; color: var(--muted); text-transform: uppercase; }
.spar-prompt-title { font-family: var(--display); font-size: 28px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 10px; }
.spar-prompt-sub { font-size: 15px; color: var(--muted); margin-bottom: 32px; font-weight: 400; line-height: 1.7; }
.spar-textarea { width: 100%; border: 1px solid var(--border); background: white; padding: 18px; font-family: var(--sans); font-size: 15px; color: var(--ink); outline: none; resize: vertical; min-height: 160px; transition: border-color 0.2s, box-shadow 0.2s; border-radius: 0; line-height: 1.75; font-weight: 400; }
.spar-textarea:focus { border-color: var(--ink); box-shadow: 0 0 0 3px rgba(26,23,20,0.07); }
.spar-submit-row { display: flex; justify-content: flex-end; margin-top: 14px; }
.spar-char-hint { font-family: var(--mono); font-size: 12px; color: var(--muted); letter-spacing: 0.08em; margin-top: 8px; }
.spar-thread { display: flex; flex-direction: column; }
.spar-turn { padding: 28px 0; border-bottom: 1px solid var(--border); }
.spar-turn:first-child { border-top: 1px solid var(--border); }
.spar-turn-lbl { font-family: var(--mono); font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; display: block; }
.spar-turn-lbl-counter { color: var(--accent); }
.spar-turn-text { font-size: 15px; line-height: 1.85; font-weight: 400; }
.spar-turn-text-user { color: var(--muted); font-style: italic; }
.spar-counter-body { border-left: 3px solid var(--accent); padding-left: 18px; animation: counter-in 0.35s ease; }
@keyframes counter-in { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }
.spar-turn-text-counter { color: var(--ink); }
.spar-defense { padding-top: 32px; }
.spar-defense-lbl { font-family: var(--mono); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; display: block; }
.spar-loading { display: flex; align-items: center; gap: 12px; padding: 32px 0; }
.spar-loading-dots { display: flex; gap: 6px; }
.spar-loading-dot { width: 7px; height: 7px; background: var(--border); border-radius: 50%; animation: dot-pulse 1.3s ease infinite; }
.spar-loading-dot:nth-child(2) { animation-delay: 0.2s; }
.spar-loading-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes dot-pulse { 0%,100% { background: var(--border); transform: scale(1); } 50% { background: var(--accent); transform: scale(1.3); } }
.spar-loading-text { font-family: var(--mono); font-size: 13px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }
.spar-wall { border: 1px solid var(--border); padding: 40px; margin-top: 32px; text-align: center; background: var(--surface); }
.spar-wall-title { font-family: var(--display); font-size: 24px; font-weight: 700; margin-bottom: 10px; }
.spar-wall-sub { font-size: 15px; color: var(--muted); margin-bottom: 28px; font-weight: 400; line-height: 1.7; }
.spar-wall-ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.spar-error { background: #FFF0EE; border: 1px solid #F5C5BB; padding: 16px 20px; margin-top: 16px; }
.spar-error-text { font-size: 13px; color: var(--accent); font-weight: 400; }
.spar-verdict { margin-top: 40px; padding-top: 40px; border-top: 2px solid var(--ink); }
.spar-verdict-header { margin-bottom: 32px; }
.spar-verdict-title { font-family: var(--display); font-size: 26px; font-weight: 700; margin-bottom: 6px; }
.spar-verdict-sub { font-size: 14px; color: var(--muted); font-weight: 400; }
.spar-verdict-scores { margin-bottom: 28px; }
.spar-verdict-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--border); gap: 20px; animation: fade-up 0.4s ease both; }
.spar-verdict-lbl { font-size: 14px; font-weight: 500; flex: 1; }
.spar-blind-title { font-family: var(--mono); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
.spar-blind-item { font-size: 14px; color: var(--muted); padding-left: 20px; position: relative; margin-bottom: 8px; font-weight: 400; line-height: 1.6; }
.spar-blind-item::before { content: 'x'; position: absolute; left: 0; font-size: 13px; color: var(--accent); font-family: var(--mono); }
.spar-verdict-summary { font-size: 15px; color: var(--ink); line-height: 1.85; font-weight: 400; padding: 22px; background: var(--surface); border-left: 3px solid var(--ink); margin-top: 24px; animation: fade-up 0.5s ease both 0.3s; }
.spar-verdict-actions { display: flex; gap: 12px; margin-top: 32px; flex-wrap: wrap; }

/* LEGAL */
.ds-legal { padding: 64px 48px 88px; max-width: 720px; margin: 0 auto; }
.ds-legal-title { font-family: var(--display); font-size: clamp(32px, 4vw, 52px); font-weight: 900; letter-spacing: -0.02em; margin-bottom: 8px; }
.ds-legal-date { font-family: var(--mono); font-size: 13px; color: var(--muted); letter-spacing: 0.1em; margin-bottom: 52px; display: block; }
.ds-legal h2 { font-family: var(--display); font-size: 18px; font-weight: 700; margin-bottom: 12px; margin-top: 40px; }
.ds-legal p { font-size: 15px; color: #3A3733; line-height: 1.9; margin-bottom: 16px; font-weight: 400; }
.ds-legal ul { padding-left: 0; list-style: none; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; }
.ds-legal ul li { font-size: 15px; color: #3A3733; line-height: 1.7; font-weight: 400; padding-left: 20px; position: relative; }
.ds-legal ul li::before { content: '-'; position: absolute; left: 0; color: var(--muted); }
.ds-legal a { color: var(--ink); }
.ds-legal-rule { border: none; border-top: 1px solid var(--border); margin: 40px 0; }

/* TOAST */
.ds-toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: var(--ink); color: var(--bg); padding: 13px 26px; font-family: var(--mono); font-size: 12px; letter-spacing: 0.08em; z-index: 1000; white-space: nowrap; animation: toast-in 0.3s ease, toast-out 0.3s ease 2.7s forwards; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
@keyframes toast-in { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
@keyframes toast-out { to { opacity: 0; } }
@keyframes fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

/* SCROLL REVEALS */
.ds-reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
.ds-reveal.ds-in-view { opacity: 1; transform: translateY(0); }
.ds-reveal-d1 { transition-delay: 0.1s; }
.ds-reveal-d2 { transition-delay: 0.2s; }
.ds-reveal-d3 { transition-delay: 0.3s; }
@keyframes word-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes pip-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }

/* DELETE CHECKBOX */
.ds-check-label { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; padding: 16px; background: #FFF8F6; border: 1px solid #F5C5BB; margin-bottom: 20px; }
.ds-check-label input[type="checkbox"] { width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px; accent-color: var(--accent); cursor: pointer; }
.ds-check-text { font-size: 13px; color: var(--ink); line-height: 1.65; font-weight: 400; }
.ds-auth-error { font-size: 13px; color: var(--accent); margin-bottom: 12px; padding: 10px 14px; background: #FFF0EE; border: 1px solid #F5C5BB; line-height: 1.5; }

@media (prefers-reduced-motion: reduce) {
  .ds-reveal { opacity: 1; transform: none; transition: none; }
  .ds-cursor { animation: none; }
  .ds-fight-loop { animation: none; }
}
@media (max-width: 768px) {
  .ds-nav { padding: 16px 20px; } .ds-hero { padding: 52px 20px 60px; } .ds-hero-inner { grid-template-columns: 1fr; gap: 44px; }
  .ds-section { padding: 64px 20px; } .ds-steps { grid-template-columns: 1fr; gap: 36px; } .ds-testi-grid { grid-template-columns: 1fr; gap: 24px; }
  .ds-pricing { grid-template-columns: 1fr; } .ds-footer { padding: 28px 20px; flex-direction: column; gap: 16px; text-align: center; }
  .ds-score-row { flex-direction: column; align-items: flex-start; gap: 12px; } .ds-modal { padding: 36px 24px; } .ds-modal-wide { padding: 32px 20px; }
  .ds-legal { padding: 48px 20px 72px; } .ds-cookie { padding: 16px 20px; flex-direction: column; align-items: flex-start; gap: 16px; }
  .spar-page { padding: 32px 20px 80px; } .spar-wall-ctas { flex-direction: column; }
  .ds-gate-cards { grid-template-columns: 1fr; } .ds-proof { gap: 32px; padding: 20px; }
}
`;

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
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={i} style={{ display: "inline", opacity: 0, animation: "word-in 0.25s ease " + (80 + i * 38) + "ms forwards" }}>
          {word}{i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
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
  const lines = [
    "DESIGN SPARRING - SESSION RECORD", "=".repeat(44), "",
    "Title:  " + session.title, "Date:   " + session.created_at || session.date,
    "Score:  " + (session.score || "N/A") + " / 5", "",
    "-".repeat(44), "RATIONALE", "-".repeat(44), session.rationale, "",
    "=".repeat(44), "design-sparring.vercel.app",
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sparring-" + (session.title || "session").toLowerCase().replace(/\s+/g, "-") + ".txt";
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
        try { setVerdict(JSON.parse(vRaw.replace(/```json|```/g, "").trim())); setStatus("verdict"); }
        catch { setError("Verdict parsing failed."); setStatus("verdict"); }
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
      {page === "privacy" && <><h1 className="ds-legal-title">Privacy Policy</h1><span className="ds-legal-date">Effective date: May 2026</span><h2>What this is</h2><p>Design Sparring collects the minimum information necessary to provide the service.</p><h2>What we collect</h2><p>We collect your email address when you create an account, used solely for authentication via magic links. We store your sparring session data for up to 30 days on the paid tier.</p><h2>How we use your data</h2><ul><li>To send you a magic link for authentication</li><li>To associate your sessions with your account</li><li>To process payments securely through our payment provider</li></ul><h2>Data retention</h2><p>Your account is retained until you delete it. Session data is deleted automatically after 30 days.</p><h2>Contact</h2><p><a href="mailto:privacy@design-sparring.org">privacy@design-sparring.org</a></p></>}
      {page === "terms" && <><h1 className="ds-legal-title">Terms of Service</h1><span className="ds-legal-date">Effective date: May 2026</span><h2>Acceptance</h2><p>By creating an account or using Design Sparring, you agree to these terms.</p><h2>What the service is</h2><p>Design Sparring provides AI-generated counter-arguments and structured scoring for design decisions. It is a decision-support tool, not professional advice.</p><h2>Accounts and billing</h2><p>Accounts are available on the paid plan only. Cancel anytime. No refunds for partial months.</p><h2>Free tier</h2><p>The free tier (1 round, no account) is available without registration. No session data is retained.</p><h2>Contact</h2><p><a href="mailto:legal@design-sparring.org">legal@design-sparring.org</a></p></>}
      {page === "cookies" && <><h1 className="ds-legal-title">Cookie Policy</h1><span className="ds-legal-date">Effective date: May 2026</span><h2>What we use</h2><p>Design Sparring uses only essential cookies. No advertising, no cross-site tracking.</p><ul><li>Session cookie - keeps you authenticated</li><li>CSRF token - security against cross-site request forgery</li><li>Cookie consent - stores your preference</li></ul><h2>Contact</h2><p><a href="mailto:privacy@design-sparring.org">privacy@design-sparring.org</a></p></>}
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
  const router = useRouter();

  useEffect(() => {
    const link = document.createElement("link"); link.rel = "stylesheet"; link.href = FONTS;
    document.head.appendChild(link);
    const style = document.createElement("style"); style.textContent = CSS;
    document.head.appendChild(style);
    // Check cookie consent from localStorage
    const stored = localStorage.getItem("ds_cookies_consent");
    if (!stored) setCookiesAccepted(false);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveRound((r) => (r + 1) % 3), 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!authStatus) return;
    if (authStatus === "success") { router.refresh(); window.history.replaceState({}, "", "/"); }
    else if (authStatus === "expired") { setModal("auth-expired"); window.history.replaceState({}, "", "/"); }
    else { showToast("Something went wrong. Please try signing in again."); window.history.replaceState({}, "", "/"); }
  }, [authStatus]);

  useEffect(() => {
    if (user && user.plan !== "paid") { setModal("payment-gate"); }
  }, [user?.email]);

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
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else showToast("Payment unavailable right now. Try again soon.");
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
        <div>
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
                  <button className="ds-dropdown-item" onClick={handleCancelSub}>Cancel subscription</button>
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
                  <button className="ds-btn-primary" onClick={() => goPage("spar")}>Start sparring free</button>
                  <a className="ds-btn-ghost" href="#pricing">See pricing</a>
                </div>
                <p className="ds-hero-free-note">Free tier - no account required</p>
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
              <ProofNum target={34} />
              <span className="ds-proof-label">countries represented</span>
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
          <section className="ds-section ds-section-alt">
            <div className="ds-section-inner">
              <span className="ds-section-lbl ds-reveal">The verdict</span>
              <h2 className="ds-h2 ds-reveal ds-reveal-d1">Four dimensions.<br />No softening.</h2>
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
                  <button className="ds-btn-outline" onClick={() => goPage("spar")}>Start sparring free</button>
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
      <footer className="ds-footer">
        <div className="ds-logo-wrap" onClick={() => goPage("home")}>
          <DSLogo size={22} light={true} />
          <span className="ds-logo">Design Sparring</span>
        </div>
        <div className="ds-footer-links">
          <button onClick={() => goPage("privacy")}>Privacy</button>
          <button onClick={() => goPage("terms")}>Terms</button>
          <button onClick={() => goPage("cookies")}>Cookies</button>
        </div>
        <span className="ds-footer-copy">2026</span>
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
                    <button className="ds-gate-btn-primary" onClick={handleUpgrade}>Unlock full access</button>
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
                          {s.verdict && <Pips score={Math.round((s.verdict.clarity + s.verdict.userImpact + s.verdict.defensibility) / 3)} size="sm" />}
                          <button className="ds-download-btn" onClick={() => downloadSession(s)}>Save</button>
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