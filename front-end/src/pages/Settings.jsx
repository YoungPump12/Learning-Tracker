import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "learning_settings";

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    weeklySummary: true,
    focusReminders: false,
    compactMode: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="page-shell" style={{ alignItems: "flex-start" }}>
      <div className="floating-blob" style={{ top: "-12%", left: "-10%" }} />
      <div className="floating-blob" style={{ bottom: "-14%", right: "-12%" }} />

      <div style={{ width: "100%", maxWidth: 900, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={() => navigate("/dashboard")} className="btn-ghost" style={{ width: "auto", padding: "0.5rem" }}>
            ←
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: "2rem", color: "#111827", fontWeight: "800" }}>Settings</h1>
            <p style={{ margin: "0.25rem 0 0", color: "#4b5563", fontWeight: "600" }}>Personalize your experience</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "1.25rem", background: "#ffffff", border: "2px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
          {[
            { key: "notifications", label: "Notifications", desc: "Get alerts for due tasks" },
            { key: "weeklySummary", label: "Weekly Summary", desc: "Receive weekly progress recap" },
            { key: "focusReminders", label: "Focus Reminders", desc: "Remind me to start focus sessions" },
            { key: "compactMode", label: "Compact Mode", desc: "Reduce spacing for dense views" },
          ].map((item) => (
            <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid #f3f4f6" }}>
              <div>
                <div style={{ color: "#111827", fontWeight: "800" }}>{item.label}</div>
                <div style={{ color: "#4b5563", fontWeight: "600", fontSize: "0.85rem" }}>{item.desc}</div>
              </div>
              <button
                onClick={() => toggle(item.key)}
                style={{
                  padding: "0.35rem 0.8rem",
                  borderRadius: "9999px",
                  border: "2px solid",
                  fontWeight: "700",
                  cursor: "pointer",
                  ...(settings[item.key]
                    ? { backgroundColor: "#4338ca", color: "#ffffff", borderColor: "#4338ca" }
                    : { backgroundColor: "#ffffff", color: "#4b5563", borderColor: "#d1d5db" })
                }}
              >
                {settings[item.key] ? "On" : "Off"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
