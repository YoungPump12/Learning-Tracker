import { Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Tasks from "./pages/Tasks"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Calendar from "./pages/Calendar"
import Analytics from "./pages/Analytics"
import Goals from "./pages/Goals"
import Resources from "./pages/Resources"
import Achievements from "./pages/Achievements"
import Settings from "./pages/Settings"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/achievements" element={<Achievements />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
