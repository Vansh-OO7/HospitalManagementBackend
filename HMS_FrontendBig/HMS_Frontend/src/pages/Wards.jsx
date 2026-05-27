import { useEffect, useState } from "react";
import { getWards, addWard, deleteWard } from "../services/wardService";

function Wards() {
  const [wards, setWards] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newWard, setNewWard] = useState({
    wardNumber: "",
    wardType: "",
    capacity: "",
    dailyCharge: "",
  });

  async function loadWards() {
    try {
      const response = await getWards();
      setWards(response.data);
    } catch (error) {
      console.error("Error loading wards:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWards();
  }, []);

  async function handleAddWard(e) {
    e.preventDefault();
    try {
      await addWard({
        ...newWard,
        capacity: Number(newWard.capacity),
        occupiedBeds: 0,
        dailyCharge: Number(newWard.dailyCharge),
      });
      setNewWard({ wardNumber: "", wardType: "", capacity: "", dailyCharge: "" });
      setIsAddModalOpen(false);
      loadWards();
    } catch (error) {
      alert("Failed to create ward.");
      console.error(error);
    }
  }

  async function handleDeleteWard(id) {
    if (window.confirm("Are you sure you want to delete this ward? Patients currently assigned to this ward will be unassigned automatically.")) {
      try {
        await deleteWard(id);
        loadWards();
      } catch (error) {
        alert("Failed to delete ward.");
        console.error(error);
      }
    }
  }

  return (
    <div className="tab-content" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      
      {/* Top Header Actions */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Ward
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
          <div style={{ border: "4px solid rgba(255,255,255,0.1)", borderTop: "4px solid var(--accent-indigo)", borderRadius: "50%", width: 30, height: 30, animation: "spin 1s linear infinite" }} />
        </div>
      ) : wards.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
          <p style={{ color: "var(--text-secondary)" }}>No wards configured yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {wards.map(ward => {
            const percent = ward.capacity > 0 ? Math.round((ward.occupiedBeds / ward.capacity) * 100) : 0;
            let colorClass = "indigo";
            if (percent >= 80) colorClass = "amber";
            if (percent >= 100) colorClass = "rose";

            return (
              <div key={ward.id} className="stat-card" style={{ flexDirection: "column", alignItems: "stretch", gap: 16, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>Ward {ward.wardNumber}</h3>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{ward.wardType}</span>
                  </div>
                  <button 
                    className="btn btn-danger" 
                    style={{ padding: 6, borderRadius: "var(--radius-sm)" }}
                    onClick={() => handleDeleteWard(ward.id)}
                    title="Delete Ward"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>

                <div className="progress-container" style={{ marginTop: 0 }}>
                  <div className="progress-header">
                    <span>Bed Occupancy</span>
                    <span>{ward.occupiedBeds} / {ward.capacity} Beds</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className={`progress-bar-fill ${colorClass}`} style={{ width: `${percent}%` }} />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderTop: "1px solid var(--border-color)", paddingTop: 12 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Daily Rate:</span>
                  <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>${ward.dailyCharge.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Ward Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Ward</h3>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddWard} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Ward Number / Identifier</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. A-102, ICU-A"
                  value={newWard.wardNumber}
                  onChange={(e) => setNewWard({ ...newWard, wardNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ward Type</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. General, ICU, Semi-Private"
                  value={newWard.wardType}
                  onChange={(e) => setNewWard({ ...newWard, wardType: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Total Bed Capacity</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    placeholder="e.g. 10"
                    value={newWard.capacity}
                    onChange={(e) => setNewWard({ ...newWard, capacity: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Daily Charge ($)</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    placeholder="e.g. 150"
                    value={newWard.dailyCharge}
                    onChange={(e) => setNewWard({ ...newWard, dailyCharge: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Ward</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Wards;

