import { useEffect, useState } from "react";
import { getDoctors, addDoctor, deleteDoctor } from "../services/doctorService";
import { getPatients } from "../services/patientService";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialization: "",
    contact: "",
    email: "",
  });

  async function loadData() {
    try {
      const [doctorsRes, patientsRes] = await Promise.all([
        getDoctors(),
        getPatients(),
      ]);
      setDoctors(doctorsRes.data);
      setPatients(patientsRes.data);
    } catch (error) {
      console.error("Error loading doctor page data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAddDoctor(e) {
    e.preventDefault();
    try {
      await addDoctor(newDoctor);
      setNewDoctor({ name: "", specialization: "", contact: "", email: "" });
      setIsAddModalOpen(false);
      loadData();
    } catch (error) {
      alert("Failed to register doctor.");
      console.error(error);
    }
  }

  async function handleDeleteDoctor(id) {
    if (window.confirm("Are you sure you want to delete this doctor? Patients assigned to this doctor will be updated to outpatient/unassigned status.")) {
      try {
        await deleteDoctor(id);
        loadData();
      } catch (error) {
        alert("Failed to delete doctor.");
        console.error(error);
      }
    }
  }

  // Count patients assigned to each doctor
  function getDoctorPatientCount(doctorName) {
    if (!doctorName) return 0;
    return patients.filter(p => p.assignedDoctorName === doctorName).length;
  }

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="tab-content" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      
      {/* Top Header Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div className="form-group" style={{ margin: 0, width: "100%", maxWidth: 360 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search doctors by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Register Doctor
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
          <div style={{ border: "4px solid rgba(255,255,255,0.1)", borderTop: "4px solid var(--accent-indigo)", borderRadius: "50%", width: 30, height: 30, animation: "spin 1s linear infinite" }} />
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
          <p style={{ color: "var(--text-secondary)" }}>No doctors registered yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {filteredDoctors.map(doctor => {
            const patientCount = getDoctorPatientCount(doctor.name);
            return (
              <div key={doctor.id} className="stat-card" style={{ flexDirection: "column", alignItems: "stretch", gap: 16, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(59, 130, 246, 0.1))", color: "var(--accent-indigo)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, border: "1px solid var(--border-color)" }}>
                    {doctor.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "white" }}>{doctor.name}</h3>
                    <span className="activity-badge badge-indigo" style={{ fontSize: 11, padding: "2px 8px", marginTop: 4, display: "inline-block" }}>
                      {doctor.specialization}
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", padding: "12px 0", display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Email:</span>
                    <span style={{ color: "white" }}>{doctor.email || "N/A"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Contact:</span>
                    <span style={{ color: "white" }}>{doctor.contact || "N/A"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Active Patients:</span>
                    <span className={`activity-badge ${patientCount > 0 ? "badge-emerald" : "badge-indigo"}`} style={{ fontSize: 12, fontWeight: 700 }}>
                      {patientCount} patient{patientCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button 
                    className="btn btn-danger" 
                    style={{ width: "100%", justifyContent: "center", padding: "8px 12px", fontSize: 13 }}
                    onClick={() => handleDeleteDoctor(doctor.id)}
                  >
                    Remove Doctor
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Register Doctor Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Register New Doctor</h3>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddDoctor} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Doctor Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Dr. Sarah Jenkins"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Specialization</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Cardiology, Pediatrics"
                  value={newDoctor.specialization}
                  onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. +1 555-0144"
                  value={newDoctor.contact}
                  onChange={(e) => setNewDoctor({ ...newDoctor, contact: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="e.g. sjenkins@hospital.com"
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Register Doctor</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Doctors;
