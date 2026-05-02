import { useEffect, useState } from "react";
import API from "../services/api";
import TaskCard from "../components/TaskCard";

function Dashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [projectId, setProjectId] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTasks();
    if (user?.role === "admin") getProjects();
  }, [user]);

  const getTasks = async () => {
    setLoading(true);
    try {
      const res = await API.get("/task");
      setTasks(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getProjects = async () => {
    try {
      const res = await API.get("/project");
      setProjects(res.data);
    } catch (err) { console.error(err); }
  };

  const createProject = async (e) => {
    e.preventDefault();
    if (!newProjectName) return;
    try {
      await API.post("/project", { name: newProjectName, createdBy: user.email });
      setNewProjectName("");
      getProjects();
    } catch (err) { console.error(err); }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title || !email || !projectId) return;
    try {
      await API.post("/task", { title, assignedTo: email, projectId });
      setTitle(""); setEmail(""); setProjectId("");
      getTasks();
    } catch (err) { console.error(err); }
  };

  const updateStatus = async (id, status) => {
    await API.put(`/task/${id}`, { status });
    getTasks();
  };

  const giveScore = async (id, scoreObj) => {
    const average = (scoreObj.accuracy + scoreObj.completeness) / 2;
    await API.put(`/task/${id}`, { qualityScore: { ...scoreObj, average } });
    getTasks();
  };

  const filteredTasks = tasks.filter(t => user?.role === "admin" || t.assignedTo === user?.email);

  return (
    <div className="container animate-fade-in" style={{ padding: "2rem 1.5rem 4rem" }}>
      <header style={{ marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", margin: 0 }}>Team Workspace</h1>
        <p className="text-muted" style={{ fontSize: "1rem", marginTop: "0.25rem" }}>
          Welcome back, {user?.name?.split(" ")[0] || "User"}. Managing {filteredTasks.length} active tasks.
        </p>
      </header>

      <div className={`dashboard-grid ${user?.role === "admin" ? "admin" : ""}`}>
        
        {user?.role === "admin" && (
          <aside style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="card" style={{ padding: "1.25rem" }}>
              <h3 style={{ fontSize: "0.9rem", marginBottom: "1.25rem" }}>Create Project</h3>
              <form onSubmit={createProject}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.75rem" }}>Project Name</label>
                  <input placeholder="Enter name" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} style={{ margin: 0, padding: "0.6rem" }} />
                </div>
                <button type="submit">Create Project</button>
              </form>
            </div>

            <div className="card" style={{ padding: "1.25rem" }}>
              <h3 style={{ fontSize: "0.9rem", marginBottom: "1.25rem" }}>Assign Task</h3>
              <form onSubmit={addTask}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.75rem" }}>Project</label>
                  <select value={projectId} onChange={(e) => setProjectId(e.target.value)} style={{ margin: 0, padding: "0.6rem" }}>
                    <option value="">Select a project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.75rem" }}>Task Title</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ margin: 0, padding: "0.6rem" }} />
                </div>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ fontSize: "0.75rem" }}>Assignee Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ margin: 0, padding: "0.6rem" }} />
                </div>
                <button type="submit" className="success">Assign Task</button>
              </form>
            </div>
          </aside>
        )}

        <main>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: 0 }}>{user?.role === "admin" ? "Current Assignments" : "My Work"}</h2>
            <div className="badge badge-progress" style={{ fontSize: "0.7rem" }}>{filteredTasks.length} total</div>
          </div>
          
          {loading ? <p className="text-muted">Loading tasks...</p> : filteredTasks.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "3rem", borderStyle: "dashed" }}>
              <p className="text-muted">No tasks available in this view.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {filteredTasks.map(t => (
                <TaskCard key={t._id} task={t} updateStatus={updateStatus} giveScore={giveScore} user={user} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
