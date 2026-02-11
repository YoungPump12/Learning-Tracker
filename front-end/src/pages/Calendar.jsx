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

export default function Calendar() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rangeDays, setRangeDays] = useState(14);
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

  const days = useMemo(() => {
    const list = [];
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    for (let i = 0; i < rangeDays; i += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      list.push(d);
    }
    return list;
  }, [rangeDays]);

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      const date = new Date(task.scheduled_date);
      const key = date.toISOString().slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(task);
    });
    return map;
  }, [tasks]);

  if (loading) {
    return (
      <div className="page-shell" style={{ alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>Loading calendar…</p>
      </div>
    );
  }

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
            <h1 style={{ margin: 0, fontSize: "2rem", color: "#111827", fontWeight: "800" }}>Calendar</h1>
            <p style={{ margin: "0.25rem 0 0", color: "#4b5563", fontWeight: "600" }}>Plan and track tasks by date</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setRangeDays(d)}
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "0.5rem",
                  border: "2px solid",
                  cursor: "pointer",
                  fontWeight: "700",
                  ...(rangeDays === d
                    ? { backgroundColor: "#4338ca", color: "#ffffff", borderColor: "#4338ca" }
                    : { backgroundColor: "#ffffff", color: "#4b5563", borderColor: "#d1d5db" })
                }}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.9rem" }}>
          {days.map((day) => {
            const key = day.toISOString().slice(0, 10);
            const dayTasks = tasksByDate[key] || [];
            return (
              <div
                key={key}
                className="glass-card"
                style={{ padding: "1rem", background: "#ffffff", border: "2px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div style={{ color: "#111827", fontWeight: "800" }}>
                    {day.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                  </div>
                  <span style={{ color: "#4b5563", fontWeight: "700" }}>{dayTasks.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {dayTasks.length === 0 ? (
                    <div style={{ color: "#9ca3af", fontSize: "0.85rem", fontWeight: "600" }}>No tasks</div>
                  ) : (
                    dayTasks.slice(0, 4).map((task) => (
                      <div
                        key={task.id}
                        style={{
                          padding: "0.5rem 0.6rem",
                          borderRadius: "0.5rem",
                          border: "2px solid #e5e7eb",
                          background: "#f9fafb",
                          borderLeft: `4px solid ${getPriorityColor(task.priority)}`
                        }}
                      >
                        <div style={{ color: "#111827", fontWeight: "700", fontSize: "0.9rem" }}>{task.title}</div>
                        <div style={{ color: "#4b5563", fontSize: "0.8rem", fontWeight: "600" }}>{task.status.replace("_", " ")}</div>
                      </div>
                    ))
                  )}
                  {dayTasks.length > 4 && (
                    <div style={{ color: "#4338ca", fontWeight: "700", fontSize: "0.8rem" }}>+{dayTasks.length - 4} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
