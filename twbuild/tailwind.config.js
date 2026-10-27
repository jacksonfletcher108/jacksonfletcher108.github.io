module.exports = {
    content: ['./src.html'],
    theme: {
      extend: {
        colors: {
          bg: "var(--bg)", surface: "var(--surface)", sunk: "var(--sunk)", line: "var(--line)",
          ink: "var(--ink)", muted: "var(--muted)", sage: "var(--sage)", "sage-soft": "var(--sage-soft)",
          amber: "var(--amber)", "amber-soft": "var(--amber-soft)", "on-sage": "var(--on-sage)"
        },
        fontFamily: {
          display: ["Bricolage Grotesque", "ui-sans-serif", "system-ui", "sans-serif"],
          sans: ["Instrument Sans", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
          mono: ["IBM Plex Mono", "ui-monospace", "Menlo", "monospace"]
        }
      }
    }
  };
