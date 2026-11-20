// Deploy with: supabase functions deploy summarize
// Set secrets with: supabase secrets set GEMINI_API_KEY=... OPENAI_API_KEY=...
// Invoke this function from an authenticated client. Never expose provider keys in the browser.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { text, title, provider = "gemini" } = await req.json();
    if (typeof text !== "string" || text.trim().length < 30) {
      return new Response(JSON.stringify({ error: "Please provide at least 30 characters of source text." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const systemPrompt = `You are a careful learning-note analyst. Return ONLY valid JSON with keys:
overview (string), keyPoints (array of concise strings), keywords (array of {term, definition}),
branches (array of {name, details: string[]}), verification (array of {status, label, detail}).
Summarize only what the source supports. Do not invent facts or citations.
For verification, label claims as "source-supported", "needs-check", or "uncertain".
Do not say externally verified unless you actually used an external authoritative source.
Make the output easy for a teacher or trainer to explain aloud.`;

    let resultText = "";
    if (provider === "gemini") {
      const key = Deno.env.get("GEMINI_API_KEY");
      if (!key) throw new Error("GEMINI_API_KEY is not configured in Supabase secrets.");
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system_instruction: { parts: [{ text: systemPrompt }] }, contents: [{ parts: [{ text: `Title: ${title || "Learning notes"}\n\nSOURCE:\n${text}` }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.2 } })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Gemini request failed.");
      resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } else if (provider === "openai") {
      const key = Deno.env.get("OPENAI_API_KEY");
      if (!key) throw new Error("OPENAI_API_KEY is not configured in Supabase secrets.");
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify({ model: "gpt-4o-mini", temperature: 0.2, response_format: { type: "json_object" }, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: `Title: ${title || "Learning notes"}\n\nSOURCE:\n${text}` }] })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "OpenAI request failed.");
      resultText = data.choices?.[0]?.message?.content || "";
    } else {
      throw new Error("Unsupported provider. Choose gemini or openai.");
    }

    const parsed = JSON.parse(resultText);
    return new Response(JSON.stringify({ ...parsed, title: title || "Learning notes", mode: `AI summary (${provider})` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Unexpected error." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
