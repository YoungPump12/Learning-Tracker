import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "learning_goals";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setGoals(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const addGoal = (e) => {
    e.preventDefault();
    const newGoal = {
      id: Date.now(),
      title,
      targetDate,
      progress: Number(progress),
      completed: false,
    };
    setGoals([newGoal, ...goals]);
    setTitle("");
    setTargetDate("");
    setProgress(0);
  };

  const updateProgress = (id, value) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, progress: value } : g)));
  };

  const toggleComplete = (id) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
  };

  const removeGoal = (id) => {
    setGoals(goals.filter((g) => g.id !== id));
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
            <h1 style={{ margin: 0, fontSize: "2rem", color: "#111827", fontWeight: "800" }}>Goals & Milestones</h1>
            <p style={{ margin: "0.25rem 0 0", color: "#4b5563", fontWeight: "600" }}>Set targets and track progress</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "1.25rem", background: "#ffffff", border: "2px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 0.75rem 0", color: "#111827", fontWeight: "700" }}>Create Goal</h3>
          <form onSubmit={addGoal} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
            <input className="field" placeholder="Goal title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input className="field" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
            <input className="field" type="number" min="0" max="100" value={progress} onChange={(e) => setProgress(e.target.value)} placeholder="Progress %" />
            <button className="btn-primary" style={{ width: "auto" }}>Add Goal</button>
          </form>
        </div>

        <div className="glass-card" style={{ padding: "1.25rem", background: "#ffffff", border: "2px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#111827", fontWeight: "700" }}>My Goals</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {goals.length === 0 && (
              <p style={{ color: "#9ca3af", fontWeight: "600" }}>No goals yet. Add your first goal!</p>
            )}
            {goals.map((goal) => (
              <div key={goal.id} style={{ padding: "0.9rem", borderRadius: "0.75rem", border: "2px solid #e5e7eb", background: "#f9fafb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
                  <div>
                    <div style={{ color: "#111827", fontWeight: "800" }}>{goal.title}</div>
                    <div style={{ color: "#4b5563", fontSize: "0.85rem", fontWeight: "600" }}>
                      {goal.targetDate ? `Target: ${goal.targetDate}` : "No target date"}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="btn-ghost" style={{ width: "auto" }} onClick={() => toggleComplete(goal.id)}>
                      {goal.completed ? "Reopen" : "Complete"}
                    </button>
                    <button className="btn-ghost" style={{ width: "auto" }} onClick={() => removeGoal(goal.id)}>
                      Delete
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                    <span style={{ color: "#4b5563", fontWeight: "700" }}>Progress</span>
                    <span style={{ color: "#4b5563", fontWeight: "700" }}>{goal.progress}%</span>
                  </div>
                  <div style={{ height: "8px", background: "#f3f4f6", borderRadius: "6px", overflow: "hidden" }}>
                    <div style={{ width: `${goal.progress}%`, height: "100%", background: "#4338ca", boxShadow: "0 2px 6px rgba(67,56,202,0.35)" }} />
                  </div>
                </div>

                <div style={{ marginTop: "0.75rem" }}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => updateProgress(goal.id, Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
