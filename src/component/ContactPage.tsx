// src/component/ContactPage.tsx

/**
 * Contact page: one card, three circles (GitHub / Instagram / LinkedIn).
 * Each circle holds that platform's real logo and links to the profile.
 *
 * To change a link: edit the three objects in CHANNELS below.
 */

const CHANNELS = [
  { name: "GitHub", href: "https://github.com/Pansony67" },
  { name: "Instagram", href: "https://www.instagram.com/pancantalk/" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/pannadhorn-rugseree-90a8b6403/" },
];

// The logos, drawn as SVG. They inherit the text colour, so they match
// the rest of the card automatically.
function Logo({ name }: { name: string }) {
  if (name === "GitHub") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
      </svg>
    );
  }

  if (name === "Instagram") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
        <circle cx="12" cy="12" r="4.3" />
        <circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.76-1.95C21.6 8.75 23 11 23 14.4V21h-4v-5.9c0-1.4-.03-3.2-2-3.2s-2.3 1.5-2.3 3.1V21h-4V9z" />
    </svg>
  );
}

export function ContactPage() {
  return (
    <div
      style={{
        width: "min(600px, 90vw)",
        borderRadius: "20px",
        background: "rgba(20,10,32,0.6)",
        border: "1px solid rgba(255,255,255,0.15)",
        padding: "40px 24px",
        textAlign: "center",
        fontFamily: "'Julius Sans One', sans-serif",
        color: "#fff6e0",
      }}
    >
      <h1 style={{ fontSize: "26px", letterSpacing: "0.1em", margin: "0 0 32px" }}>
        CONTACT
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "32px",
          flexWrap: "wrap",
        }}
      >
        {CHANNELS.map((c) => (
          <a
            key={c.name}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Logo name={c.name} />
            </div>
            <span style={{ fontSize: "13px" }}>{c.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
