import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "learning_resources";

export default function Resources() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addResource = (e) => {
    e.preventDefault();
    const newItem = { id: Date.now(), title, url, notes };
    setItems([newItem, ...items]);
    setTitle("");
    setUrl("");
    setNotes("");
  };

  const removeResource = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="page-shell" style={{ alignItems: "flex-start" }}>
      <div className="floating-blob" style={{ top: "-12%", left: "-10%" }} />
      <div className="floating-blob" style={{ bottom: "-14%", right: "-12%" }} />

      <div style={{ width: "100%", maxWidth: 1000, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={() => navigate("/dashboard")} className="btn-ghost" style={{ width: "auto", padding: "0.5rem" }}>
            ←
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: "2rem", color: "#111827", fontWeight: "800" }}>Notes & Resources</h1>
            <p style={{ margin: "0.25rem 0 0", color: "#4b5563", fontWeight: "600" }}>Save links and study notes</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "1.25rem", background: "#ffffff", border: "2px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 0.75rem 0", color: "#111827", fontWeight: "700" }}>Add Resource</h3>
          <form onSubmit={addResource} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem" }}>
            <input className="field" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input className="field" placeholder="URL (optional)" value={url} onChange={(e) => setUrl(e.target.value)} />
            <input className="field" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <button className="btn-primary" style={{ width: "auto" }}>Save</button>
          </form>
        </div>

        <div className="glass-card" style={{ padding: "1.25rem", background: "#ffffff", border: "2px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#111827", fontWeight: "700" }}>My Resources</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {items.length === 0 && (
              <p style={{ color: "#9ca3af", fontWeight: "600" }}>No resources yet. Add your first one!</p>
            )}
            {items.map((item) => (
              <div key={item.id} style={{ padding: "0.9rem", borderRadius: "0.75rem", border: "2px solid #e5e7eb", background: "#f9fafb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
                  <div>
                    <div style={{ color: "#111827", fontWeight: "800" }}>{item.title}</div>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer" style={{ color: "#4338ca", fontWeight: "700", textDecoration: "none" }}>
                        {item.url}
                      </a>
                    )}
                    {item.notes && <div style={{ color: "#4b5563", fontWeight: "600", marginTop: "0.25rem" }}>{item.notes}</div>}
                  </div>
                  <button className="btn-ghost" style={{ width: "auto" }} onClick={() => removeResource(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
