import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [jd, setJd] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!jd.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await axios.post(`${API_URL}/api/v1/analyze`, {
        jd,
        candidate_skills: skills
          ? skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      });
      setResult(data);
    } catch (err) {
      if (err.code === "ERR_NETWORK" || err.response?.status >= 500) {
        setError("Backend is waking up — wait 30 seconds and try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Job Prep Copilot</h1>
      <p style={styles.subtitle}>Paste a JD, get your match score + interview prep instantly.</p>

      <textarea
        style={styles.textarea}
        placeholder="Paste the job description here..."
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        rows={8}
      />

      <input
        style={styles.input}
        placeholder="Your skills (comma separated) — e.g. Python, FastAPI, React"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />

      <button
        style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze JD"}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      {result && (
        <div style={styles.results}>
          <div style={styles.scoreCard}>
            <span style={styles.scoreLabel}>Match Score</span>
            <span style={styles.scoreValue}>{result.match_score}%</span>
          </div>

          <div style={styles.row}>
            <SkillList title="✅ Matched Skills" items={result.matched_skills} color="#16a34a" />
            <SkillList title="❌ Missing Skills" items={result.missing_skills} color="#dc2626" />
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🎯 Prep Focus</h3>
            <p style={styles.prepFocus}>{result.prep_focus}</p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>💬 Interview Questions</h3>
            <ol style={styles.questionList}>
              {result.interview_questions.map((q, i) => (
                <li key={i} style={styles.questionItem}>{q}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

function SkillList({ title, items, color }) {
  return (
    <div style={styles.skillBox}>
      <h3 style={{ ...styles.sectionTitle, color }}>{title}</h3>
      <div style={styles.skillTags}>
        {items.length > 0
          ? items.map((s, i) => (
            <span key={i} style={{ ...styles.tag, borderColor: color, color }}>
              {s}
            </span>
          ))
          : <span style={styles.empty}>None</span>}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 720, margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif" },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 4 },
  subtitle: { color: "#6b7280", marginBottom: 24 },
  textarea: { width: "100%", padding: 12, fontSize: 14, borderRadius: 8, border: "1px solid #d1d5db", resize: "vertical", boxSizing: "border-box" },
  input: { width: "100%", padding: 12, fontSize: 14, borderRadius: 8, border: "1px solid #d1d5db", marginTop: 12, boxSizing: "border-box" },
  button: { marginTop: 16, padding: "12px 28px", fontSize: 15, fontWeight: 600, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" },
  error: { marginTop: 16, color: "#dc2626", fontSize: 14 },
  results: { marginTop: 32 },
  scoreCard: { background: "#eff6ff", borderRadius: 12, padding: "24px", textAlign: "center", marginBottom: 24 },
  scoreLabel: { display: "block", fontSize: 14, color: "#6b7280", marginBottom: 4 },
  scoreValue: { fontSize: 48, fontWeight: 800, color: "#2563eb" },
  row: { display: "flex", gap: 16, marginBottom: 24 },
  skillBox: { flex: 1 },
  skillTags: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 },
  tag: { padding: "4px 10px", borderRadius: 20, border: "1px solid", fontSize: 13 },
  empty: { fontSize: 13, color: "#9ca3af" },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 600, marginBottom: 8 },
  prepFocus: { background: "#fefce8", padding: 16, borderRadius: 8, fontSize: 14, color: "#713f12" },
  questionList: { paddingLeft: 20 },
  questionItem: { fontSize: 14, marginBottom: 10, lineHeight: 1.6, color: "#374151" },
};