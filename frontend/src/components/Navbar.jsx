import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, LogOut, Settings, ChevronDown, Mail, Shield } from "lucide-react";

function Navbar({ user, setUser }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav style={{ 
      backgroundColor: "white", 
      borderBottom: "1px solid #f1f1f1", 
      padding: "0.75rem 0",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.03)"
    }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ background: "var(--primary)", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>T</div>
          <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text)", letterSpacing: "-0.02em" }}>TaskManager</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {!user ? (
            <>
              <Link to="/login" style={{ textDecoration: "none", color: "var(--text-muted)", fontWeight: "500", fontSize: "0.85rem" }}>Log in</Link>
              <button onClick={() => navigate("/signup")}>Get Started</button>
            </>
          ) : (
            <div style={{ position: "relative" }} ref={dropdownRef}>
              {/* Profile Trigger */}
              <div 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "10px", 
                  padding: "4px 8px", 
                  borderRadius: "20px", 
                  cursor: "pointer",
                  transition: "background 0.2s",
                  background: showDropdown ? "#f3f4f6" : "transparent"
                }}
                onMouseEnter={(e) => !showDropdown && (e.currentTarget.style.background = "#f9fafb")}
                onMouseLeave={(e) => !showDropdown && (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ 
                  background: "#4f46e5", 
                  color: "white", 
                  width: "34px", 
                  height: "34px", 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  fontSize: "0.95rem",
                  fontWeight: "bold",
                  boxShadow: "0 0 0 2px white, 0 0 0 4px #e0e7ff"
                }}>
                  {user?.name?.charAt(0) || "U"}
                </div>
                <ChevronDown size={14} color="#111827" style={{ transform: showDropdown ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="card animate-fade-in" style={{ 
                  position: "absolute", 
                  top: "calc(100% + 12px)", 
                  right: 0, 
                  width: "260px", 
                  padding: "0", 
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  overflow: "hidden",
                  border: "1px solid #e5e7eb"
                }}>
                  {/* User Header */}
                  <div style={{ padding: "20px 16px", borderBottom: "1px solid #f1f1f1", background: "linear-gradient(to bottom, #ffffff, #f9fafb)" }}>
                    <div style={{ fontWeight: "800", fontSize: "1rem", color: "#111827" }}>{user.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "#4b5563", marginTop: "6px" }}>
                      <Mail size={14} color="#6b7280" /> {user.email}
                    </div>
                    <div style={{ 
                      display: "inline-flex", 
                      alignItems: "center", 
                      gap: "6px", 
                      fontSize: "0.7rem", 
                      color: "#4338ca", 
                      background: "#eef2ff",
                      padding: "3px 10px",
                      borderRadius: "12px",
                      fontWeight: "800", 
                      textTransform: "uppercase", 
                      marginTop: "14px",
                      border: "1px solid #e0e7ff"
                    }}>
                      <Shield size={12} /> {user.role}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ padding: "8px" }}>
                    <button 
                      className="outline" 
                      style={{ width: "100%", justifyContent: "flex-start", border: "none", background: "transparent", gap: "12px", padding: "12px", fontSize: "0.9rem", color: "#374151" }}
                      onClick={() => { navigate("/dashboard"); setShowDropdown(false); }}
                    >
                      <Settings size={18} color="#6b7280" /> My Workspace
                    </button>
                    <button 
                      className="outline" 
                      style={{ width: "100%", justifyContent: "flex-start", border: "none", background: "transparent", gap: "12px", padding: "12px", fontSize: "0.9rem", color: "#dc2626" }}
                      onClick={logout}
                    >
                      <LogOut size={18} color="#ef4444" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
