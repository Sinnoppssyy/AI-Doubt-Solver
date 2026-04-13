import { useState } from "react";

const API_KEY = process.env.REACT_APP_ANTHROPIC_KEY;

export default function App() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const askDoubt = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 800,
          messages: [
            {
              role: "system",
              content: "You are a friendly tutor for school and college students. Always be encouraging and explain things simply.",
            },
            {
              role: "user",
              content: `A student asked: "${question}"

Reply with:
1. A clear, simple explanation (3-4 lines max)
2. One practice question they can try

Keep it encouraging and easy to understand.`,
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error?.message || "Something went wrong. Check your API key.");
        return;
      }

      setResponse(data.choices[0].message.content);
    } catch (err) {
      setError("Network error — make sure your Groq API key is set in .env");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askDoubt();
    }
  };

  return (
    <div
      style={{
        maxWidth: 640,
        margin: "3rem auto",
        padding: "0 1rem",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 4 }}>
        AI Doubt Solver
      </h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Ask any question — get a simple explanation + practice problem
      </p>

      <textarea
        rows={3}
        placeholder="e.g. What is the Pythagorean theorem?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 15,
          borderRadius: 8,
          border: "1px solid #ddd",
          resize: "vertical",
          outline: "none",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={askDoubt}
        disabled={loading}
        style={{
          marginTop: 10,
          padding: "10px 24px",
          background: "#534AB7",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontSize: 15,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Thinking..." : "Solve my doubt"}
      </button>

      {error && (
        <div
          style={{
            marginTop: 16,
            padding: 14,
            background: "#fff0f0",
            border: "1px solid #f5c6c6",
            borderRadius: 8,
            color: "#c0392b",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {response && (
        <div
          style={{
            marginTop: 24,
            padding: 20,
            background: "#f8f7ff",
            borderRadius: 10,
            border: "1px solid #e0ddf7",
            whiteSpace: "pre-wrap",
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          {response}
        </div>
      )}
    </div>
  );
}