import { useEffect, useState } from "react";
import { getPatients, addPatient, deletePatient } from "../services/patientService";
import { getDoctors } from "../services/doctorService";
import { getWards } from "../services/wardService";
import { assignDoctor, assignWard, dischargePatient } from "../services/assignmentService";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [wards, setWards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activePatientForAssign, setActivePatientForAssign] = useState(null); // Patient currently being edited/assigned
  
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    address: "",
    medicalHistory: "",
  });

  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const [patientsRes, doctorsRes, wardsRes] = await Promise.all([
        getPatients(),
        getDoctors(),
        getWards(),
      ]);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
      setWards(wardsRes.data);
    } catch (error) {
      console.error("Error loading patient page data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAddPatient(e) {
    e.preventDefault();
    try {
      await addPatient({
        ...newPatient,
        age: Number(newPatient.age)
      });
      setNewPatient({ name: "", age: "", gender: "", contact: "", address: "", medicalHistory: "" });
      setIsAddModalOpen(false);
      loadData();
    } catch (error) {
      alert("Failed to add patient.");
      console.error(error);
    }
  }

  async function handleDeletePatient(id) {
    if (window.confirm("Are you sure you want to delete this patient record?")) {
      try {
        await deletePatient(id);
        loadData();
      } catch (error) {
        alert("Failed to delete patient.");
        console.error(error);
      }
    }
  }

  async function handleAssignDoctor(patientId, doctorId) {
    if (!doctorId) return;
    try {
      await assignDoctor(patientId, doctorId);
      loadData();
      setActivePatientForAssign(null);
    } catch (error) {
      alert("Failed to assign doctor.");
      console.error(error);
    }
  }

  async function handleAssignWard(patientId, wardId) {
    if (!wardId) return;
    try {
      await assignWard(patientId, wardId);
      loadData();
      setActivePatientForAssign(null);
    } catch (error) {
      alert("Failed to assign ward. Make sure ward is not full.");
      console.error(error);
    }
  }

  async function handleDischarge(patientId) {
    if (window.confirm("Are you sure you want to discharge this patient? This will release their occupied bed.")) {
      try {
        await dischargePatient(patientId);
        loadData();
        setActivePatientForAssign(null);
      } catch (error) {
        alert("Failed to discharge patient.");
        console.error(error);
      }
    }
  }

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.medicalHistory && p.medicalHistory.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="tab-content" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      
      {/* Top Header Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div className="form-group" style={{ margin: 0, width: "100%", maxWidth: 360 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search patients by name or history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Admit Patient
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
          <div style={{ border: "4px solid rgba(255,255,255,0.1)", borderTop: "4px solid var(--accent-indigo)", borderRadius: "50%", width: 30, height: 30, animation: "spin 1s linear infinite" }} />
        </div>
      ) : filteredPatients.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
          <p style={{ color: "var(--text-secondary)" }}>No patients found.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {filteredPatients.map(patient => (
            <div key={patient.id} className="stat-card" style={{ flexDirection: "column", alignItems: "stretch", gap: 12, padding: 24, height: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "white" }}>{patient.name}</h3>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {patient.gender} · {patient.age} years old
                  </span>
                </div>
                <button 
                  className="btn btn-danger" 
                  style={{ padding: 6, borderRadius: "var(--radius-sm)" }}
                  onClick={() => handleDeletePatient(patient.id)}
                  title="Delete Patient Record"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>

              <div style={{ borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", padding: "12px 0", display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                <div><strong style={{ color: "var(--text-secondary)" }}>Contact:</strong> {patient.contact || "N/A"}</div>
                <div><strong style={{ color: "var(--text-secondary)" }}>Address:</strong> {patient.address || "N/A"}</div>
                <div><strong style={{ color: "var(--text-secondary)" }}>Medical History:</strong> {patient.medicalHistory || "None recorded"}</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Assigned Doctor:</span>
                  <span className={`activity-badge ${patient.assignedDoctorName ? "badge-indigo" : ""}`} style={{ fontSize: 12, fontWeight: 600 }}>
                    {patient.assignedDoctorName || "None Assigned"}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Assigned Ward:</span>
                  <span className={`activity-badge ${patient.assignedWardNumber ? "badge-emerald" : ""}`} style={{ fontSize: 12, fontWeight: 600 }}>
                    {patient.assignedWardNumber ? `Ward ${patient.assignedWardNumber}` : "None Assigned"}
                  </span>
                </div>
              </div>

              {/* Assignment Action triggers */}
              <div style={{ marginTop: "auto", paddingTop: 12, display: "flex", gap: 8 }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ width: "100%", justifyContent: "center", padding: "8px 12px", fontSize: 13 }}
                  onClick={() => setActivePatientForAssign(patient)}
                >
                  Manage Assignments
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Patient Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Admit New Patient</h3>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddPatient} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    placeholder="e.g. 28"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Male, Female, Other"
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Info</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. +1 555-0199"
                  value={newPatient.contact}
                  onChange={(e) => setNewPatient({ ...newPatient, contact: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 123 Main St, New York"
                  value={newPatient.address}
                  onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Medical History / Symptoms</label>
                <textarea
                  className="form-input"
                  placeholder="e.g. Flu symptoms, diabetes history, etc."
                  value={newPatient.medicalHistory}
                  onChange={(e) => setNewPatient({ ...newPatient, medicalHistory: e.target.value })}
                  style={{ minHeight: 80, resize: "vertical" }}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Admit Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment / Discharge Modal */}
      {activePatientForAssign && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Manage Patient: {activePatientForAssign.name}</h3>
              <button className="modal-close" onClick={() => setActivePatientForAssign(null)}>&times;</button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              
              {/* Doctor Assignment Section */}
              <div style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", padding: 16, borderRadius: "var(--radius-md)" }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: "var(--accent-indigo)" }}>Assign Doctor</h4>
                <div style={{ display: "flex", gap: 8 }}>
                  <select 
                    className="form-input"
                    style={{ flexGrow: 1 }}
                    onChange={(e) => handleAssignDoctor(activePatientForAssign.id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Select a Doctor...</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ward Assignment Section */}
              <div style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", padding: 16, borderRadius: "var(--radius-md)" }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: "var(--accent-emerald)" }}>Assign Ward Bed</h4>
                <div style={{ display: "flex", gap: 8 }}>
                  <select 
                    className="form-input"
                    style={{ flexGrow: 1 }}
                    onChange={(e) => handleAssignWard(activePatientForAssign.id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Select a Ward...</option>
                    {wards.map(w => (
                      <option key={w.id} value={w.id} disabled={w.occupiedBeds >= w.capacity}>
                        Ward {w.wardNumber} ({w.wardType}) · {w.occupiedBeds}/{w.capacity} Beds
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Discharge Section */}
              {(activePatientForAssign.assignedDoctorName || activePatientForAssign.assignedWardNumber) && (
                <div style={{ backgroundColor: "rgba(244,63,94,0.03)", border: "1px solid rgba(244,63,94,0.1)", padding: 16, borderRadius: "var(--radius-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-rose)" }}>Discharge Patient</h4>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>Removes doctor and releases ward bed.</p>
                  </div>
                  <button className="btn btn-danger" onClick={() => handleDischarge(activePatientForAssign.id)}>
                    Discharge
                  </button>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setActivePatientForAssign(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Patients;

