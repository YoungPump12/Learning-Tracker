import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";

const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function Achievements() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const tasksRes = await api.get("/api/tasks/");
      setTasks(tasksRes.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const completedTasks = tasks.filter((t) => t.status === "completed");

  const streak = useMemo(() => {
    const dates = completedTasks
      .filter((t) => t.completed_at)
      .map((t) => new Date(t.completed_at))
      .sort((a, b) => b - a);

    if (dates.length === 0) return 0;

    let count = 1;
    let current = new Date(dates[0]);
    current.setHours(0, 0, 0, 0);

    for (let i = 1; i < dates.length; i += 1) {
      const next = new Date(dates[i]);
      next.setHours(0, 0, 0, 0);
      const diff = (current - next) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        count += 1;
        current = next;
      } else if (diff > 1) {
        break;
      }
    }
    return count;
  }, [completedTasks]);

  const badges = [
    { id: "first", title: "First Win", desc: "Complete your first task", earned: completedTasks.length >= 1 },
    { id: "five", title: "Momentum", desc: "Complete 5 tasks", earned: completedTasks.length >= 5 },
    { id: "twenty", title: "Skilled", desc: "Complete 20 tasks", earned: completedTasks.length >= 20 },
    { id: "fifty", title: "Mastery", desc: "Complete 50 tasks", earned: completedTasks.length >= 50 },
    { id: "streak3", title: "Streak x3", desc: "3-day completion streak", earned: streak >= 3 },
    { id: "streak7", title: "Streak x7", desc: "7-day completion streak", earned: streak >= 7 },
  ];

  if (loading) {
    return (
      <div className="page-shell" style={{ alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>Loading achievements…</p>
      </div>
    );
  }

  return (
    <div className="page-shell" style={{ alignItems: "flex-start" }}>
      <div className="floating-blob" style={{ top: "-12%", left: "-10%" }} />
      <div className="floating-blob" style={{ bottom: "-14%", right: "-12%" }} />

      <div style={{ width: "100%", maxWidth: 1100, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={() => navigate("/dashboard")} className="btn-ghost" style={{ width: "auto", padding: "0.5rem" }}>
            ←
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: "2rem", color: "#111827", fontWeight: "800" }}>Achievements</h1>
            <p style={{ margin: "0.25rem 0 0", color: "#4b5563", fontWeight: "600" }}>Celebrate progress and consistency</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "1.25rem", background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)", border: "2px solid #c7d2fe", boxShadow: "0 4px 6px -1px rgba(79,70,229,0.15)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "#4338ca", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.8rem" }}>Current Streak</div>
              <div style={{ color: "#4338ca", fontWeight: "800", fontSize: "2rem" }}>{streak} days</div>
            </div>
            <div style={{ color: "#6366f1", fontWeight: "700" }}>{completedTasks.length} tasks completed</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.9rem" }}>
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="glass-card"
              style={{
                padding: "1rem",
                background: badge.earned ? "#ffffff" : "#f9fafb",
                border: `2px solid ${badge.earned ? "#4338ca" : "#e5e7eb"}`,
                boxShadow: badge.earned ? "0 6px 12px rgba(67,56,202,0.2)" : "0 2px 4px rgba(0,0,0,0.06)"
              }}
            >
              <div style={{ color: badge.earned ? "#4338ca" : "#9ca3af", fontWeight: "800" }}>{badge.title}</div>
              <div style={{ color: badge.earned ? "#4b5563" : "#9ca3af", fontWeight: "600", marginTop: "0.25rem" }}>{badge.desc}</div>
              <div style={{ marginTop: "0.5rem", color: badge.earned ? "#059669" : "#9ca3af", fontWeight: "700", fontSize: "0.85rem" }}>
                {badge.earned ? "Unlocked" : "Locked"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
