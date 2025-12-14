import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Default = Signup */}
      <Route path="/" element={<Signup />} />

      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />

      <Route
        path="/create"
        element={token ? <CreatePost /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
