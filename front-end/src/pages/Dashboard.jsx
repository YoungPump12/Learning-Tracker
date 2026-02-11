import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";

const API_URL = API_BASE_URL;

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
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priorityDist, setPriorityDist] = useState({});
  const [taskFilter, setTaskFilter] = useState('active'); // 'all', 'active', 'pending', 'in_progress', 'completed'
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [tasksRes, statsRes, priorityRes] = await Promise.all([
        api.get("/api/tasks/"),
        api.get("/api/tasks/statistics/"),
        api.get("/api/tasks/priority_distribution/"),
      ]);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
      setPriorityDist(priorityRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRecentTasks = () => {
    let filtered = [...tasks];
    
    if (taskFilter === 'active') {
      filtered = filtered.filter(t => t.status !== 'completed');
    } else if (taskFilter === 'pending') {
      filtered = filtered.filter(t => t.status === 'pending');
    } else if (taskFilter === 'in_progress') {
      filtered = filtered.filter(t => t.status === 'in_progress');
    } else if (taskFilter === 'completed') {
      filtered = filtered.filter(t => t.status === 'completed');
    }
    // 'all' shows everything
    
    return filtered
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 10);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "1d ago";
    return `${diffDays}d ago`;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return '#059669'; // Deep Green - Success
      case 'in_progress':
        return '#dc2626'; // Deep Orange/Red - In Progress
      case 'pending':
        return '#6b7280'; // Deep Grey - Pending
      default:
        return '#9ca3af';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical':
        return '#7c3aed'; // Deep Purple
      case 'high':
        return '#c2410c'; // Deep Orange
      case 'medium':
        return '#a16207'; // Deep Amber
      case 'low':
        return '#1d4ed8'; // Deep Blue
      default:
        return '#6b7280';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch(difficulty) {
      case 'beginner':
        return '★';
      case 'intermediate':
        return '★★';
      case 'advanced':
        return '★★★';
      case 'expert':
        return '★★★★';
      default:
        return '★';
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "http://localhost:5173/app/#/login";
  };

  if (loading || !stats) {
    return (
      <div className="page-shell" style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell" style={{ alignItems: "flex-start" }}>
      <div className="floating-blob" style={{ top: "-12%", left: "-10%" }} />
      <div className="floating-blob" style={{ bottom: "-14%", right: "-12%" }} />

      <div style={{ width: "100%", maxWidth: 1400, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "2.5rem", color: "#1f2937" }}>Learning Dashboard</h1>
            <p style={{ color: "#6b7280", margin: "0.25rem 0 0 0" }}>Track your progress and stay motivated</p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button 
              onClick={() => navigate("/tasks")}
              className="btn-primary" 
              style={{ width: "auto" }}
            >
              + Create New Task
            </button>
            <button onClick={logout} className="btn-ghost" style={{ width: "auto" }}>Logout</button>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div className="glass-card" style={{ padding: "1.25rem", background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)", border: "1px solid #c7d2fe", boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.1)" }}>
            <p style={{ color: "#4338ca", margin: "0 0 0.25rem 0", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em" }}>Completion Rate</p>
            <h2 style={{ margin: 0, fontSize: "2.5rem", color: "#4338ca", fontWeight: "800" }}>{stats.completion_rate.toFixed(1)}%</h2>
            <p style={{ color: "#6366f1", margin: "0.5rem 0 0 0", fontSize: "0.9rem", fontWeight: "600" }}>{stats.completed_tasks}/{stats.total_tasks} tasks</p>
          </div>

          <div className="glass-card" style={{ padding: "1.25rem", background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)", border: "1px solid #c7d2fe", boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.1)" }}>
            <p style={{ color: "#4338ca", margin: "0 0 0.25rem 0", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em" }}>Total Completed</p>
            <h2 style={{ margin: 0, fontSize: "2.5rem", color: "#4338ca", fontWeight: "800" }}>{stats.completed_tasks}</h2>
            <p style={{ color: "#6366f1", margin: "0.5rem 0 0 0", fontSize: "0.9rem", fontWeight: "600" }}>tasks done</p>
          </div>

          {/* <div className="glass-card" style={{ padding: "1.25rem", background: "#f1f5f9", border: "1px solid #e2e8f0" }}>
            <p style={{ color: "#64748b", margin: "0 0 0.25rem 0", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "600" }}>Hours Studied</p>
            <h2 style={{ margin: 0, fontSize: "2.5rem", color: "#4f46e5" }}>{(stats.total_time_spent / 60).toFixed(1)}</h2>
            <p style={{ color: "#75818c", margin: "0.5rem 0 0 0", fontSize: "0.9rem" }}>total time</p>
          </div> */}

          <div className="glass-card" style={{ padding: "1.25rem", background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)", border: "1px solid #c7d2fe", boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.1)" }}>
            <p style={{ color: "#4338ca", margin: "0 0 0.25rem 0", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em" }}>Active Tasks</p>
            <h2 style={{ margin: 0, fontSize: "2.5rem", color: "#4338ca", fontWeight: "800" }}>{stats.pending_tasks + stats.in_progress_tasks}</h2>
            <p style={{ color: "#6366f1", margin: "0.5rem 0 0 0", fontSize: "0.9rem", fontWeight: "600" }}>in progress</p>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {/* Status Breakdown */}
          <div className="glass-card" style={{ padding: "1.5rem", background: "#ffffff", border: "2px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}>
            <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.1rem", color: "#111827", fontWeight: "700" }}>Task Status Overview</h3>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px", gap: "2rem" }}>
              <svg width="140" height="140" viewBox="0 0 140 140" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}>
                <circle cx="70" cy="70" r="45" fill="none" stroke="#059669" strokeWidth="32" strokeDasharray={`${stats.total_tasks > 0 ? (stats.completed_tasks / stats.total_tasks) * 283 : 0}`} strokeDashoffset="0" transform="rotate(-90 70 70)" />
                <circle cx="70" cy="70" r="45" fill="none" stroke="#dc2626" strokeWidth="32" strokeDasharray={`${stats.total_tasks > 0 ? (stats.in_progress_tasks / stats.total_tasks) * 283 : 0}`} strokeDashoffset={`${stats.total_tasks > 0 ? -(stats.completed_tasks / stats.total_tasks) * 283 : 0}`} transform="rotate(-90 70 70)" />
                <circle cx="70" cy="70" r="45" fill="none" stroke="#6b7280" strokeWidth="32" strokeDasharray={`${stats.total_tasks > 0 ? (stats.pending_tasks / stats.total_tasks) * 283 : 0}`} strokeDashoffset={`${stats.total_tasks > 0 ? -((stats.completed_tasks + stats.in_progress_tasks) / stats.total_tasks) * 283 : 0}`} transform="rotate(-90 70 70)" />
              </svg>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: "16px", height: "16px", backgroundColor: "#059669", borderRadius: "4px", boxShadow: "0 2px 4px rgba(5, 150, 105, 0.3)" }} />
                  <span style={{ color: "#1f2937", fontSize: "0.9rem", fontWeight: "600" }}>Completed: {stats.completed_tasks}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: "16px", height: "16px", backgroundColor: "#dc2626", borderRadius: "4px", boxShadow: "0 2px 4px rgba(220, 38, 38, 0.3)" }} />
                  <span style={{ color: "#1f2937", fontSize: "0.9rem", fontWeight: "600" }}>In Progress: {stats.in_progress_tasks}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: "16px", height: "16px", backgroundColor: "#6b7280", borderRadius: "4px", boxShadow: "0 2px 4px rgba(107, 114, 128, 0.3)" }} />
                  <span style={{ color: "#1f2937", fontSize: "0.9rem", fontWeight: "600" }}>Pending: {stats.pending_tasks}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="glass-card" style={{ padding: "1.5rem", background: "#ffffff", border: "2px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}>
            <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.1rem", color: "#111827", fontWeight: "700" }}>Priority Levels</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {['critical', 'high', 'medium', 'low'].map((priority) => (
                <div key={priority} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ 
                    width: "50px", 
                    height: "50px", 
                    borderRadius: "12px",
                    backgroundColor: getPriorityColor(priority),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 12px ${getPriorityColor(priority)}40, 0 2px 6px ${getPriorityColor(priority)}30`,
                    border: `2px solid ${getPriorityColor(priority)}`,
                    position: "relative",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${getPriorityColor(priority)}20 0%, ${getPriorityColor(priority)}40 100%)`,
                      zIndex: 0
                    }} />
                    <span style={{ color: "#ffffff", fontWeight: "800", fontSize: "1.3rem", zIndex: 1, textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
                      {priorityDist[priority] || 0}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, color: "#111827", textTransform: "capitalize", fontWeight: "700", fontSize: "0.95rem" }}>{priority}</p>
                    <div style={{ 
                      width: "100%", 
                      height: "6px", 
                      backgroundColor: "#f3f4f6", 
                      borderRadius: "3px",
                      marginTop: "0.25rem",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${Math.max((priorityDist[priority] || 0) / (stats.total_tasks || 1) * 100, 5)}%`,
                        height: "100%",
                        backgroundColor: getPriorityColor(priority)
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Performance */}
          {stats.category_breakdown && stats.category_breakdown.length > 0 && (
            <div className="glass-card" style={{ padding: "1.5rem", background: "#ffffff", border: "2px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}>
              <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.1rem", color: "#111827", fontWeight: "700" }}>By Subject</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {stats.category_breakdown.map((cat) => (
                  <div key={cat.id} style={{
                    padding: "0.75rem",
                    backgroundColor: "#f9fafb",
                    borderLeft: `4px solid ${cat.color}`,
                    borderRadius: "0.5rem",
                    border: "1px solid #f3f4f6"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                      <p style={{ margin: 0, color: "#1f2937", fontWeight: "600" }}>{cat.name}</p>
                      <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>{cat.completed}/{cat.total}</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "#f3f4f6", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{
                        width: `${cat.total > 0 ? (cat.completed / cat.total) * 100 : 0}%`,
                        height: "100%",
                        backgroundColor: cat.color,
                        transition: "width 0.3s ease"
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className="glass-card" style={{ padding: "1.5rem", background: "#ffffff", border: "2px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#111827", fontWeight: "700" }}>Tasks</h3>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setTaskFilter('all')}
                style={{
                  padding: "0.375rem 0.75rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  border: "2px solid",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: taskFilter === 'all' ? "0 2px 4px rgba(67, 56, 202, 0.3)" : "none",
                  ...(taskFilter === 'all'
                    ? { backgroundColor: "#4338ca", color: "#ffffff", borderColor: "#4338ca" }
                    : { backgroundColor: "#ffffff", color: "#4b5563", borderColor: "#d1d5db" })
                }}
              >
                All
              </button>
              <button
                onClick={() => setTaskFilter('active')}
                style={{
                  padding: "0.375rem 0.75rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  border: "2px solid",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: taskFilter === 'active' ? "0 2px 4px rgba(67, 56, 202, 0.3)" : "none",
                  ...(taskFilter === 'active'
                    ? { backgroundColor: "#4338ca", color: "#ffffff", borderColor: "#4338ca" }
                    : { backgroundColor: "#ffffff", color: "#4b5563", borderColor: "#d1d5db" })
                }}
              >
                Active
              </button>
              <button
                onClick={() => setTaskFilter('pending')}
                style={{
                  padding: "0.375rem 0.75rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  border: "2px solid",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: taskFilter === 'pending' ? "0 2px 4px rgba(107, 114, 128, 0.3)" : "none",
                  ...(taskFilter === 'pending'
                    ? { backgroundColor: "#6b7280", color: "#ffffff", borderColor: "#6b7280" }
                    : { backgroundColor: "#ffffff", color: "#4b5563", borderColor: "#d1d5db" })
                }}
              >
                Pending
              </button>
              <button
                onClick={() => setTaskFilter('in_progress')}
                style={{
                  padding: "0.375rem 0.75rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  border: "2px solid",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: taskFilter === 'in_progress' ? "0 2px 4px rgba(220, 38, 38, 0.3)" : "none",
                  ...(taskFilter === 'in_progress'
                    ? { backgroundColor: "#dc2626", color: "#ffffff", borderColor: "#dc2626" }
                    : { backgroundColor: "#ffffff", color: "#4b5563", borderColor: "#d1d5db" })
                }}
              >
                In Progress
              </button>
              <button
                onClick={() => setTaskFilter('completed')}
                style={{
                  padding: "0.375rem 0.75rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  border: "2px solid",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: taskFilter === 'completed' ? "0 2px 4px rgba(5, 150, 105, 0.3)" : "none",
                  ...(taskFilter === 'completed'
                    ? { backgroundColor: "#059669", color: "#ffffff", borderColor: "#059669" }
                    : { backgroundColor: "#ffffff", color: "#4b5563", borderColor: "#d1d5db" })
                }}
              >
                Completed
              </button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {getRecentTasks().length === 0 ? (
              <p style={{ color: "#9ca3af", margin: 0, textAlign: "center", padding: "1rem" }}>
                {taskFilter === 'completed' ? "No completed tasks yet. Keep going! 💪" : 
                 taskFilter === 'pending' ? "No pending tasks. Great! 🎉" :
                 taskFilter === 'in_progress' ? "No tasks in progress. Start one now! 🚀" :
                 taskFilter === 'active' ? "No active tasks. Great work! 🎉" :
                 "No tasks found. Create your first one! ✨"}
              </p>
            ) : (
              getRecentTasks().map((task) => (
                <div 
                  key={task.id}
                  style={{
                    padding: "1rem",
                    backgroundColor: "#f9fafb",
                    borderRadius: "0.75rem",
                    border: "2px solid #e5e7eb",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                    e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <h4 style={{ margin: 0, color: "#111827", fontWeight: "700" }}>{task.title}</h4>
                        <span style={{ 
                          display: "inline-block",
                          padding: "0.1rem 0.5rem",
                          backgroundColor: getPriorityColor(task.priority),
                          color: "#ffffff",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          fontWeight: "bold",
                          textTransform: "uppercase"
                        }}>
                          {task.priority}
                        </span>
                      </div>
                      <p style={{ color: "#374151", margin: "0.25rem 0 0.5rem 0", fontSize: "0.9rem", fontWeight: "500" }}>{task.description || "No description"}</p>
                      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <span style={{ color: "#4b5563", fontSize: "0.85rem", fontWeight: "600" }}>
                          📅 {new Date(task.scheduled_date).toLocaleDateString()}
                        </span>
                        {task.time_estimate && (
                          <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                            ⏱️ {task.time_estimate} min
                          </span>
                        )}
                        {task.difficulty && (
                          <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                            {getDifficultyIcon(task.difficulty)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span style={{
                      display: "inline-block",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "9999px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      backgroundColor: getStatusColor(task.status),
                      color: "#ffffff",
                      textTransform: "capitalize",
                      whiteSpace: "nowrap"
                    }}>
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Explore (commented out for now)
        <div className="glass-card" style={{ padding: "1.5rem", background: "#ffffff", border: "2px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", color: "#111827", fontWeight: "700" }}>Explore</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
            {[
              { to: "/calendar", title: "Calendar", desc: "Schedule & plan" },
              { to: "/analytics", title: "Analytics", desc: "Deeper insights" },
              { to: "/goals", title: "Goals", desc: "Milestones & plans" },
              { to: "/resources", title: "Resources", desc: "Notes & links" },
              { to: "/achievements", title: "Achievements", desc: "Badges & streaks" },
              { to: "/settings", title: "Settings", desc: "Preferences" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  textDecoration: "none",
                  padding: "0.9rem",
                  borderRadius: "0.75rem",
                  border: "2px solid #e5e7eb",
                  background: "#f9fafb",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f3f4f6";
                  e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.12)";
                  e.currentTarget.style.borderColor = "#d1d5db";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f9fafb";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.06)";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                <div style={{ color: "#111827", fontWeight: "800", marginBottom: "0.25rem" }}>{item.title}</div>
                <div style={{ color: "#4b5563", fontSize: "0.85rem", fontWeight: "600" }}>{item.desc}</div>
              </Link>
            ))}
          </div>
        </div>
        */}
      </div>
    </div>
  );
}
