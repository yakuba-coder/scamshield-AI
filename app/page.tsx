"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, BadgeCheck, Check, CheckCircle2, ChevronRight, CircleHelp, Clock3, FileSearch, History, Info, LockKeyhole, MessageSquareText, ScanSearch, Shield, ShieldAlert, ShieldCheck, Sparkles, Trash2, Upload, WandSparkles } from "lucide-react";
import type { Analysis, RiskLevel, ScanRecord } from "../lib/types";

const STORAGE_KEY = "scamshield-history-v1";
const samples = [
  { label: "Fake KYC alert", text: "Your bank account will be blocked today. Verify your KYC immediately using this link to avoid suspension." },
  { label: "Cashback offer", text: "Congratulations! You have won a ₹5,000 cashback reward. Share your UPI PIN to receive the money immediately." },
  { label: "Normal message", text: "Hi, your payment of ₹450 to Green Leaf Cafe was successful today. Thank you for using our service." }
];

function riskLabel(level: RiskLevel) { return level === "high" ? "High risk" : level === "medium" ? "Medium risk" : level === "low" ? "Low risk" : "Inconclusive"; }
function riskClass(level: RiskLevel) { return `risk-status risk-${level}`; }
function formatDate(value: string) { try { return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); } catch { return value; } }

export default function Home() {
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [showHistory, setShowHistory] = useState(true);
  const remaining = useMemo(() => Math.max(0, 6000 - message.length), [message]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved) as ScanRecord[]);
    } catch { /* Ignore malformed local history. */ }
  }, []);

  function saveHistory(records: ScanRecord[]) {
    setHistory(records);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch { /* The scan still works if storage is unavailable. */ }
  }

  async function analyzeMessage() {
    setError(""); setAnalysis(null);
    const clean = message.trim();
    if (clean.length < 8) { setError("Please paste a message with at least 8 characters so ScamShield can assess it."); return; }
    if (clean.length > 6000) { setError("Please keep the message under 6,000 characters."); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: clean }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Analysis failed. Please try again.");
      const result = payload.result as Analysis;
      setAnalysis(result);
      const record: ScanRecord = { id: crypto.randomUUID(), message: clean, createdAt: new Date().toISOString(), result };
      saveHistory([record, ...history].slice(0, 8));
    } catch (e) {
      setError(e instanceof Error ? e.message : "We couldn't complete the analysis. Please try again.");
    } finally { setLoading(false); }
  }

  function clearHistory() { saveHistory([]); }
  function restoreScan(record: ScanRecord) { setMessage(record.message); setAnalysis(record.result); setError(""); window.scrollTo({ top: 450, behavior: "smooth" }); }

  return <div className="page-shell">
    <header className="topbar"><div className="container topbar-inner">
      <a href="#top" className="brand" aria-label="ScamShield AI home"><div className="brand-mark"><ShieldCheck size={23}/></div><div><div className="brand-name">ScamShield AI</div><span className="brand-tag">DIGITAL PAYMENT SAFETY</span></div></a>
      <nav className="nav-links" aria-label="Main navigation"><a href="#scanner">Message scanner</a><a href="#how-it-works">How it works</a><a href="#history">Scan history</a></nav>
      <div className="header-pill"><span className="status-dot"/> Safety-first AI</div>
    </div></header>

    <main id="top">
      <section className="hero"><div className="container hero-grid">
        <div>
          <div className="eyebrow"><Sparkles size={13}/> AI-powered message safety</div>
          <h1>Pause. Analyze.<br/><span>Protect yourself.</span></h1>
          <p className="hero-copy">Understand suspicious messages before they become costly mistakes. ScamShield AI explains warning signs in plain language and gives you practical next steps—without pretending every message can be verified from text alone.</p>
          <div className="hero-points"><div className="hero-point"><CheckCircle2 size={15} color="#329B68"/> Evidence-led insights</div><div className="hero-point"><LockKeyhole size={15} color="#4A90E2"/> No bank connection needed</div></div>
        </div>
        <div className="hero-visual"><div className="visual-content">
          <div className="visual-head"><strong>Inside a ScamShield report</strong><span className="demo-label">SAMPLE PREVIEW</span></div>
          <div className="mini-window"><div className="mini-label">MESSAGE EXCERPT</div><p className="mini-message">“Your account will be blocked <span className="highlight">today</span>. Verify your KYC <span className="highlight">immediately</span> to avoid suspension.”</p><div className="mini-result"><span className="risk-chip"><AlertTriangle size={13}/> Potential warning signs</span><span className="mini-score">Not a final verdict</span></div></div>
          <div className="feature-row"><div className="feature-tile"><div className="feature-icon"><ScanSearch size={16}/></div><div><strong>Spot signals</strong><span>See the exact words that raised concern.</span></div></div><div className="feature-tile"><div className="feature-icon"><MessageSquareText size={16}/></div><div><strong>Understand why</strong><span>Clear explanations, not jargon.</span></div></div><div className="feature-tile"><div className="feature-icon"><ShieldCheck size={16}/></div><div><strong>Choose safer steps</strong><span>Know what to verify next.</span></div></div></div>
        </div></div>
      </div></section>

      <section className="workspace" id="scanner"><div className="container">
        <div className="workspace-heading"><div><h2>Check a suspicious message</h2><p>Paste the text below. Remove personal details before submitting.</p></div><div className="header-pill"><Shield size={14}/> Private-by-design demo</div></div>
        <div className="workspace-grid">
          <section className="card" aria-labelledby="input-title"><div className="card-header"><div><div className="card-title" id="input-title"><div className="feature-icon"><FileSearch size={17}/></div> Message scanner</div><div className="card-subtitle">SMS, email, social messages, or payment requests</div></div><span className="demo-label">AI ANALYSIS</span></div>
            <div className="card-body"><div className="label-row"><label className="field-label" htmlFor="message">Message content</label><span className="field-hint">Do not include PINs or OTPs</span></div>
              <textarea id="message" className="message-input" value={message} onChange={e => setMessage(e.target.value.slice(0, 6000))} placeholder="Paste the message you want to check here…" maxLength={6000} aria-describedby="input-privacy" />
              <div className="input-footer"><span>{remaining.toLocaleString("en-IN")} characters remaining</span><span>Text only · Up to 6,000 characters</span></div>
              <div className="sample-row"><span className="field-hint" style={{alignSelf:"center",marginRight:2}}>Try a sample:</span>{samples.map(sample => <button type="button" className="sample-chip" key={sample.label} onClick={() => {setMessage(sample.text);setAnalysis(null);setError("");}}>{sample.label}</button>)}</div>
              <button className="primary-btn full-btn" type="button" onClick={analyzeMessage} disabled={loading}><WandSparkles size={16}/>{loading ? "Analyzing message…" : "Analyze message with AI"}<ArrowRight size={15}/></button>
              {error && <div className="error-box" role="alert"><AlertTriangle size={16}/><span>{error}</span></div>}
              <div className="privacy-note" id="input-privacy"><LockKeyhole size={14}/><span>For this demo, the message is sent to the configured AI provider for analysis. Recent scan history is stored in this browser only. Do not submit credentials or highly sensitive personal information.</span></div>
            </div>
          </section>

          <section className="card" aria-labelledby="result-title"><div className="card-header"><div><div className="card-title" id="result-title"><div className="feature-icon"><ShieldCheck size={17}/></div> Analysis report</div><div className="card-subtitle">Evidence, explanation, and recommended actions</div></div>{analysis && <button className="secondary-btn" type="button" onClick={() => setAnalysis(null)}><Trash2 size={13}/> Clear</button>}</div>
            {loading ? <div className="loading-state" aria-live="polite"><div className="spinner"/><strong>Reviewing the message</strong><p>Looking for pressure tactics, suspicious requests, and other warning signs.</p></div> : analysis ? <div className="result-wrap" aria-live="polite">
              <div className="result-top"><span className={riskClass(analysis.risk_level)}>{analysis.risk_level === "high" ? <ShieldAlert size={15}/> : analysis.risk_level === "low" ? <ShieldCheck size={15}/> : <CircleHelp size={15}/>} {riskLabel(analysis.risk_level)}</span><div className="confidence">AI confidence label<br/><strong style={{color:"#526A80"}}>{analysis.confidence_label.charAt(0).toUpperCase()+analysis.confidence_label.slice(1)}</strong></div></div>
              <p className="result-summary">{analysis.summary}</p>
              <div className="section-label">Potential warning signs · {analysis.indicators.length}</div>
              {analysis.indicators.length ? <div className="indicator-list">{analysis.indicators.map((item, index) => <div className="indicator" key={`${item.evidence}-${index}`}><div className="indicator-top"><div className={`indicator-bullet ${item.severity}`}><AlertTriangle size={13}/></div><div className="evidence">“{item.evidence}”</div></div><p className="indicator-explanation">{item.explanation}</p></div>)}</div> : <div className="indicator" style={{fontSize:12,color:"#6E8295",lineHeight:1.7}}>No specific warning phrase was substantiated from the message. This does not prove the message is safe.</div>}
              <hr className="result-divider"/><div className="section-label">Recommended next steps</div><ul className="actions-list">{analysis.recommended_actions.map((action, index) => <li key={`${action}-${index}`}><CheckCircle2 size={14}/><span>{action}</span></li>)}</ul>
              <div className="limit-box"><strong>Important limitation:</strong> {analysis.limitations} ScamShield AI has not independently verified the sender, website, or transaction.</div>
            </div> : <div className="results-empty"><div className="empty-art"><ShieldCheck size={35}/></div><h3>Your safety report will appear here</h3><p>Submit a message to see an evidence-based assessment, exact warning signs, and practical safety steps.</p><div className="empty-steps"><div className="empty-step"><span>1</span> Paste text</div><ChevronRight size={13} color="#9DB0C0"/><div className="empty-step"><span>2</span> Analyze</div><ChevronRight size={13} color="#9DB0C0"/><div className="empty-step"><span>3</span> Review</div></div></div>}
          </section>
        </div>

        <section className="history-section card" id="history"><div className="card-header"><div><div className="card-title"><div className="feature-icon"><History size={17}/></div> Recent scans</div><div className="card-subtitle">Saved in this browser for your current demo</div></div><div style={{display:"flex",gap:8}}>{history.length > 0 && <button className="secondary-btn" type="button" onClick={clearHistory}><Trash2 size={13}/> Clear history</button>}<button className="secondary-btn" type="button" onClick={() => setShowHistory(!showHistory)}>{showHistory ? "Hide" : "Show"}</button></div></div>
          {showHistory && (history.length ? <div className="history-list">{history.map(record => <div className="history-item" key={record.id}><div className="history-icon"><Clock3 size={16}/></div><div className="history-copy"><strong>{record.message}</strong><span>{formatDate(record.createdAt)}</span></div><span className={riskClass(record.result.risk_level)} style={{fontSize:10,padding:"6px 8px"}}>{riskLabel(record.result.risk_level)}</span><button type="button" className="secondary-btn" onClick={() => restoreScan(record)} aria-label="View this scan"><ArrowRight size={14}/></button></div>)}</div> : <div className="history-empty">No scans yet. Your completed analyses will appear here.</div>)}
        </section>

        <section id="how-it-works" style={{marginTop:30}}><div className="workspace-heading"><div><h2>Safety that explains itself</h2><p>ScamShield supports your judgment—it does not replace independent verification.</p></div></div><div className="feature-row" style={{marginTop:0}}><div className="feature-tile" style={{padding:17}}><div className="feature-icon"><ScanSearch size={17}/></div><div><strong>Evidence before labels</strong><span>Warnings are tied to exact phrases in the submitted message.</span></div></div><div className="feature-tile" style={{padding:17}}><div className="feature-icon"><Info size={17}/></div><div><strong>Honest uncertainty</strong><span>A text-only analysis cannot prove who sent a message or whether a link is legitimate.</span></div></div><div className="feature-tile" style={{padding:17}}><div className="feature-icon"><BadgeCheck size={17}/></div><div><strong>Safer next steps</strong><span>Verify through official channels. Never share a UPI PIN or OTP.</span></div></div></div></section>
      </div></section>
    </main>
    <footer className="footer"><div className="container footer-inner"><div className="footer-brand"><ShieldCheck size={18} color="#4A90E2"/> ScamShield AI <span style={{fontWeight:400,color:"#91A0AE"}}>· Pause. Analyze. Protect.</span></div><div className="footer-note">Educational assistance only, not a fraud-verification service. If money has already been lost in India, contact your bank/payment provider promptly and use official cybercrime reporting channels.</div></div></footer>
  </div>;
}
