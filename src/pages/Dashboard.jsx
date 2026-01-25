import { useEffect, useState } from "react";
import axios from "axios";
import { motion as Motion } from "framer-motion";
import { CheckCircleIcon, PlayCircleIcon, TrashIcon } from "@heroicons/react/24/solid";

const API_URL = "https://api.tafadzwa.co/";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [loading, setLoading] = useState(false);

  const completedCount = tasks.filter((task) => task.status === "completed").length;
  const totalCount = tasks.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      window.location.href = "/login"; // hard redirect for cPanel
      return;
    }
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await api.get("/api/tasks/");
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/tasks/", {
        title,
        description,
        scheduled_date: scheduledDate,
        status: "pending",
      });
      setTitle("");
      setDescription("");
      setScheduledDate("");
      loadTasks();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/tasks/${id}/`, { status });
      loadTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}/`);
      loadTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login"; // hard redirect
  };

  return (
    <div className="page-shell" style={{ alignItems: "flex-start" }}>
      <div className="floating-blob" style={{ top: "-12%", left: "-10%" }} />
      <div className="floating-blob" style={{ bottom: "-14%", right: "-12%" }} />

      <div style={{ width: "100%", maxWidth: 1080, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
            <div style={{ textAlign: "left" }}>
              <p style={{ color: "#94a3b8", margin: 0 }}>Welcome back</p>
              <h1 style={{ margin: "0.2rem 0", fontSize: "1.9rem" }}>My Learning Tracker</h1>
              <p style={{ color: "#cbd5e1", margin: 0 }}>Track progress across your learning plan.</p>
            </div>
            <button onClick={logout} className="btn-ghost" style={{ width: "auto" }}>Logout</button>
          </div>
        </div>

        <div className="card-grid">
          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <div>
                <p style={{ color: "#94a3b8", margin: 0 }}>Overall progress</p>
                <h2 style={{ margin: 0, fontSize: "1.4rem" }}>{completedCount} / {totalCount || 0} done</h2>
              </div>
              <div className="pill" style={{ height: "fit-content" }}>{progress}%</div>
            </div>
            <div className="progress-track">
              <Motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <p style={{ color: "#94a3b8", marginTop: 0, marginBottom: "0.65rem" }}>Add a task</p>
            <form onSubmit={createTask} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <input
                id="task-title"
                name="title"
                className="field"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <input
                id="task-description"
                name="description"
                className="field"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                id="task-scheduled"
                name="scheduled_date"
                type="datetime-local"
                className="field"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />
              <button className="btn-primary" disabled={loading}>
                {loading ? "Adding..." : "Add Task"}
              </button>
            </form>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h3 style={{ margin: 0 }}>Tasks</h3>
            <span style={{ color: "#94a3b8" }}>{tasks.length} total</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {tasks.length === 0 && <p style={{ color: "#94a3b8", margin: 0 }}>No tasks yet. Add your first one!</p>}
            {tasks.map((task) => (
              <div key={task.id} className="task-card">
                <div style={{ textAlign: "left" }}>
                  <h4 style={{ margin: 0 }}>{task.title}</h4>
                  <small style={{ color: "#94a3b8" }}>{task.status.replace("_", " ")}</small>
                </div>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  <button onClick={() => updateStatus(task.id, "in_progress")} className="btn-ghost" style={{ width: "auto", padding: "0.4rem 0.55rem" }}>
                    <PlayCircleIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => updateStatus(task.id, "completed")} className="btn-ghost" style={{ width: "auto", padding: "0.4rem 0.55rem" }}>
                    <CheckCircleIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="btn-ghost" style={{ width: "auto", padding: "0.4rem 0.55rem" }}>
                    <TrashIcon className="w-4 h-4" />
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
