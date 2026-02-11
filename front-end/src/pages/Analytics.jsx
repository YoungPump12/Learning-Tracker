import { useEffect, useState } from "react";
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

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [priorityDist, setPriorityDist] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [statsRes, priorityRes] = await Promise.all([
        api.get("/api/tasks/statistics/"),
        api.get("/api/tasks/priority_distribution/"),
      ]);
      setStats(statsRes.data);
      setPriorityDist(priorityRes.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "#7c3aed";
      case "high":
        return "#c2410c";
      case "medium":
        return "#a16207";
      case "low":
        return "#1d4ed8";
      default:
        return "#6b7280";
    }
  };

  if (loading || !stats) {
    return (
      <div className="page-shell" style={{ alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>Loading analytics…</p>
      </div>
    );
  }

  const activeTasks = stats.pending_tasks + stats.in_progress_tasks;

  return (
    <div className="page-shell" style={{ alignItems: "flex-start" }}>
      <div className="floating-blob" style={{ top: "-12%", left: "-10%" }} />
      <div className="floating-blob" style={{ bottom: "-14%", right: "-12%" }} />

      <div style={{ width: "100%", maxWidth: 1200, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={() => navigate("/dashboard")} className="btn-ghost" style={{ width: "auto", padding: "0.5rem" }}>
            ←
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: "2rem", color: "#111827", fontWeight: "800" }}>Analytics</h1>
            <p style={{ margin: "0.25rem 0 0", color: "#4b5563", fontWeight: "600" }}>Insights from your learning data</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.9rem" }}>
          {[
            { label: "Completion Rate", value: `${stats.completion_rate.toFixed(1)}%`, sub: `${stats.completed_tasks}/${stats.total_tasks} tasks` },
            { label: "Total Completed", value: stats.completed_tasks, sub: "tasks done" },
            { label: "Active Tasks", value: activeTasks, sub: "pending + in progress" },
            { label: "Total Tasks", value: stats.total_tasks, sub: "all tasks" },
          ].map((card) => (
            <div
              key={card.label}
              className="glass-card"
              style={{ padding: "1.1rem", background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)", border: "2px solid #c7d2fe", boxShadow: "0 4px 6px -1px rgba(79,70,229,0.15)" }}
            >
              <div style={{ color: "#4338ca", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.8rem" }}>{card.label}</div>
              <div style={{ color: "#4338ca", fontWeight: "800", fontSize: "2rem", marginTop: "0.2rem" }}>{card.value}</div>
              <div style={{ color: "#6366f1", fontWeight: "600", fontSize: "0.85rem", marginTop: "0.4rem" }}>{card.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          <div className="glass-card" style={{ padding: "1.25rem", background: "#ffffff", border: "2px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "#111827", fontWeight: "700" }}>Status Breakdown</h3>
            {[
              { label: "Completed", value: stats.completed_tasks, color: "#059669" },
              { label: "In Progress", value: stats.in_progress_tasks, color: "#dc2626" },
              { label: "Pending", value: stats.pending_tasks, color: "#6b7280" },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                  <span style={{ color: "#111827", fontWeight: "700" }}>{item.label}</span>
                  <span style={{ color: "#4b5563", fontWeight: "700" }}>{item.value}</span>
                </div>
                <div style={{ height: "8px", background: "#f3f4f6", borderRadius: "6px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.max((item.value / (stats.total_tasks || 1)) * 100, 5)}%`,
                      background: item.color,
                      boxShadow: `0 2px 6px ${item.color}55`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ padding: "1.25rem", background: "#ffffff", border: "2px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "#111827", fontWeight: "700" }}>Priority Mix</h3>
            {['critical', 'high', 'medium', 'low'].map((priority) => (
              <div key={priority} style={{ marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                  <span style={{ color: "#111827", fontWeight: "700", textTransform: "capitalize" }}>{priority}</span>
                  <span style={{ color: "#4b5563", fontWeight: "700" }}>{priorityDist[priority] || 0}</span>
                </div>
                <div style={{ height: "8px", background: "#f3f4f6", borderRadius: "6px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.max(((priorityDist[priority] || 0) / (stats.total_tasks || 1)) * 100, 5)}%`,
                      background: getPriorityColor(priority),
                      boxShadow: `0 2px 6px ${getPriorityColor(priority)}55`
                    }}
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
