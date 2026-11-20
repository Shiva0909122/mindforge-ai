
import React, { useEffect, useState } from "react";
import { supabase } from "./supabase.js";
import {
  BrainCircuit,
  Sparkles,
  Network,
  FileText,
  ShieldCheck,
  ArrowRight,
  Zap,
  Layers3,
  CheckCircle2,
  Menu,
  X,
  LogOut
} from "lucide-react";

export default function Auth({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("login");
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setMessage("Supabase is not configured. Check your .env file.");
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) setMessage(error.message);
      setSession(data?.session ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setBusy(true);

    try {
      if (!supabase) throw new Error("Supabase is not configured.");

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (!data.session) {
          setMessage("Account created! Please check your email to confirm.");
        } else {
          setMessage("Account created successfully!");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) setMessage(error.message);
  }

  function openAuth(selectedMode = "login") {
    setMode(selectedMode);
    setMessage("");
    setShowAuth(true);
    setMenuOpen(false);
  }

  if (loading) {
    return <div className="mf-loading">MindForge AI is preparing your workspace...</div>;
  }

  if (session) {
    return (
      <div className="mf-app">
        <div className="mf-userbar">
          <div className="mf-brand-small">
            <BrainCircuit size={25} />
            <span>MindForge <b>AI</b></span>
          </div>
          <div className="mf-user-info">
            <span>{session.user.email}</span>
            <button onClick={handleLogout}>
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="mf-landing">
      <nav className="mf-nav">
        <a className="mf-brand" href="#">
          <span className="mf-brand-icon"><BrainCircuit size={27} /></span>
          <span>MindForge <b>AI</b></span>
        </a>

        <div className={`mf-nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#workflow" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        </div>

        <div className="mf-nav-actions">
          <button className="mf-login-link" onClick={() => openAuth("login")}>
            Sign in
          </button>
          <button className="mf-primary-btn mf-nav-cta" onClick={() => openAuth("signup")}>
            Get started <ArrowRight size={16} />
          </button>
        </div>

        <button className="mf-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      <main>
        <section className="mf-hero">
          <div className="mf-hero-content">
            <div className="mf-announcement">
              <Sparkles size={15} />
              YOUR KNOWLEDGE, REIMAGINED WITH AI
            </div>

            <h1>
              Think deeper.
              <br />
              <span>Understand faster.</span>
              <br />
              Create smarter.
            </h1>

            <p className="mf-hero-description">
              Transform complex documents into clear summaries,
              intelligent insights, and beautiful interactive mind maps.
              One workspace. Endless possibilities.
            </p>

            <div className="mf-hero-actions">
              <button
                className="mf-primary-btn mf-large-btn"
                onClick={() => openAuth("signup")}
              >
                Start creating free <ArrowRight size={19} />
              </button>
              <button
                className="mf-secondary-btn"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore features
              </button>
            </div>

            <div className="mf-trust-line">
              <CheckCircle2 size={17} />
              Your personal AI-powered knowledge workspace
            </div>
          </div>

          <div className="mf-hero-visual">
            <div className="mf-glow"></div>
            <div className="mf-preview">
              <div className="mf-preview-top">
                <div className="mf-window-dots"><i></i><i></i><i></i></div>
                <span>MindForge Workspace</span>
                <Sparkles size={17} />
              </div>

              <div className="mf-preview-body">
                <div className="mf-preview-heading">
                  <span className="mf-preview-icon"><BrainCircuit size={23} /></span>
                  <div>
                    <h3>Knowledge Intelligence</h3>
                    <p>AI-generated knowledge overview</p>
                  </div>
                </div>

                <div className="mf-preview-card">
                  <div className="mf-card-label"><FileText size={15} /> SMART SUMMARY</div>
                  <h4>The Future of Artificial Intelligence</h4>
                  <p>Understanding AI, its applications, opportunities and emerging technologies.</p>
                  <div className="mf-progress"><span></span></div>
                </div>

                <div className="mf-map-preview">
                  <div className="mf-map-center">
                    <BrainCircuit size={22} />
                    <span>Artificial Intelligence</span>
                  </div>
                  <div className="mf-map-branches">
                    <span>Machine Learning</span>
                    <span>Automation</span>
                    <span>Deep Learning</span>
                  </div>
                  <div className="mf-map-bottom">
                    <span>Neural Networks</span>
                    <span>Future Trends</span>
                  </div>
                </div>

                <div className="mf-preview-footer">
                  <span><Zap size={14} /> AI insights</span>
                  <span><Network size={14} /> Visual knowledge map</span>
                </div>
              </div>
            </div>
            <div className="mf-floating-tag mf-tag-one"><Sparkles size={16} /> Intelligent insights</div>
            <div className="mf-floating-tag mf-tag-two"><Network size={16} /> Connected ideas</div>
          </div>
        </section>

        <section className="mf-stats">
          <div><strong>01</strong><span>Unified workspace</span></div>
          <div><strong>AI</strong><span>Intelligent analysis</span></div>
          <div><strong>∞</strong><span>Ideas to explore</span></div>
        </section>

        <section className="mf-features" id="features">
          <div className="mf-section-heading">
            <span>POWERFUL CAPABILITIES</span>
            <h2>Everything you need to <em>think clearly.</em></h2>
            <p>Move from information overload to organized understanding.</p>
          </div>

          <div className="mf-feature-grid">
            <article className="mf-feature-card">
              <div className="mf-feature-icon purple"><FileText /></div>
              <h3>AI Smart Summaries</h3>
              <p>Convert lengthy content into structured summaries and meaningful key points.</p>
            </article>

            <article className="mf-feature-card">
              <div className="mf-feature-icon blue"><Network /></div>
              <h3>Interactive Mind Maps</h3>
              <p>Visualize relationships between concepts and explore connected ideas.</p>
            </article>

            <article className="mf-feature-card">
              <div className="mf-feature-icon pink"><Sparkles /></div>
              <h3>Intelligent Insights</h3>
              <p>Identify important themes, keywords and concepts from your content.</p>
            </article>

            <article className="mf-feature-card">
              <div className="mf-feature-icon green"><ShieldCheck /></div>
              <h3>Knowledge Library</h3>
              <p>Organize and revisit your saved knowledge in one workspace.</p>
            </article>

            <article className="mf-feature-card">
              <div className="mf-feature-icon orange"><Layers3 /></div>
              <h3>Document Workspace</h3>
              <p>Build a central place for your learning materials and research.</p>
            </article>

            <article className="mf-feature-card">
              <div className="mf-feature-icon cyan"><Zap /></div>
              <h3>Faster Understanding</h3>
              <p>Spend less time organizing information and more time using it.</p>
            </article>
          </div>
        </section>

        <section className="mf-workflow" id="workflow">
          <div className="mf-section-heading">
            <span>YOUR KNOWLEDGE WORKFLOW</span>
            <h2>From content to <em>clarity.</em></h2>
          </div>
          <div className="mf-steps">
            <div><b>01</b><h3>Bring your content</h3><p>Start with text or your learning material.</p></div>
            <div><b>02</b><h3>Generate insights</h3><p>Organize information into summaries and concepts.</p></div>
            <div><b>03</b><h3>Explore visually</h3><p>Understand connections through mind maps.</p></div>
          </div>
        </section>

        <section className="mf-cta" id="about">
          <BrainCircuit size={35} />
          <h2>Your next big idea starts with understanding.</h2>
          <p>Build your personal knowledge workspace with MindForge AI.</p>
          <button className="mf-primary-btn mf-large-btn" onClick={() => openAuth("signup")}>
            Create your workspace <ArrowRight size={18} />
          </button>
        </section>
      </main>

      <footer className="mf-footer">
        <a className="mf-brand" href="#">
          <BrainCircuit size={23} /> MindForge <b>AI</b>
        </a>
        <span>Think better. Learn smarter. Build knowledge.</span>
        <span>© {new Date().getFullYear()} MindForge AI</span>
      </footer>

      {showAuth && (
        <div className="mf-modal-backdrop" onClick={() => setShowAuth(false)}>
          <form className="mf-auth-card" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="mf-modal-close" onClick={() => setShowAuth(false)}>
              <X size={20} />
            </button>

            <div className="mf-auth-logo"><BrainCircuit size={30} /></div>
            <span className="mf-auth-eyebrow">WELCOME TO YOUR KNOWLEDGE SPACE</span>
            <h2>{mode === "login" ? "Welcome back." : "Start creating."}</h2>
            <p>{mode === "login" ? "Sign in to continue your journey." : "Create an account to build your workspace."}</p>

            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
              required
            />

            <button className="mf-primary-btn mf-auth-submit" disabled={busy}>
              {busy ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
              {!busy && <ArrowRight size={17} />}
            </button>

            {message && <div className="mf-auth-message">{message}</div>}

            <button
              type="button"
              className="mf-auth-switch"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setMessage("");
              }}
            >
              {mode === "login"
                ? "New to MindForge AI? Create an account"
                : "Already have an account? Sign in"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
