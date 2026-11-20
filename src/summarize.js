const STOPWORDS = new Set(("the a an and or but if then than of to in on for from by with as is are was were be been being this that these those it its into about across through their they them we you your our can could should would will may might not no yes").split(" "));

export function extractLocalSummary(rawText, title = "Untitled notes") {
  const text = rawText.replace(/\r/g, "").trim();
  if (!text) throw new Error("Paste some notes before generating a summary.");

  const lines = text.split("\n").map(s => s.trim()).filter(Boolean);
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(s => s.trim()).filter(Boolean) || [];
  const words = (text.toLowerCase().match(/[a-z][a-z'-]{2,}/g) || []).filter(w => !STOPWORDS.has(w));
  const counts = new Map();
  words.forEach(w => counts.set(w, (counts.get(w) || 0) + 1));
  const keywords = [...counts.entries()].sort((a,b) => b[1]-a[1]).slice(0, 8).map(([word]) => word);

  // Extract likely headings and prioritize sentences containing frequent terms.
  const headings = lines.filter(line =>
    line.length < 90 && (line.endsWith(":") || /^[A-Z0-9][A-Z0-9\s&()/-]{3,}$/.test(line) || /^#{1,3}\s/.test(line))
  ).map(line => line.replace(/^#{1,3}\s*/, "").replace(/:$/, ""));

  const ranked = sentences.map((sentence, index) => {
    const tokens = (sentence.toLowerCase().match(/[a-z][a-z'-]{2,}/g) || []);
    const score = tokens.reduce((sum, token) => sum + (counts.get(token) || 0), 0) / Math.max(tokens.length, 1);
    return { sentence, score, index };
  }).sort((a,b) => b.score-a.score).slice(0, Math.min(7, sentences.length)).sort((a,b) => a.index-b.index);

  const points = ranked.map(item => item.sentence);
  const branches = headings.length ? headings.slice(0, 6) : keywords.slice(0, 6).map(capitalize);
  const definitions = keywords.map(word => ({
    term: capitalize(word),
    definition: "Key term detected in your notes. Add or verify its formal definition before presenting."
  }));

  return {
    title,
    overview: points[0] || text.slice(0, 220),
    keyPoints: points,
    keywords: definitions,
    branches: branches.map((name, i) => ({
      name,
      details: points.filter(p => p.toLowerCase().includes(name.toLowerCase().split(" ")[0])).slice(0, 2)
    })),
    verification: [
      { status: "needs-check", label: "External fact-checking is not enabled in local mode.", detail: "The local summarizer extracts patterns from your text. It does not independently verify claims." },
      { status: "needs-check", label: `${definitions.length} keywords detected.`, detail: "Review definitions and spelling before using them in a formal presentation." }
    ],
    sourceText: text,
    mode: "Local extraction (no AI API)"
  };
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
