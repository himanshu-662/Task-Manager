import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Fields required"); return; }
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password, role });
      if (res.data.token) { 
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user); 
        navigate("/dashboard"); 
      }
      else setError(res.data.message || "Failed");
    } catch (err) { 
      console.error("Login Error Details:", err);
      setError("Network error: " + (err.message || "Unknown")); 
    } finally { setLoading(false); }
  };

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "calc(100vh - 120px)",
      padding: "1rem" 
    }}>
      <div className="card animate-fade-in" style={{ width: "100%", maxWidth: "380px", textAlign: "center" }}>
        <h2 style={{ marginBottom: "0.5rem" }}>Login</h2>
        <p className="text-muted" style={{ marginBottom: "2rem" }}>Enter your credentials to continue</p>
        
        <form onSubmit={login} style={{ textAlign: "left" }}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} style={{ margin: 0 }} />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} style={{ margin: 0 }} />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} disabled={loading} style={{ margin: 0 }}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && (
          <div style={{ 
            color: "#b91c1c", 
            backgroundColor: "#fef2f2", 
            padding: "12px", 
            borderRadius: "8px", 
            fontSize: "0.85rem", 
            marginBottom: "1.5rem",
            border: "1px solid #fecaca",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span style={{ fontWeight: "bold" }}>Error:</span> {error}
          </div>
        )}
          <button type="submit" style={{ width: "100%", padding: "0.75rem" }} disabled={loading}>
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
        <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" }}>
          No account? <button className="outline" style={{ border: "none", color: "var(--primary)" }} onClick={() => navigate("/signup")}>Sign up</button>
        </p>
      </div>
    </div>
  );
}

export default Login;