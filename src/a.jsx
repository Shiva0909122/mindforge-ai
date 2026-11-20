import React, { useMemo, useState } from "react";
import {
  BookOpen,
  Brain,
  ChevronRight,
  Clipboard,
  FileText,
  FolderOpen,
  GitBranch,
  Layers3,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
  Download,
  ShieldCheck,
  Menu,
} from "lucide-react";
import MindMap from "./MindMap.jsx";
import { extractLocalSummary } from "./summarize.js";

const sample = `NEP 2020

The National Education Policy 2020 aims to transform India's education system through holistic, flexible and multidisciplinary learning.

School Structure
The policy introduces a 5+3+3+4 curricular structure, replacing the earlier 10+2 structure. It covers foundational, preparatory, middle and secondary stages.

Learning Approach
The policy emphasizes experiential learning, critical thinking, creativity, foundational literacy and numeracy, and competency-based education.

Assessment
Assessment should move beyond rote memorization. The Holistic Progress Card aims to capture learners' academic, cognitive, social, emotional and physical development.`;

export default function App() {
  const [active, setActive] = useState("Dashboard");
  const [title, setTitle] = useState("");
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState(null);
  const [tab, setTab] = useState("Key Points");
  const [library, setLibrary] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mindforge-library") || "[]");
    } catch {
      return [];
    }
  });
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  const save = () => {
    if (!summary) return;
    const item = {
      ...summary,
      id: Date.now(),
      savedAt: new Date().toISOString(),
    };
    const next = [item, ...library];
    setLibrary(next);
    localStorage.setItem("mindforge-library", JSON.stringify(next));
    setNotice("Saved on this device.");
    setTimeout(() => setNotice(""), 2600);
  };

  const generate = () => {
    try {
      const result = extractLocalSummary(
        input,
        title || "Untitled learning notes",
      );
      setSummary(result);
      setTab("Key Points");
      setActive("New Summary");
      setNotice("Summary generated using local extraction.");
    } catch (e) {
      setNotice(e.message);
    }
  };

  const copy = async (value) => {
    await navigator.clipboard.writeText(value);
    setNotice("Copied to clipboard.");
    setTimeout(() => setNotice(""), 2200);
  };

  const exportMarkdown = () => {
    if (!summary) return;
    const md = `# ${summary.title}\n\n## Overview\n${summary.overview}\n\n## Key Points\n${summary.keyPoints.map((p) => `- ${p}`).join("\n")}\n\n## Keywords\n${summary.keywords.map((k) => `- **${k.term}:** ${k.definition}`).join("\n")}\n\n## Verification\n${summary.verification.map((v) => `- ${v.label} ${v.detail}`).join("\n")}`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${summary.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = library.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Brain size={21} />
          </div>
          <div>
            <b>MindForge</b>
            <span>KNOWLEDGE STUDIO</span>
          </div>
        </div>
        <div className="workspace-pill">
          <span className="online-dot" /> Personal workspace{" "}
          <ChevronRight size={15} />
        </div>
        <p className="nav-label">WORKSPACE</p>
        <nav>
          <NavItem
            icon={<Layers3 />}
            label="Dashboard"
            active={active === "Dashboard"}
            onClick={setActive}
          />
          <NavItem
            icon={<Plus />}
            label="New Summary"
            active={active === "New Summary"}
            onClick={setActive}
          />
          <NavItem
            icon={<FolderOpen />}
            label="My Library"
            active={active === "My Library"}
            onClick={setActive}
          />
          <NavItem
            icon={<Users />}
            label="Team Workspace"
            active={active === "Team Workspace"}
            onClick={setActive}
          />
        </nav>
        <div className="sidebar-bottom">
          <div className="plan-card">
            <Sparkles size={17} />
            <b>Knowledge, clarified.</b>
            <p>Turn dense notes into ideas your team can use.</p>
          </div>
          <NavItem
            icon={<Settings />}
            label="Settings"
            active={active === "Settings"}
            onClick={setActive}
          />
          <div className="profile">
            <div className="avatar">S</div>
            <div>
              <b>Workspace owner</b>
              <span>Personal account</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="crumb">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <b>{active}</b>
          </div>
          <div className="top-actions">
            <span className="local-badge">
              <span /> LOCAL MODE
            </span>
            <button className="icon-btn" aria-label="Search">
              <Search size={18} />
            </button>
            <div className="avatar small">S</div>
          </div>
        </header>

        {active === "Dashboard" && (
          <section className="page">
            <div className="welcome-row">
              <div>
                <p className="eyebrow">YOUR KNOWLEDGE WORKSPACE</p>
                <h1>
                  Make knowledge <em>click.</em>
                </h1>
                <p className="subhead">
                  Turn raw notes into clear thinking, useful takeaways and
                  visual connections.
                </p>
              </div>
              <div className="welcome-art">
                <div className="orbit orbit-one" />
                <div className="orbit orbit-two" />
                <Brain size={54} />
                <span className="spark s1">✦</span>
                <span className="spark s2">✧</span>
              </div>
            </div>
            <div className="quick-grid">
              <button
                className="quick-card primary-card"
                onClick={() => setActive("New Summary")}
              >
                <div className="quick-icon">
                  <Plus />
                </div>
                <span className="card-kicker">START WITH YOUR NOTES</span>
                <h2>Present Use</h2>
                <p>
                  Paste your existing notes and get key points with a mind map.
                </p>
                <span className="card-link">
                  Create a summary <ChevronRight size={16} />
                </span>
              </button>
              <button
                className="quick-card"
                onClick={() => setActive("Team Workspace")}
              >
                <div className="quick-icon lavender">
                  <Users />
                </div>
                <span className="card-kicker">BUILD A REUSABLE SYSTEM</span>
                <h2>Future Use</h2>
                <p>
                  Organize learning materials, shared knowledge and team
                  workflows.
                </p>
                <span className="card-link">
                  Explore workspace <ChevronRight size={16} />
                </span>
              </button>
            </div>
            <div className="section-heading">
              <div>
                <h3>Recent knowledge</h3>
                <p>Your latest summaries will appear here.</p>
              </div>
              <button
                className="text-btn"
                onClick={() => setActive("My Library")}
              >
                View library <ChevronRight size={15} />
              </button>
            </div>
            {library.length ? (
              <div className="recent-list">
                {library.slice(0, 3).map((item) => (
                  <button
                    className="recent-item"
                    key={item.id}
                    onClick={() => {
                      setSummary(item);
                      setActive("New Summary");
                    }}
                  >
                    <div className="doc-icon">
                      <FileText />
                    </div>
                    <div>
                      <b>{item.title}</b>
                      <span>
                        {new Date(item.savedAt).toLocaleDateString()} ·{" "}
                        {item.keyPoints.length} key points
                      </span>
                    </div>
                    <ChevronRight size={17} />
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <BookOpen />
                </div>
                <b>Your knowledge library starts here</b>
                <span>Create your first summary to see it in this space.</span>
                <button
                  className="outline-btn"
                  onClick={() => {
                    setInput(sample);
                    setTitle("NEP 2020");
                    setActive("New Summary");
                  }}
                >
                  Try sample notes
                </button>
              </div>
            )}
            <div className="dashboard-foot">
              <ShieldCheck size={17} />
              <span>
                Local mode keeps your notes in this browser. Cloud sync and real
                team sharing require backend setup.
              </span>
            </div>
          </section>
        )}

        {active === "New Summary" && (
          <section className="page">
            <div className="page-heading">
              <div>
                <p className="eyebrow">PRESENT USE · NOTE PROCESSOR</p>
                <h1>New summary</h1>
                <p className="subhead">
                  Start with the material you already have. We'll structure it
                  into a study-friendly view.
                </p>
              </div>
              <span className="step-pill">
                01 <i /> 02 <i /> 03
              </span>
            </div>
            <div className="input-layout">
              <div className="input-panel panel">
                <div className="panel-title">
                  <div>
                    <h3>Source material</h3>
                    <p>
                      Paste text from your notes, research or session
                      transcript.
                    </p>
                  </div>
                  <span className="source-type">
                    <Clipboard size={14} /> TEXT
                  </span>
                </div>
                <label className="field-label">DOCUMENT TITLE</label>
                <input
                  className="title-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. NEP 2020 – Session Notes"
                />
                <label className="field-label">YOUR NOTES</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    "Paste your notes here...\n\nTip: Include headings and paragraphs for a more structured result."
                  }
                />
                <div className="input-footer">
                  <span>
                    {input.trim() ? input.trim().split(/\s+/).length : 0} words
                    · Plain text
                  </span>
                  <button
                    className="subtle-btn"
                    onClick={() => {
                      setInput(sample);
                      setTitle("NEP 2020");
                    }}
                  >
                    Load sample
                  </button>
                </div>
                <button className="generate-btn" onClick={generate}>
                  <Sparkles size={17} /> Generate key points{" "}
                  <ChevronRight size={17} />
                </button>
                <p className="privacy-note">
                  <ShieldCheck size={14} /> Local extraction only. Your text is
                  not sent to an AI service.
                </p>
              </div>
              <div className="side-info">
                <div className="side-info-icon">
                  <GitBranch />
                </div>
                <h3>What you'll get</h3>
                <div className="deliverable">
                  <b>01 · Key points</b>
                  <span>
                    A concise overview and important ideas in a clear hierarchy.
                  </span>
                </div>
                <div className="deliverable">
                  <b>02 · Mind map</b>
                  <span>
                    A visual map connecting the central topic to its subtopics.
                  </span>
                </div>
                <div className="deliverable">
                  <b>03 · Verification</b>
                  <span>
                    Flags for terms and claims that still need reliable
                    evidence.
                  </span>
                </div>
                <div className="note-callout">
                  For now, this starter uses local text extraction. Connect an
                  AI provider for deeper semantic summaries.
                </div>
              </div>
            </div>
            {summary && (
              <Result
                summary={summary}
                tab={tab}
                setTab={setTab}
                copy={copy}
                save={save}
                exportMarkdown={exportMarkdown}
              />
            )}
          </section>
        )}

        {active === "My Library" && (
          <section className="page">
            <div className="page-heading">
              <div>
                <p className="eyebrow">YOUR SAVED WORK</p>
                <h1>My library</h1>
                <p className="subhead">
                  Find and revisit the knowledge you've collected.
                </p>
              </div>
              <button
                className="generate-btn compact"
                onClick={() => setActive("New Summary")}
              >
                <Plus size={16} /> New summary
              </button>
            </div>
            <div className="library-toolbar">
              <div className="searchbox">
                <Search size={17} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search your summaries"
                />
              </div>
              <span>{filtered.length} saved</span>
            </div>
            {filtered.length ? (
              <div className="library-grid">
                {filtered.map((item) => (
                  <button
                    className="library-card"
                    key={item.id}
                    onClick={() => {
                      setSummary(item);
                      setActive("New Summary");
                    }}
                  >
                    <div className="doc-icon">
                      <FileText />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.overview}</p>
                    <span>
                      {new Date(item.savedAt).toLocaleDateString()} ·{" "}
                      {item.keyPoints.length} points
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <FolderOpen />
                </div>
                <b>No saved summaries found</b>
                <span>Generate a summary and choose Save to library.</span>
              </div>
            )}
          </section>
        )}

        {active === "Team Workspace" && (
          <section className="page">
            <div className="page-heading">
              <div>
                <p className="eyebrow">COLLABORATIVE LEARNING</p>
                <h1>Team workspace</h1>
                <p className="subhead">
                  A shared home for your team's learning materials and
                  collective knowledge.
                </p>
              </div>
              <span className="local-badge">
                <span /> SETUP REQUIRED
              </span>
            </div>
            <div className="team-banner">
              <div className="team-banner-icon">
                <Users size={27} />
              </div>
              <div>
                <h2>Your team space is ready to be connected.</h2>
                <p>
                  This starter is currently running in local mode. Real
                  accounts, invitations and shared documents need Supabase
                  configuration.
                </p>
              </div>
            </div>
            <div className="team-grid">
              <div className="panel">
                <h3>Workspace roles</h3>
                <div className="role-row">
                  <b>Admin</b>
                  <span>Manage members, settings and all shared content.</span>
                </div>
                <div className="role-row">
                  <b>Editor</b>
                  <span>Create, edit and organize shared summaries.</span>
                </div>
                <div className="role-row">
                  <b>Viewer</b>
                  <span>Read and export shared learning materials.</span>
                </div>
              </div>
              <div className="panel">
                <h3>Next setup steps</h3>
                <ol className="setup-list">
                  <li>Create a Supabase project.</li>
                  <li>Enable authentication and create workspace tables.</li>
                  <li>Deploy the secure AI Edge Function.</li>
                  <li>Invite team members and assign roles.</li>
                </ol>
              </div>
            </div>
          </section>
        )}

        {active === "Settings" && (
          <section className="page">
            <div className="page-heading">
              <div>
                <p className="eyebrow">CONFIGURATION</p>
                <h1>Settings</h1>
                <p className="subhead">
                  Connect the services that power your knowledge workspace.
                </p>
              </div>
            </div>
            <div className="settings-list">
              <div className="setting-row">
                <div className="setting-icon">
                  <Sparkles />
                </div>
                <div>
                  <b>AI provider</b>
                  <span>
                    Gemini or OpenAI can be connected through a secure server
                    function.
                  </span>
                </div>
                <span className="status-chip">Not connected</span>
              </div>
              <div className="setting-row">
                <div className="setting-icon">
                  <Layers3 />
                </div>
                <div>
                  <b>Supabase database</b>
                  <span>
                    Required for accounts, cloud storage and team sharing.
                  </span>
                </div>
                <span className="status-chip">Not connected</span>
              </div>
              <div className="setting-row">
                <div className="setting-icon">
                  <ShieldCheck />
                </div>
                <div>
                  <b>Privacy mode</b>
                  <span>
                    Current mode: browser-local storage. Data is stored on this
                    device.
                  </span>
                </div>
                <span className="status-chip good">Local</span>
              </div>
            </div>
            <div className="note-callout wide">
              Security rule: never paste Gemini or OpenAI secret keys into
              frontend code or commit them to GitHub. Store secrets as Supabase
              Edge Function secrets.
            </div>
          </section>
        )}
        {notice && <div className="toast">{notice}</div>}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      className={`nav-item ${active ? "active" : ""}`}
      onClick={() => onClick(label)}
    >
      {React.cloneElement(icon, { size: 18 })}
      <span>{label}</span>
      {active && <span className="nav-indicator" />}
    </button>
  );
}

function Result({ summary, tab, setTab, copy, save, exportMarkdown }) {
  return (
    <div className="result-section">
      <div className="result-header">
        <div>
          <p className="eyebrow">GENERATED OUTPUT</p>
          <h2>{summary.title}</h2>
          <p>{summary.mode} · Review before presenting</p>
        </div>
        <div className="result-actions">
          <button
            className="outline-btn"
            onClick={() =>
              copy(summary.keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n"))
            }
          >
            <Clipboard size={15} /> Copy points
          </button>
          <button className="outline-btn" onClick={exportMarkdown}>
            <Download size={15} /> Export
          </button>
          <button className="generate-btn compact" onClick={save}>
            Save to library
          </button>
        </div>
      </div>
      <div className="tabs">
        {["Key Points", "Mind Map", "Verification"].map((t) => (
          <button
            className={tab === t ? "selected" : ""}
            onClick={() => setTab(t)}
            key={t}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Key Points" && (
        <div className="result-grid">
          <div className="panel overview-panel">
            <span className="mini-label">QUICK OVERVIEW</span>
            <p className="overview-text">{summary.overview}</p>
            <div className="divider" />
            <span className="mini-label">MAIN TAKEAWAYS</span>
            <ol className="takeaway-list">
              {summary.keyPoints.map((p, i) => (
                <li key={i}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <p>{p}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="panel keyword-panel">
            <span className="mini-label">IMPORTANT KEYWORDS</span>
            {summary.keywords.map((k) => (
              <div className="keyword" key={k.term}>
                <b>{k.term}</b>
                <p>{k.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "Mind Map" && (
        <div className="panel map-panel">
          <div className="map-heading">
            <div>
              <h3>Topic mind map</h3>
              <p>
                Central idea and detected subtopics. Drag nodes to rearrange.
              </p>
            </div>
            <span className="mini-label">INTERACTIVE MAP</span>
          </div>
          <MindMap summary={summary} />
        </div>
      )}
      {tab === "Verification" && (
        <div className="panel verification-panel">
          <div className="verify-intro">
            <ShieldCheck />
            <div>
              <h3>Evidence & terminology review</h3>
              <p>
                These checks describe what this version can and cannot
                establish.
              </p>
            </div>
          </div>
          {summary.verification.map((v, i) => (
            <div className="verify-item" key={i}>
              <span className="warning-dot" />
              <div>
                <b>{v.label}</b>
                <p>{v.detail}</p>
              </div>
              <span className="status-chip">Review</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
