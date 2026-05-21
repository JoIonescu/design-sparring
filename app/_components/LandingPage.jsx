'use client'
import { useState, useEffect, useRef } from "react";

const FONTS = "https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Roboto:wght@400;500&family=DM+Mono:wght@300;400&display=swap";

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #F9F7F2; --ink: #1A1714; --accent: #C63B15;
  --muted: #918D87; --surface: #F0EDE6; --border: #DDD9D1;
  --display: 'Lato', sans-serif; --sans: 'Roboto', sans-serif; --mono: 'DM Mono', monospace;
}
body { background: var(--bg); }
.ds { font-family: var(--sans); background: var(--bg); color: var(--ink); min-height: 100vh; font-size: 16px; line-height: 1.6; }
.ds-nav { display: flex; align-items: center; justify-content: space-between; padding: 20px 48px; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 100; }
.ds-logo { font-family: var(--mono); font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink); cursor: pointer; }
.ds-nav-links { display: flex; align-items: center; gap: 12px; }
.ds-link-btn { background: none; border: none; cursor: pointer; font-family: var(--sans); font-size: 14px; color: var(--muted); padding: 8px 12px; transition: color 0.2s; }
.ds-link-btn:hover { color: var(--ink); }
.ds-cta-sm { background: var(--ink); color: var(--bg); border: none; cursor: pointer; font-family: var(--mono); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; padding: 10px 20px; transition: opacity 0.2s; }
.ds-cta-sm:hover { opacity: 0.8; }
.ds-account-wrap { position: relative; }
.ds-account-btn { display: flex; align-items: center; gap: 8px; background: none; border: 1px solid var(--border); cursor: pointer; font-family: var(--sans); font-size: 13px; color: var(--ink); padding: 8px 16px; transition: border-color 0.2s; }
.ds-account-btn:hover { border-color: var(--ink); }
.ds-dot { width: 6px; height: 6px; border-radius: 50%; background: #5CAD6A; flex-shrink: 0; }
.ds-dropdown { position: absolute; right: 0; top: calc(100% + 8px); background: var(--bg); border: 1px solid var(--border); min-width: 210px; z-index: 200; padding: 8px 0; }
.ds-dropdown-meta { padding: 10px 16px 12px; border-bottom: 1px solid var(--border); margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between; }
.ds-tag { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
.ds-tag-paid { color: var(--accent); }
.ds-dropdown-item { display: block; width: 100%; text-align: left; background: none; border: none; padding: 10px 16px; font-family: var(--sans); font-size: 14px; color: var(--ink); cursor: pointer; transition: background 0.15s; }
.ds-dropdown-item:hover { background: var(--surface); }
.ds-dropdown-divider { border: none; border-top: 1px solid var(--border); margin: 4px 0; }
.ds-danger-item { color: var(--accent) !important; }
.ds-upgrade-item { color: var(--accent); font-weight: 500; }
.ds-hero { padding: 88px 48px 64px; }
.ds-hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; max-width: 1100px; margin: 0 auto; }
.ds-eyebrow { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 28px; animation: fade-up 0.6s ease both 0.1s; }
.ds-h1 { font-family: var(--display); font-size: clamp(44px, 5.5vw, 72px); font-weight: 900; line-height: 1.05; margin-bottom: 28px; animation: fade-up 0.6s ease both 0.2s; letter-spacing: -0.02em; }
.ds-h1 em { font-style: normal; color: var(--accent); font-weight: 400; }
.ds-hero-sub { font-size: 15px; color: var(--muted); line-height: 1.8; margin-bottom: 44px; font-weight: 400; animation: fade-up 0.6s ease both 0.3s; }
.ds-hero-ctas { display: flex; gap: 20px; align-items: center; animation: fade-up 0.6s ease both 0.4s; }
.ds-hero-free-note { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; color: var(--muted); text-transform: uppercase; margin-top: 12px; animation: fade-up 0.6s ease both 0.5s; }
.ds-card-mockup { background: white; border: 1px solid var(--border); padding: 28px; animation: fade-up 0.7s ease both 0.35s; }
.ds-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.ds-card-lbl { font-family: var(--mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
.ds-card-lbl-vs { color: var(--accent); }
.ds-card-rounds { display: flex; gap: 4px; }
.ds-card-round-pip { width: 20px; height: 3px; background: var(--border); }
.ds-card-round-pip-on { background: var(--accent); }
.ds-card-txt { font-size: 14px; line-height: 1.7; margin-bottom: 16px; font-weight: 400; }
.ds-card-yours { color: var(--muted); font-style: italic; }
.ds-card-counter { color: var(--ink); }
.ds-card-hr { border: none; border-top: 1px solid var(--border); margin: 16px 0; }
.ds-card-foot { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border); }
.ds-round-lbl { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
.ds-defend-lbl { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); }
.ds-hero-rule { max-width: 1100px; margin: 64px auto 0; border: none; border-top: 1px solid var(--border); }
.ds-section { padding: 88px 48px; }
.ds-section-inner { max-width: 1100px; margin: 0 auto; }
.ds-section-lbl { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 48px; }
.ds-h2 { font-family: var(--display); font-size: clamp(34px, 4vw, 52px); font-weight: 700; line-height: 1.1; margin-bottom: 52px; letter-spacing: -0.02em; }
.ds-steps { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 48px; border-top: 1px solid var(--border); padding-top: 36px; }
.ds-step-num { font-family: var(--mono); font-size: 11px; color: var(--muted); letter-spacing: 0.12em; margin-bottom: 20px; }
.ds-step-title { font-family: var(--display); font-size: 22px; font-weight: 700; margin-bottom: 16px; line-height: 1.2; }
.ds-step-body { font-size: 14px; color: var(--muted); line-height: 1.8; font-weight: 400; }
.ds-verdict-section { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.ds-scores { border-top: 1px solid var(--border); }
.ds-score-row { display: flex; align-items: center; justify-content: space-between; padding: 22px 0; border-bottom: 1px solid var(--border); gap: 32px; }
.ds-score-meta { flex: 1; }
.ds-score-lbl { font-family: var(--sans); font-size: 15px; font-weight: 500; display: block; margin-bottom: 4px; }
.ds-score-note { font-size: 13px; color: var(--muted); font-style: italic; font-weight: 400; }
.ds-score-bar { display: flex; gap: 5px; }
.ds-pip { width: 28px; height: 5px; background: var(--border); }
.ds-pip-on { background: var(--ink); }
.ds-score-flag { font-family: var(--mono); font-size: 11px; color: var(--accent); letter-spacing: 0.08em; white-space: nowrap; }
.ds-testi-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px; border-top: 1px solid var(--border); padding-top: 36px; }
.ds-testi { display: flex; flex-direction: column; gap: 20px; }
.ds-testi-mark { font-family: var(--display); font-size: 64px; font-weight: 900; color: var(--border); line-height: 0.8; }
.ds-testi-quote { font-size: 15px; line-height: 1.8; color: var(--ink); font-weight: 400; flex: 1; }
.ds-testi-author { border-top: 1px solid var(--border); padding-top: 16px; }
.ds-testi-name { font-family: var(--sans); font-size: 13px; font-weight: 500; display: block; }
.ds-testi-role { font-family: var(--mono); font-size: 11px; color: var(--muted); letter-spacing: 0.06em; margin-top: 3px; display: block; }
.ds-pricing { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; border-top: 1px solid var(--border); padding-top: 36px; }
.ds-plan { padding: 40px; border: 1px solid var(--border); display: flex; flex-direction: column; gap: 22px; }
.ds-plan-dark { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.ds-plan-head { display: flex; justify-content: space-between; align-items: baseline; }
.ds-plan-name { font-family: var(--display); font-size: 26px; font-weight: 700; }
.ds-plan-price { font-family: var(--mono); font-size: 22px; }
.ds-plan-per { font-size: 14px; opacity: 0.5; }
.ds-plan-desc { font-size: 14px; opacity: 0.7; font-weight: 400; }
.ds-plan-list { list-style: none; display: flex; flex-direction: column; gap: 11px; flex: 1; }
.ds-plan-list li { font-size: 14px; padding-left: 18px; position: relative; opacity: 0.85; font-weight: 400; }
.ds-plan-list li::before { content: '—'; position: absolute; left: 0; opacity: 0.35; }
.ds-plan-note { font-family: var(--mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-top: -10px; }
.ds-plan-dark .ds-plan-note { color: rgba(249,247,242,0.35); }
.ds-btn-primary { background: var(--ink); color: var(--bg); border: none; cursor: pointer; font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; padding: 14px 28px; transition: opacity 0.2s; align-self: flex-start; }
.ds-btn-primary:hover { opacity: 0.8; }
.ds-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.ds-plan-dark .ds-btn-primary { background: var(--bg); color: var(--ink); }
.ds-btn-outline { background: none; border: 1px solid var(--border); cursor: pointer; font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; padding: 14px 28px; color: var(--ink); transition: border-color 0.2s; align-self: flex-start; }
.ds-btn-outline:hover { border-color: var(--ink); }
.ds-btn-ghost { background: none; border: none; cursor: pointer; font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); padding: 14px 0; text-decoration: none; transition: color 0.2s; }
.ds-btn-ghost:hover { color: var(--ink); }
.ds-btn-danger { background: var(--accent); color: white; border: none; cursor: pointer; font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; padding: 14px 28px; transition: opacity 0.2s; width: 100%; }
.ds-btn-danger:hover { opacity: 0.85; }
.ds-btn-full { width: 100%; text-align: center; align-self: stretch; }
.ds-back-btn { background: none; border: none; cursor: pointer; font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); padding: 0; display: flex; align-items: center; gap: 8px; transition: color 0.2s; margin-bottom: 48px; }
.ds-back-btn:hover { color: var(--ink); }
.ds-footer { padding: 32px 48px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.ds-footer-links { display: flex; gap: 24px; flex-wrap: wrap; }
.ds-footer-links button { font-size: 13px; color: var(--muted); transition: color 0.2s; background: none; border: none; cursor: pointer; font-family: var(--sans); padding: 0; font-weight: 400; }
.ds-footer-links button:hover { color: var(--ink); }
.ds-footer-copy { font-family: var(--mono); font-size: 12px; color: var(--muted); }
.ds-overlay { position: fixed; inset: 0; background: rgba(26,23,20,0.55); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 24px; backdrop-filter: blur(3px); }
.ds-modal { background: var(--bg); border: 1px solid var(--border); padding: 52px; width: 100%; max-width: 440px; position: relative; animation: modal-in 0.28s ease; max-height: 90vh; overflow-y: auto; }
@keyframes modal-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
.ds-modal-x { position: absolute; top: 18px; right: 22px; background: none; border: none; cursor: pointer; font-size: 15px; color: var(--muted); line-height: 1; transition: color 0.2s; }
.ds-modal-x:hover { color: var(--ink); }
.ds-modal-title { font-family: var(--display); font-size: 30px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.02em; }
.ds-modal-sub { font-size: 14px; color: var(--muted); margin-bottom: 28px; line-height: 1.7; font-weight: 400; }
.ds-modal-sub strong { color: var(--ink); font-weight: 500; }
.ds-input { width: 100%; border: 1px solid var(--border); background: white; padding: 13px 14px; font-family: var(--sans); font-size: 15px; color: var(--ink); margin-bottom: 16px; outline: none; transition: border-color 0.2s; border-radius: 0; -webkit-appearance: none; font-weight: 400; }
.ds-input:focus { border-color: var(--ink); }
.ds-modal-switch { margin-top: 22px; font-size: 13px; color: var(--muted); text-align: center; font-weight: 400; }
.ds-text-btn { background: none; border: none; cursor: pointer; font-family: var(--sans); font-size: 13px; color: var(--ink); text-decoration: underline; padding: 0; }
.ds-magic-box { border: 1px dashed var(--border); padding: 22px; margin-top: 8px; }
.ds-magic-hint { font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; }
.ds-delete-stack { display: flex; flex-direction: column; gap: 12px; }
.ds-delete-stack .ds-btn-outline { width: 100%; text-align: center; }
.ds-acct-plan { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: var(--surface); margin-bottom: 28px; }
.ds-acct-plan-label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; }
.ds-acct-plan-free { color: var(--muted); }
.ds-acct-plan-paid { color: var(--accent); }
.ds-acct-upgrade-btn { background: none; border: 1px solid var(--accent); color: var(--accent); font-family: var(--mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; padding: 6px 12px; cursor: pointer; transition: background 0.2s, color 0.2s; }
.ds-acct-upgrade-btn:hover { background: var(--accent); color: white; }
.ds-session-list { display: flex; flex-direction: column; margin-bottom: 24px; }
.ds-session-lbl { font-family: var(--mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
.ds-session-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border); gap: 16px; }
.ds-session-row:first-of-type { border-top: 1px solid var(--border); }
.ds-session-info { flex: 1; }
.ds-session-title { font-size: 13px; font-weight: 500; display: block; margin-bottom: 2px; }
.ds-session-date { font-family: var(--mono); font-size: 10px; color: var(--muted); }
.ds-acct-danger-zone { border-top: 1px solid var(--border); padding-top: 16px; }
.ds-cookie { position: fixed; bottom: 0; left: 0; right: 0; background: var(--ink); color: var(--bg); padding: 18px 48px; display: flex; align-items: center; justify-content: space-between; gap: 24px; z-index: 400; animation: cookie-in 0.4s ease; flex-wrap: wrap; }
@keyframes cookie-in { from { transform: translateY(100%); } to { transform: translateY(0); } }
.ds-cookie-text { font-size: 13px; font-weight: 400; opacity: 0.85; line-height: 1.6; flex: 1; min-width: 240px; }
.ds-cookie-text button { background: none; border: none; color: inherit; text-decoration: underline; cursor: pointer; font-size: 13px; opacity: 0.7; padding: 0; font-family: var(--sans); }
.ds-cookie-text button:hover { opacity: 1; }
.ds-cookie-actions { display: flex; gap: 12px; align-items: center; flex-shrink: 0; }
.ds-cookie-accept { background: var(--bg); color: var(--ink); border: none; cursor: pointer; font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding: 10px 20px; transition: opacity 0.2s; }
.ds-cookie-accept:hover { opacity: 0.85; }
.ds-cookie-decline { background: none; border: 1px solid rgba(249,247,242,0.3); color: var(--bg); cursor: pointer; font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding: 10px 20px; opacity: 0.7; transition: opacity 0.2s; }
.ds-cookie-decline:hover { opacity: 1; }
.spar-page { max-width: 680px; margin: 0 auto; padding: 48px 48px 100px; min-height: calc(100vh - 70px); }
.spar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 52px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
.spar-exit { background: none; border: none; cursor: pointer; font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); transition: color 0.2s; padding: 0; }
.spar-exit:hover { color: var(--ink); }
.spar-progress { display: flex; align-items: center; gap: 10px; }
.spar-prog-bar { display: flex; gap: 5px; }
.spar-prog-pip { width: 32px; height: 4px; background: var(--border); transition: background 0.4s; }
.spar-prog-pip-active { background: var(--accent); }
.spar-prog-pip-done { background: var(--ink); }
.spar-prog-label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; color: var(--muted); text-transform: uppercase; }
.spar-prompt-title { font-family: var(--display); font-size: 28px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 10px; }
.spar-prompt-sub { font-size: 15px; color: var(--muted); margin-bottom: 32px; font-weight: 400; line-height: 1.7; }
.spar-textarea { width: 100%; border: 1px solid var(--border); background: white; padding: 18px; font-family: var(--sans); font-size: 15px; color: var(--ink); outline: none; resize: vertical; min-height: 160px; transition: border-color 0.2s; border-radius: 0; line-height: 1.75; font-weight: 400; }
.spar-textarea:focus { border-color: var(--ink); }
.spar-submit-row { display: flex; justify-content: flex-end; margin-top: 14px; }
.spar-char-hint { font-family: var(--mono); font-size: 10px; color: var(--muted); letter-spacing: 0.08em; margin-top: 8px; }
.spar-thread { display: flex; flex-direction: column; gap: 0; }
.spar-turn { padding: 28px 0; border-bottom: 1px solid var(--border); }
.spar-turn:first-child { border-top: 1px solid var(--border); }
.spar-turn-lbl { font-family: var(--mono); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; display: block; }
.spar-turn-lbl-counter { color: var(--accent); }
.spar-turn-text { font-size: 15px; line-height: 1.8; font-weight: 400; }
.spar-turn-text-user { color: var(--muted); font-style: italic; }
.spar-counter-body { border-left: 2px solid var(--accent); padding-left: 18px; }
.spar-turn-text-counter { color: var(--ink); font-weight: 400; }
.spar-defense { padding-top: 32px; }
.spar-defense-lbl { font-family: var(--mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; display: block; }
.spar-loading { display: flex; align-items: center; gap: 12px; padding: 32px 0; }
.spar-loading-dots { display: flex; gap: 6px; }
.spar-loading-dot { width: 7px; height: 7px; background: var(--border); border-radius: 50%; animation: dot-pulse 1.3s ease infinite; }
.spar-loading-dot:nth-child(2) { animation-delay: 0.2s; }
.spar-loading-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes dot-pulse { 0%,100% { background: var(--border); transform: scale(1); } 50% { background: var(--accent); transform: scale(1.3); } }
.spar-loading-text { font-family: var(--mono); font-size: 11px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }
.spar-wall { border: 1px solid var(--border); padding: 40px; margin-top: 32px; text-align: center; background: var(--surface); }
.spar-wall-title { font-family: var(--display); font-size: 24px; font-weight: 700; margin-bottom: 10px; letter-spacing: -0.01em; }
.spar-wall-sub { font-size: 15px; color: var(--muted); margin-bottom: 28px; font-weight: 400; line-height: 1.7; }
.spar-wall-ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.spar-error { background: #FFF0EE; border: 1px solid #F5C5BB; padding: 16px 20px; margin-top: 16px; }
.spar-error-text { font-size: 13px; color: var(--accent); font-weight: 400; }
.spar-verdict { margin-top: 40px; padding-top: 40px; border-top: 2px solid var(--ink); }
.spar-verdict-header { margin-bottom: 32px; }
.spar-verdict-title { font-family: var(--display); font-size: 26px; font-weight: 700; margin-bottom: 6px; letter-spacing: -0.01em; }
.spar-verdict-sub { font-size: 14px; color: var(--muted); font-weight: 400; }
.spar-verdict-scores { border-top: 1px solid var(--border); margin-bottom: 28px; }
.spar-verdict-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--border); gap: 20px; }
.spar-verdict-lbl { font-size: 14px; font-weight: 500; flex: 1; }
.spar-blind-title { font-family: var(--mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
.spar-blind-item { font-size: 14px; color: var(--muted); padding-left: 20px; position: relative; margin-bottom: 8px; font-weight: 400; line-height: 1.6; }
.spar-blind-item::before { content: '⚑'; position: absolute; left: 0; font-size: 11px; color: var(--accent); }
.spar-verdict-summary { font-size: 15px; color: var(--ink); line-height: 1.85; font-weight: 400; padding: 22px; background: var(--surface); border-left: 3px solid var(--ink); margin-top: 24px; }
.spar-verdict-actions { display: flex; gap: 12px; margin-top: 32px; flex-wrap: wrap; }
.ds-legal { padding: 64px 48px 88px; max-width: 720px; margin: 0 auto; }
.ds-legal-title { font-family: var(--display); font-size: clamp(32px, 4vw, 52px); font-weight: 900; letter-spacing: -0.02em; margin-bottom: 8px; }
.ds-legal-date { font-family: var(--mono); font-size: 11px; color: var(--muted); letter-spacing: 0.1em; margin-bottom: 52px; display: block; }
.ds-legal h2 { font-family: var(--display); font-size: 18px; font-weight: 700; margin-bottom: 12px; margin-top: 40px; }
.ds-legal p { font-size: 15px; color: #3A3733; line-height: 1.85; margin-bottom: 16px; font-weight: 400; }
.ds-legal ul { padding-left: 0; list-style: none; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; }
.ds-legal ul li { font-size: 15px; color: #3A3733; line-height: 1.7; font-weight: 400; padding-left: 20px; position: relative; }
.ds-legal ul li::before { content: '—'; position: absolute; left: 0; color: var(--muted); }
.ds-legal a { color: var(--ink); }
.ds-legal-rule { border: none; border-top: 1px solid var(--border); margin: 40px 0; }
.ds-toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: var(--ink); color: var(--bg); padding: 13px 26px; font-family: var(--mono); font-size: 12px; letter-spacing: 0.08em; z-index: 1000; white-space: nowrap; animation: toast-in 0.3s ease, toast-out 0.3s ease 2.7s forwards; }
@keyframes toast-in { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
@keyframes toast-out { to { opacity: 0; } }
@keyframes fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 768px) {
  .ds-nav { padding: 16px 20px; } .ds-hero { padding: 52px 20px 48px; } .ds-hero-inner { grid-template-columns: 1fr; gap: 44px; }
  .ds-section { padding: 60px 20px; } .ds-steps { grid-template-columns: 1fr; gap: 36px; } .ds-testi-grid { grid-template-columns: 1fr; gap: 36px; }
  .ds-pricing { grid-template-columns: 1fr; } .ds-footer { padding: 24px 20px; flex-direction: column; gap: 16px; text-align: center; }
  .ds-score-row { flex-direction: column; align-items: flex-start; gap: 12px; } .ds-modal { padding: 36px 24px; }
  .ds-legal { padding: 48px 20px 72px; } .ds-cookie { padding: 16px 20px; flex-direction: column; align-items: flex-start; gap: 16px; }
  .spar-page { padding: 32px 20px 80px; } .spar-wall-ctas { flex-direction: column; }
}
`;

const SCORES_PREVIEW = [
  { label: "Clarity", score: 3, note: "Stated but not structured. The argument needs a spine." },
  { label: "User impact", score: 4, note: "You considered the end user more than most do." },
  { label: "Defensibility", score: 2, note: "Collapsed under the second round of questioning." },
  { label: "Blind spots", score: null, note: "Mobile edge cases were never addressed." },
];
const STEPS = [
  { n: "01", title: "State your rationale", body: "Describe the design decision you've made and why. A layout choice, a pattern, a product call. Any decision counts." },
  { n: "02", title: "Defend under pressure", body: "The opponent pushes back. Three rounds. Each harder than the last. You respond, clarify, fight for your position." },
  { n: "03", title: "Take the verdict", body: "A structured score across four dimensions. Where your argument held. Where it cracked. What you missed entirely." },
];
const TESTIMONIALS = [
  { quote: "I was certain about a navigation decision I'd spent two weeks defending. By round two I couldn't hold my own argument together. We redesigned it the next morning.", name: "Sara K.", role: "Senior Product Designer" },
  { quote: "The verdict flagged a blind spot I'd been quietly skirting for a month. Cheaper and more honest than any design review I've sat through.", name: "Marcus T.", role: "UX Lead, fintech" },
  { quote: "It doesn't tell you what to do. It makes you realize you didn't actually know why you were doing it. That's the uncomfortable part. Also the useful part.", name: "Priya M.", role: "Head of Design" },
];
const SAMPLE_SESSIONS = [
  { id: 1, date: "May 18", title: "Navigation pattern decision", score: 3 },
  { id: 2, date: "May 15", title: "Carousel vs static grid", score: 2 },
  { id: 3, date: "May 12", title: "Modal vs inline form", score: 4 },
  { id: 4, date: "May 9", title: "Empty state copy direction", score: 5 },
];

function Pips({ score, total = 5, size = "normal" }) {
  const w = size === "sm" ? 14 : 28, h = size === "sm" ? 3 : 5;
  return (
    <div style={{ display: "flex", gap: size === "sm" ? 3 : 5 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: w, height: h, background: i < score ? "var(--ink)" : "var(--border)", transition: "background 0.3s" }} />
      ))}
    </div>
  );
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
  const roundsDone = exchanges.filter(e => e.role === "counter").length;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [exchanges, loading, verdict]);

  const buildMessages = (extraUser) => {
    const msgs = [{ role: "user", content: `Design decision: ${rationale}` }];
    const counters = exchanges.filter(e => e.role === "counter");
    const defenses = exchanges.filter(e => e.role === "user");
    for (let i = 0; i < counters.length; i++) {
      msgs.push({ role: "assistant", content: counters[i].text });
      if (defenses[i]) msgs.push({ role: "user", content: defenses[i].text });
    }
    if (extraUser) msgs.push({ role: "user", content: extraUser });
    return msgs;
  };

  const startFight = async () => {
    if (!rationale.trim() || rationale.trim().length < 15) { setError("Give the opponent something to work with. Describe your decision more fully."); return; }
    setError(null); setLoading(true); setStatus("fighting");
    try {
      const text = await callSpar([{ role: "user", content: `Design decision: ${rationale}` }]);
      setExchanges([{ role: "counter", text, round: 1 }]);
      if (maxRounds === 1) setStatus("wall");
    } catch { setError("Connection failed. Try again."); setStatus("input"); }
    finally { setLoading(false); }
  };

  const submitDefense = async () => {
    if (!defenseInput.trim()) return;
    const nextRound = roundsDone + 1;
    const newExchanges = [...exchanges, { role: "user", text: defenseInput, round: nextRound }];
    setExchanges(newExchanges); setDefenseInput(""); setLoading(true); setError(null);
    try {
      const msgs = buildMessages(defenseInput);
      if (nextRound >= maxRounds) {
        const counterText = await callSpar(msgs);
        const finalExchanges = [...newExchanges, { role: "counter", text: counterText, round: nextRound + 1 }];
        setExchanges(finalExchanges); setLoading(true);
        const verdictMsgs = [{ role: "user", content: `Design sparring session verdict needed.\n\nDesigner rationale: ${rationale}\n\n${finalExchanges.map(e => `${e.role === "counter" ? "Counter" : "Designer"} (Round ${e.round}): ${e.text}`).join("\n\n")}` }];
        const verdictRaw = await callSpar(verdictMsgs, true);
        try { setVerdict(JSON.parse(verdictRaw.replace(/```json|```/g, "").trim())); setStatus("verdict"); }
        catch { setError("Verdict parsing failed."); setStatus("verdict"); }
      } else {
        const text = await callSpar(msgs);
        setExchanges(prev => [...prev, { role: "counter", text, round: nextRound + 1 }]);
      }
    } catch { setError("Connection failed. Try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="spar-page">
      <div className="spar-header">
        <button className="spar-exit" onClick={onExit}>← End session</button>
        <div className="spar-progress">
          <div className="spar-prog-bar">
            {[0,1,2].map(r => <div key={r} className={`spar-prog-pip${roundsDone > r ? " spar-prog-pip-done" : roundsDone === r && status === "fighting" ? " spar-prog-pip-active" : ""}`} />)}
          </div>
          <span className="spar-prog-label">{status === "input" ? "Ready" : status === "verdict" ? "Complete" : `Round ${roundsDone + 1} / ${maxRounds}`}</span>
        </div>
      </div>

      {status === "input" && (
        <div>
          <h2 className="spar-prompt-title">State your rationale</h2>
          <p className="spar-prompt-sub">Describe a design decision you've made and why. Be specific — vague rationale gets a vague fight.</p>
          <textarea className="spar-textarea" placeholder="e.g. We decided to use a bottom navigation bar instead of a hamburger menu because users need fast access to the four main sections..." value={rationale} onChange={e => { setRationale(e.target.value); setError(null); }} />
          {error && <div className="spar-error"><p className="spar-error-text">{error}</p></div>}
          <div className="spar-submit-row"><button className="ds-btn-primary" onClick={startFight} disabled={rationale.trim().length < 15}>Enter the ring →</button></div>
          {!isPaid && <p className="spar-char-hint">Free tier — 1 round. Upgrade for 3 rounds + verdict scoring.</p>}
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
                  <><span className="spar-turn-lbl spar-turn-lbl-counter">The Counter — Round {ex.round}</span><div className="spar-counter-body"><p className="spar-turn-text spar-turn-text-counter">{ex.text}</p></div></>
                ) : (
                  <><span className="spar-turn-lbl">Your defense — Round {ex.round}</span><p className="spar-turn-text spar-turn-text-user">"{ex.text}"</p></>
                )}
              </div>
            ))}
          </div>

          {loading && <div className="spar-loading"><div className="spar-loading-dots"><div className="spar-loading-dot" /><div className="spar-loading-dot" /><div className="spar-loading-dot" /></div><span className="spar-loading-text">{roundsDone >= maxRounds ? "Calculating verdict..." : "Building counter..."}</span></div>}
          {error && <div className="spar-error"><p className="spar-error-text">{error}</p></div>}

          {!loading && status === "fighting" && roundsDone < maxRounds && exchanges[exchanges.length - 1]?.role === "counter" && (
            <div className="spar-defense">
              <span className="spar-defense-lbl">{roundsDone < maxRounds - 1 ? `Defend your position — Round ${roundsDone + 1}` : `Final defense — Round ${roundsDone + 1}`}</span>
              <textarea className="spar-textarea" placeholder="Defend your position..." value={defenseInput} onChange={e => setDefenseInput(e.target.value)} style={{ minHeight: 120 }} autoFocus />
              <div className="spar-submit-row"><button className="ds-btn-primary" onClick={submitDefense} disabled={!defenseInput.trim()}>{roundsDone < maxRounds - 1 ? "Push back →" : "Final answer →"}</button></div>
            </div>
          )}

          {status === "wall" && (
            <div className="spar-wall">
              <h3 className="spar-wall-title">Round 1 complete.</h3>
              <p className="spar-wall-sub">The free tier stops here. Upgrade to Sparring Partner for two more rounds and a scored verdict.</p>
              <div className="spar-wall-ctas">
                <button className="ds-btn-primary" onClick={onSignup}>Upgrade — $9/mo</button>
                <button className="ds-btn-outline" onClick={onExit}>End session</button>
              </div>
            </div>
          )}

          {status === "verdict" && verdict && (
            <div className="spar-verdict">
              <div className="spar-verdict-header"><h3 className="spar-verdict-title">The Verdict</h3><p className="spar-verdict-sub">After three rounds, here's how your argument held up.</p></div>
              <div className="spar-verdict-scores">
                {[{ label: "Clarity", score: verdict.clarity }, { label: "User impact", score: verdict.userImpact }, { label: "Defensibility", score: verdict.defensibility }].map(s => (
                  <div className="spar-verdict-row" key={s.label}><span className="spar-verdict-lbl">{s.label}</span><Pips score={s.score} total={5} /></div>
                ))}
              </div>
              {verdict.blindSpots?.length > 0 && <div style={{ marginBottom: 24 }}><div className="spar-blind-title">Blind spots</div>{verdict.blindSpots.map((b, i) => <p className="spar-blind-item" key={i}>{b}</p>)}</div>}
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

function LegalPage({ page, onBack, goPage }) {
  useEffect(() => { window.scrollTo(0, 0); }, [page]);
  return (
    <div className="ds-legal">
      <button className="ds-back-btn" onClick={onBack}>← Back</button>
      {page === "privacy" && <><h1 className="ds-legal-title">Privacy Policy</h1><span className="ds-legal-date">Effective date: May 2026</span><h2>What this is</h2><p>Design Sparring collects the minimum information necessary to provide the service. This policy explains what we collect, why, and what you can do about it.</p><h2>What we collect</h2><p>We collect your email address when you create an account, used solely for authentication via magic links. On the paid tier, we store your sparring session data for up to 30 days. On the free tier, no session data is retained.</p><h2>How we use your data</h2><ul><li>To send you a magic link for authentication</li><li>To associate your sessions with your account (paid tier only)</li><li>To process payments securely through our payment provider</li></ul><h2>Data retention</h2><p>Your account is retained until you delete it. Paid-tier session data is deleted automatically after 30 days. You can delete your account at any time from the account menu.</p><h2>Third parties</h2><p>We use a transactional email provider for magic links and a third-party payment processor for paid accounts. We do not sell, rent, or share your data. We do not use advertising networks or tracking pixels.</p><hr className="ds-legal-rule" /><h2>Contact</h2><p><a href="mailto:privacy@designsparring.com">privacy@designsparring.com</a></p></>}
      {page === "terms" && <><h1 className="ds-legal-title">Terms of Service</h1><span className="ds-legal-date">Effective date: May 2026</span><h2>Acceptance</h2><p>By creating an account or using Design Sparring, you agree to these terms.</p><h2>What the service is</h2><p>Design Sparring provides AI-generated counter-arguments and structured scoring for design decisions you submit. It is a decision-support tool, not professional advice. The AI opponent is intentionally adversarial — that's the point.</p><h2>Accounts</h2><p>You must be at least 16 years old to create an account. The free tier does not require an account.</p><h2>Free tier</h2><p>Up to 3 sessions per day, 1 round each, no account required. No session data is retained.</p><h2>Paid tier and billing</h2><p>Paid subscriptions are billed monthly. Cancel anytime — takes effect at end of billing period. No refunds for partial months.</p><h2>Acceptable use</h2><p>You agree not to submit illegal or harmful content, or attempt to abuse the service in ways that degrade performance for others.</p><h2>Your content</h2><p>You retain ownership of content you submit. We do not use it to train AI models or share it with third parties.</p><h2>Disclaimers</h2><p>Design Sparring is provided "as is." AI counter-arguments are intentionally one-sided. Do not make irreversible decisions based solely on output from this tool.</p><h2>Contact</h2><p><a href="mailto:legal@designsparring.com">legal@designsparring.com</a></p></>}
      {page === "cookies" && <><h1 className="ds-legal-title">Cookie Policy</h1><span className="ds-legal-date">Effective date: May 2026</span><h2>What we use</h2><p>Design Sparring uses only essential cookies — no advertising, no cross-site tracking.</p><ul><li><strong>Session cookie</strong> — Keeps you authenticated. Expires when you sign out.</li><li><strong>CSRF token</strong> — Security cookie protecting against cross-site request forgery.</li><li><strong>Cookie consent</strong> — Stores your preference so we don't ask again.</li></ul><h2>What we don't use</h2><p>No advertising cookies. No third-party analytics. No fingerprinting.</p><h2>Contact</h2><p><a href="mailto:privacy@designsparring.com">privacy@designsparring.com</a></p></>}
    </div>
  );
}

export default function LandingPage({ user: initialUser }) {
  const [user, setUser] = useState(initialUser || null);
  const [modal, setModal] = useState(null);
  const [email, setEmail] = useState("");
  const [authStep, setAuthStep] = useState("form");
  const [acctOpen, setAcctOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState(false);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState("home");
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    const link = document.createElement("link"); link.rel = "stylesheet"; link.href = FONTS;
    document.head.appendChild(link);
    const style = document.createElement("style"); style.textContent = CSS;
    document.head.appendChild(style);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const openModal = (t) => { setModal(t); setEmail(""); setAuthStep("form"); setDeleteStep(false); setAcctOpen(false); };
  const closeModal = () => { setModal(null); setEmail(""); setAuthStep("form"); setDeleteStep(false); };
  const goPage = (p) => { setPage(p); window.scrollTo(0, 0); };

  const handleAuth = async () => {
    if (!email.trim() || !email.includes("@")) return;
    if (modal === "signup" || modal === "login") {
      const res = await fetch("/api/auth/send-link", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (res.ok) setAuthStep("sent");
      else showToast("Something went wrong. Try again.");
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
    else showToast("Something went wrong.");
  };

  const handleDelete = async () => {
    if (!deleteStep) { setDeleteStep(true); return; }
    const res = await fetch("/api/account", { method: "DELETE" });
    if (res.ok) { setUser(null); closeModal(); showToast("Account deleted."); }
  };

  return (
    <div className="ds" onClick={() => acctOpen && setAcctOpen(false)}>
      <nav className="ds-nav">
        <span className="ds-logo" onClick={() => goPage("home")}>Design Sparring</span>
        <div>
          {user ? (
            <div className="ds-account-wrap" onClick={e => e.stopPropagation()}>
              <button className="ds-account-btn" onClick={() => setAcctOpen(!acctOpen)}><span className="ds-dot" /> Your account</button>
              {acctOpen && (
                <div className="ds-dropdown">
                  <div className="ds-dropdown-meta"><span className={`ds-tag${user.plan === "paid" ? " ds-tag-paid" : ""}`}>{user.plan === "paid" ? "Sparring Partner" : "Free plan"}</span>{user.plan === "free" && <button className="ds-acct-upgrade-btn" onClick={handleUpgrade}>Upgrade</button>}</div>
                  {user.plan === "paid" && <button className="ds-dropdown-item" onClick={() => { setAcctOpen(false); openModal("history"); }}>Session history</button>}
                  <div className="ds-dropdown-divider" />
                  <button className="ds-dropdown-item" onClick={handleLogout}>Sign out</button>
                  <button className="ds-dropdown-item ds-danger-item" onClick={() => openModal("delete")}>Delete account</button>
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

      {page === "spar" && <SparringInterface user={user} onExit={() => goPage("home")} onSignup={() => { goPage("home"); openModal("signup"); }} />}
      {["privacy","terms","cookies"].includes(page) && <LegalPage page={page} onBack={() => goPage("home")} goPage={goPage} />}

      {page === "home" && <>
        <section className="ds-hero">
          <div className="ds-hero-inner">
            <div>
              <span className="ds-eyebrow">Design Decision Tool</span>
              <h1 className="ds-h1">Your design<br />decisions deserve<br /><em>a fight.</em></h1>
              <p className="ds-hero-sub">Paste your design rationale. Get a structured counter-argument.<br />Three rounds. A scored verdict. No encouragement.</p>
              <div className="ds-hero-ctas">
                <button className="ds-btn-primary" onClick={() => goPage("spar")}>Start sparring free</button>
                <a className="ds-btn-ghost" href="#pricing">See pricing</a>
              </div>
              <p className="ds-hero-free-note">Free tier — no account required</p>
            </div>
            <div className="ds-card-mockup">
              <div className="ds-card-top"><div className="ds-card-lbl">Your rationale — Round 01</div><div className="ds-card-rounds"><div className="ds-card-round-pip ds-card-round-pip-on" /><div className="ds-card-round-pip" /><div className="ds-card-round-pip" /></div></div>
              <div className="ds-card-txt ds-card-yours">"We should use a carousel here. It's a familiar pattern users already know."</div>
              <hr className="ds-card-hr" />
              <div className="ds-card-lbl ds-card-lbl-vs">The Counter</div>
              <div className="ds-card-txt ds-card-counter">Familiarity isn't the same as effectiveness. Carousels are a well-documented way to hide content — most users never interact past the first frame. You've chosen a pattern users recognise, not one that serves them.</div>
              <div className="ds-card-foot"><span className="ds-round-lbl">Round 01 / 03</span><span className="ds-defend-lbl">Defend your position →</span></div>
            </div>
          </div>
          <div className="ds-hero-rule" />
        </section>

        <section className="ds-section" id="how-it-works">
          <div className="ds-section-inner">
            <span className="ds-section-lbl">The process</span>
            <div className="ds-steps">{STEPS.map(s => <div key={s.n}><div className="ds-step-num">{s.n}</div><h3 className="ds-step-title">{s.title}</h3><p className="ds-step-body">{s.body}</p></div>)}</div>
          </div>
        </section>

        <section className="ds-section ds-verdict-section">
          <div className="ds-section-inner">
            <span className="ds-section-lbl">The verdict</span>
            <h2 className="ds-h2">Four dimensions.<br />No softening.</h2>
            <div className="ds-scores">{SCORES_PREVIEW.map(s => <div className="ds-score-row" key={s.label}><div className="ds-score-meta"><span className="ds-score-lbl">{s.label}</span><span className="ds-score-note">{s.note}</span></div>{s.score !== null ? <Pips score={s.score} /> : <span className="ds-score-flag">⚑ Flagged</span>}</div>)}</div>
          </div>
        </section>

        <section className="ds-section">
          <div className="ds-section-inner">
            <span className="ds-section-lbl">In the field</span>
            <div className="ds-testi-grid">{TESTIMONIALS.map((t, i) => <div className="ds-testi" key={i}><div className="ds-testi-mark">"</div><p className="ds-testi-quote">{t.quote}</p><div className="ds-testi-author"><span className="ds-testi-name">{t.name}</span><span className="ds-testi-role">{t.role}</span></div></div>)}</div>
          </div>
        </section>

        <section className="ds-section" id="pricing" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
          <div className="ds-section-inner">
            <span className="ds-section-lbl">Pricing</span>
            <div className="ds-pricing">
              <div className="ds-plan">
                <div className="ds-plan-head"><h3 className="ds-plan-name">Challenger</h3><span className="ds-plan-price">Free</span></div>
                <p className="ds-plan-desc">Try the sparring. No account needed.</p>
                <ul className="ds-plan-list"><li>3 sessions per day</li><li>1 round per session</li><li>No sign-in required</li><li>No session memory</li><li>No verdict scoring</li></ul>
                <p className="ds-plan-note">No account required</p>
                <button className="ds-btn-outline" onClick={() => goPage("spar")}>Start sparring free</button>
              </div>
              <div className="ds-plan ds-plan-dark">
                <div className="ds-plan-head"><h3 className="ds-plan-name">Sparring Partner</h3><span className="ds-plan-price">$9<span className="ds-plan-per">/mo</span></span></div>
                <p className="ds-plan-desc">The full fight, saved for 30 days.</p>
                <ul className="ds-plan-list"><li>Unlimited sessions</li><li>Full 3-round format</li><li>30-day session history</li><li>Scored verdict on every session</li></ul>
                <p className="ds-plan-note">Account required</p>
                <button className="ds-btn-primary" onClick={() => openModal("signup")}>Get full access</button>
              </div>
            </div>
          </div>
        </section>
      </>}

      <footer className="ds-footer">
        <span className="ds-logo" onClick={() => goPage("home")}>Design Sparring</span>
        <div className="ds-footer-links"><button onClick={() => goPage("privacy")}>Privacy</button><button onClick={() => goPage("terms")}>Terms</button><button onClick={() => goPage("cookies")}>Cookies</button></div>
        <span className="ds-footer-copy">© 2026</span>
      </footer>

      {!cookiesAccepted && (
        <div className="ds-cookie">
          <p className="ds-cookie-text">We use essential cookies for authentication only — no tracking, no advertising. <button onClick={() => goPage("cookies")}>Learn more</button></p>
          <div className="ds-cookie-actions"><button className="ds-cookie-decline" onClick={() => setCookiesAccepted(true)}>Decline non-essential</button><button className="ds-cookie-accept" onClick={() => setCookiesAccepted(true)}>Accept</button></div>
        </div>
      )}

      {modal && (
        <div className="ds-overlay" onClick={closeModal}>
          <div className="ds-modal" onClick={e => e.stopPropagation()}>
            <button className="ds-modal-x" onClick={closeModal}>✕</button>
            {(modal === "login" || modal === "signup") && authStep === "form" && <>
              <h2 className="ds-modal-title">{modal === "login" ? "Sign in" : "Create account"}</h2>
              <p className="ds-modal-sub">{modal === "login" ? "Enter your email. We'll send a link." : "No password. Just an email."}</p>
              <input className="ds-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAuth()} autoFocus />
              <button className="ds-btn-primary ds-btn-full" onClick={handleAuth}>{modal === "login" ? "Continue" : "Create account"}</button>
              <p className="ds-modal-switch">{modal === "login" ? <>New here? <button className="ds-text-btn" onClick={() => openModal("signup")}>Create an account</button></> : <>Already have one? <button className="ds-text-btn" onClick={() => openModal("login")}>Sign in</button></>}</p>
            </>}
            {(modal === "login" || modal === "signup") && authStep === "sent" && <>
              <h2 className="ds-modal-title">Check your email</h2>
              <p className="ds-modal-sub">A link is on its way to <strong>{email}</strong></p>
              <p style={{ fontSize: 14, color: "var(--muted)", fontWeight: 400 }}>Click the link in your email to sign in. It expires in 15 minutes.</p>
            </>}
            {modal === "history" && <>
              <h2 className="ds-modal-title">Session history</h2>
              <div className="ds-acct-plan"><span className="ds-acct-plan-label ds-acct-plan-paid">Sparring Partner</span><span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)" }}>30-day window</span></div>
              <div className="ds-session-lbl">Recent sessions</div>
              <div className="ds-session-list">{SAMPLE_SESSIONS.map(s => <div className="ds-session-row" key={s.id}><div className="ds-session-info"><span className="ds-session-title">{s.title}</span><span className="ds-session-date">{s.date}</span></div><Pips score={s.score} size="sm" /></div>)}</div>
              <div className="ds-acct-danger-zone"><button className="ds-dropdown-item ds-danger-item" style={{ padding: "10px 0" }} onClick={() => { closeModal(); openModal("delete"); }}>Delete account</button></div>
            </>}
            {modal === "delete" && <>
              <h2 className="ds-modal-title">Delete account</h2>
              <p className="ds-modal-sub">{deleteStep ? "This will permanently erase your account and all sessions. There is no undo." : "Your account and all saved sessions will be permanently removed."}</p>
              {!deleteStep ? <button className="ds-btn-danger" onClick={handleDelete}>Delete my account</button> : <div className="ds-delete-stack"><button className="ds-btn-danger" onClick={handleDelete}>Yes, delete permanently</button><button className="ds-btn-outline ds-btn-full" onClick={closeModal}>Cancel</button></div>}
            </>}
          </div>
        </div>
      )}

      {toast && <div className="ds-toast">{toast}</div>}
    </div>
  );
}