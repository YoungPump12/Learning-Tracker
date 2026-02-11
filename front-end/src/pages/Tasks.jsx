import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { CheckCircleIcon, PlayCircleIcon, TrashIcon, ArrowLeftIcon, SparklesIcon } from "@heroicons/react/24/solid";
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

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState("medium");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [timeEstimate, setTimeEstimate] = useState("");
  const [tags, setTags] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState("weekly");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6366f1");
  const [loading, setLoading] = useState(false);
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("active");
  const navigate = useNavigate();

  const completedCount = tasks.filter((task) => task.status === "completed").length;
  const totalCount = tasks.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksRes, categoriesRes] = await Promise.all([
        api.get("/api/tasks/"),
        api.get("/api/categories/"),
      ]);
      setTasks(tasksRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/tasks/", {
        title,
        description,
        category: categoryId || null,
        scheduled_date: scheduledDate,
        priority,
        difficulty,
        time_estimate: timeEstimate ? parseInt(timeEstimate) : null,
        tags,
        is_recurring: isRecurring,
        recurring_pattern: isRecurring ? recurringPattern : "",
        status: "pending",
      });
      setTitle("");
      setDescription("");
      setScheduledDate("");
      setCategoryId("");
      setPriority("medium");
      setDifficulty("intermediate");
      setTimeEstimate("");
      setTags("");
      setIsRecurring(false);
      loadData();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/categories/", {
        name: newCategoryName,
        color: newCategoryColor,
      });
      setNewCategoryName("");
      setNewCategoryColor("#6366f1");
      setShowCategoryForm(false);
      loadData();
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/tasks/${id}/`, { status });
      loadData();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/api/tasks/${id}/`);
        loadData();
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    
    if (filterStatus === "active") {
      filtered = filtered.filter(t => t.status !== 'completed');
    } else if (filterStatus === "completed") {
      filtered = filtered.filter(t => t.status === 'completed');
    }
    
    if (filterPriority !== "all") {
      filtered = filtered.filter(t => t.priority === filterPriority);
    }
    
    return filtered.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const getCategoryColor = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat?.color || "#6366f1";
  };

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat?.name || "Uncategorized";
  };

  return (
    <div className="page-shell" style={{ alignItems: "flex-start" }}>
      <div className="floating-blob" style={{ top: "-12%", left: "-10%" }} />
      <div className="floating-blob" style={{ bottom: "-14%", right: "-12%" }} />

      <div style={{ width: "100%", maxWidth: 1080, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-ghost"
            style={{ width: "auto", padding: "0.5rem" }}
          >
            <ArrowLeftIcon style={{ width: "1.25rem", height: "1.25rem" }} />
          </button>
          <div style={{ textAlign: "left", flex: 1 }}>
            <p style={{ color: "#4b5563", margin: 0, fontWeight: "600" }}>Task Management</p>
            <h1 style={{ margin: "0.2rem 0", fontSize: "1.9rem", color: "#111827", fontWeight: "800" }}>My Learning Tasks</h1>
          </div>
          <button 
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            className="btn-ghost"
            style={{ width: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <SparklesIcon style={{ width: "1.25rem", height: "1.25rem" }} />
            Categories
          </button>
        </div>

        {/* Category Management */}
        {showCategoryForm && (
          <div className="glass-card" style={{ padding: "1.25rem", background: "#ffffff", border: "2px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
            <h3 style={{ margin: "0 0 0.75rem 0", color: "#111827", fontWeight: "700" }}>Create Category</h3>
            <form onSubmit={createCategory} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
              <input
                type="text"
                className="field"
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
                style={{ flex: 1 }}
              />
              <input
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                style={{ width: "50px", height: "40px", cursor: "pointer", borderRadius: "0.375rem" }}
              />
              <button className="btn-primary" style={{ width: "auto" }}>Create</button>
              <button 
                type="button"
                className="btn-ghost"
                style={{ width: "auto" }}
                onClick={() => setShowCategoryForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Progress Bar */}
        <div className="glass-card" style={{ padding: "1.25rem", background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)", border: "2px solid #c7d2fe", boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.15)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div>
              <p style={{ color: "#4338ca", margin: 0, fontWeight: "700", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Overall progress</p>
              <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#4338ca", fontWeight: "800" }}>{completedCount} / {totalCount || 0} done</h2>
            </div>
            <div className="pill" style={{ height: "fit-content", backgroundColor: "#4338ca", color: "#ffffff", fontWeight: "700", boxShadow: "0 2px 4px rgba(67, 56, 202, 0.3)" }}>{progress}%</div>
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

        {/* Add Task Form */}
        <div className="glass-card" style={{ padding: "1.25rem", background: "#ffffff", border: "2px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
          <p style={{ color: "#4b5563", marginTop: 0, marginBottom: "0.65rem", fontWeight: "600" }}>Add a new task</p>
          <form onSubmit={createTask} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <input
              className="field"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              className="field"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem" }}>
              <select
                className="field"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <select
                className="field"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Priority: Low</option>
                <option value="medium">Priority: Medium</option>
                <option value="high">Priority: High</option>
                <option value="critical">Priority: Critical</option>
              </select>

              <select
                className="field"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="beginner">Difficulty: Beginner</option>
                <option value="intermediate">Difficulty: Intermediate</option>
                <option value="advanced">Difficulty: Advanced</option>
                <option value="expert">Difficulty: Expert</option>
              </select>

              <input
                type="number"
                className="field"
                placeholder="Time estimate (minutes)"
                value={timeEstimate}
                onChange={(e) => setTimeEstimate(e.target.value)}
              />
            </div>

            <input
              type="datetime-local"
              className="field"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              required
            />

            <input
              className="field"
              placeholder="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />

            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#374151", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              Recurring task
            </label>

            {isRecurring && (
              <select
                className="field"
                value={recurringPattern}
                onChange={(e) => setRecurringPattern(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            )}

            <button className="btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add Task"}
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="glass-card" style={{ padding: "1.25rem", background: "#ffffff", border: "2px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <select
              className="field"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: "auto" }}
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>

            <select
              className="field"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{ width: "auto" }}
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Tasks List */}
        <div className="glass-card" style={{ padding: "1.25rem", background: "#ffffff", border: "2px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h3 style={{ margin: 0, color: "#111827", fontWeight: "700" }}>Tasks</h3>
            <span style={{ color: "#4b5563", fontWeight: "600" }}>{getFilteredTasks().length} to show</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {getFilteredTasks().length === 0 && (
              <p style={{ color: "#9ca3af", margin: 0, textAlign: "center", padding: "1rem" }}>
                {tasks.length === 0 ? "No tasks yet. Create your first one!" : "No tasks match your filters."}
              </p>
            )}
            {getFilteredTasks().map((task) => (
              <div 
                key={task.id}
                style={{
                  padding: "0.75rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "0.5rem",
                  border: "2px solid #e5e7eb",
                  borderLeft: `4px solid ${task.category ? getCategoryColor(task.category) : "#6366f1"}`,
                  transition: "all 0.2s ease"
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
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                      <h4 style={{ margin: 0, color: "#111827", fontWeight: "700" }}>{task.title}</h4>
                      <span style={{
                        display: "inline-block",
                        padding: "0.1rem 0.5rem",
                        backgroundColor: task.priority === 'critical' ? '#7c3aed' : task.priority === 'high' ? '#c2410c' : task.priority === 'medium' ? '#a16207' : '#1d4ed8',
                        color: "#ffffff",
                        borderRadius: "3px",
                        fontSize: "0.65rem",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
                      }}>
                        {task.priority}
                      </span>
                    </div>
                    <small style={{ color: "#374151", fontWeight: "500" }}>{task.description}</small>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                      {task.category && (
                        <span style={{ color: getCategoryColor(task.category), fontSize: "0.8rem", fontWeight: "700" }}>
                          ◆ {getCategoryName(task.category)}
                        </span>
                      )}
                      {task.time_estimate && (
                        <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>⏱️ {task.time_estimate}min</span>
                      )}
                      <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                        📅 {new Date(task.scheduled_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.35rem" }}>
                    <button onClick={() => updateStatus(task.id, "in_progress")} className="btn-ghost" style={{ width: "auto", padding: "0.4rem 0.55rem" }} title="Start">
                      <PlayCircleIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => updateStatus(task.id, "completed")} className="btn-ghost" style={{ width: "auto", padding: "0.4rem 0.55rem" }} title="Complete">
                      <CheckCircleIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="btn-ghost" style={{ width: "auto", padding: "0.4rem 0.55rem" }} title="Delete">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
