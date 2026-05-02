import { useState } from "react";
import { CheckCircle, Clock, Circle, Award } from "lucide-react";

function TaskCard({ task, updateStatus, giveScore, user }) {
  const [accuracy, setAccuracy] = useState(5);
  const [completeness, setCompleteness] = useState(5);
  const [showEval, setShowEval] = useState(false);

  const isDone = task.status === "done";
  const inProgress = task.status === "in-progress";

  const getStatusBadge = () => {
    switch (task.status) {
      case "done": return <span className="badge badge-done" style={{ display: "flex", alignItems: "center", gap: "6px" }}><CheckCircle size={14} /> Done</span>;
      case "in-progress": return <span className="badge badge-progress" style={{ display: "flex", alignItems: "center", gap: "6px" }}><Clock size={14} /> In Progress</span>;
      default: return <span className="badge badge-todo" style={{ display: "flex", alignItems: "center", gap: "6px" }}><Circle size={14} /> To Do</span>;
    }
  };

  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.15rem" }}>
            {task.projectId?.name || "Global"}
          </div>
          <h3 style={{ margin: 0, fontSize: "1.05rem" }}>{task.title}</h3>
          <div className="text-muted" style={{ fontSize: "0.85rem", marginTop: "0.15rem" }}>User: {task.assignedTo}</div>
        </div>
        {getStatusBadge()}
      </div>

      {task.qualityScore && (
        <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", padding: "1.25rem", borderRadius: "10px", marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", fontSize: "0.95rem" }}>
              <Award size={18} color="#d97706" /> Quality Evaluation
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Accuracy: {task.qualityScore.accuracy} | Completeness: {task.qualityScore.completeness}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "1.5rem", fontWeight: "800" }}>{task.qualityScore.average}</span>
            <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}> / 5</span>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", borderTop: "1px solid #f9fafb", paddingTop: "1.25rem" }}>
        {user?.role === "member" && !isDone && (
          <>
            {!inProgress && <button className="outline" onClick={() => updateStatus(task._id, "in-progress")}>Start Working</button>}
            <button className="success" onClick={() => updateStatus(task._id, "done")}>Mark as Finished</button>
          </>
        )}

        {user?.role === "admin" && isDone && (
          <div style={{ width: "100%" }}>
            {!showEval ? <button className="outline" style={{ width: "100%" }} onClick={() => setShowEval(true)}>Evaluate Task Performance</button> : (
              <div className="animate-fade-in" style={{ background: "#fcfcfd", border: "1px solid #f3f4f6", padding: "1.25rem", borderRadius: "10px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  <div>
                    <label style={{ display: "flex", justifyContent: "space-between" }}>Accuracy <span>{accuracy}</span></label>
                    <input type="range" min="1" max="5" step="0.5" value={accuracy} onChange={(e) => setAccuracy(e.target.value)} style={{ margin: 0 }} />
                  </div>
                  <div>
                    <label style={{ display: "flex", justifyContent: "space-between" }}>Completeness <span>{completeness}</span></label>
                    <input type="range" min="1" max="5" step="0.5" value={completeness} onChange={(e) => setCompleteness(e.target.value)} style={{ margin: 0 }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button className="success" style={{ flex: 1 }} onClick={() => { giveScore(task._id, { accuracy: parseFloat(accuracy), completeness: parseFloat(completeness) }); setShowEval(false); }}>Submit Grade</button>
                  <button className="outline" onClick={() => setShowEval(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;