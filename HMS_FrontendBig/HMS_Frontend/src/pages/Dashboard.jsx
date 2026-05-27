import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import { getPatients } from "../services/patientService";
import { getWards } from "../services/wardService";

function Dashboard({ setActiveTab }) {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalWards: 0,
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    totalRevenue: 0,
  });
  const [patients, setPatients] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsRes, patientsRes, wardsRes] = await Promise.all([
          getDashboardStats(),
          getPatients(),
          getWards(),
        ]);
        setStats(statsRes.data);
        // Take recent 5 patients
        setPatients(patientsRes.data.slice(-5).reverse());
        setWards(wardsRes.data);
      } catch (error) {
        console.error("Failed to load dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
        <div style={{ border: "4px solid rgba(255,255,255,0.1)", borderTop: "4px solid var(--accent-indigo)", borderRadius: "50%", width: 40, height: 40, animation: "spin 1s linear infinite" }} />
        <span style={{ marginLeft: 16, color: "var(--text-secondary)" }}>Loading stats...</span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const occupancyRate = stats.totalBeds > 0 ? Math.round((stats.occupiedBeds / stats.totalBeds) * 100) : 0;

  return (
    <div className="tab-content">
      {/* Stat Grid */}
      <div className="stats-grid">
        <div className="stat-card indigo">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Patients</span>
            <span className="stat-value">{stats.totalPatients}</span>
          </div>
        </div>

        <div className="stat-card emerald">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="8" x="3" y="3" rx="2"/><rect width="8" height="8" x="13" y="3" rx="2"/><rect width="8" height="8" x="3" y="13" rx="2"/><path d="M16 19h6"/><path d="M19 16v6"/></svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Doctors</span>
            <span className="stat-value">{stats.totalDoctors}</span>
          </div>
        </div>

        <div className="stat-card amber">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M2 8h20"/><path d="M12 2v6"/><circle cx="12" cy="14" r="4"/></svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Occupied Beds</span>
            <span className="stat-value">{stats.occupiedBeds} <span style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 500 }}>/ {stats.totalBeds}</span></span>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Side: Recent Patient Feed & Ward Breakdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="dashboard-panel">
            <div className="panel-header">
              <h2>Recent Admissions</h2>
              <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => setActiveTab("patients")}>View All</button>
            </div>
            {patients.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "20px 0" }}>No patients admitted yet.</p>
            ) : (
              <div className="activity-list">
                {patients.map(patient => (
                  <div key={patient.id} className="activity-item">
                    <div className="activity-info">
                      <div className="activity-avatar">{patient.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="activity-name">{patient.name}</div>
                        <div className="activity-meta">{patient.gender}, {patient.age} years old · Contact: {patient.contact || "N/A"}</div>
                      </div>
                    </div>
                    <span className={`activity-badge ${patient.assignedWardNumber ? "badge-emerald" : "badge-indigo"}`}>
                      {patient.assignedWardNumber ? `Ward ${patient.assignedWardNumber}` : "Outpatient"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-panel">
            <div className="panel-header">
              <h2>Ward Capacity Breakdown</h2>
              <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => setActiveTab("wards")}>Manage Wards</button>
            </div>
            {wards.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "20px 0" }}>No wards configured yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {wards.map(ward => {
                  const percent = ward.capacity > 0 ? Math.round((ward.occupiedBeds / ward.capacity) * 100) : 0;
                  let colorClass = "indigo";
                  if (percent >= 80) colorClass = "amber";
                  if (percent >= 100) colorClass = "rose";
                  return (
                    <div key={ward.id} className="progress-container">
                      <div className="progress-header">
                        <span>Ward {ward.wardNumber} ({ward.wardType})</span>
                        <span>{ward.occupiedBeds} / {ward.capacity} Beds ({percent}%)</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className={`progress-bar-fill ${colorClass}`} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Quick Action & Health Overview */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="dashboard-panel" style={{ background: "linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Overall Bed Occupancy</h2>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 0" }}>
              <div style={{ position: "relative", width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Circular ring meter */}
                <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="70" cy="70" r="58" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                  <circle cx="70" cy="70" r="58" fill="transparent" stroke="var(--accent-indigo)" strokeWidth="12" 
                    strokeDasharray={2 * Math.PI * 58} 
                    strokeDashoffset={2 * Math.PI * 58 * (1 - occupancyRate / 100)} 
                    strokeLinecap="round" 
                    style={{ transition: "stroke-dashoffset 0.8s ease" }}
                  />
                </svg>
                <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: 32, fontWeight: 800, color: "white" }}>{occupancyRate}%</span>
                  <span style={{ fontSize: 11, color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 700 }}>Occupancy</span>
                </div>
              </div>
              <div style={{ display: "flex", width: "100%", justifyContent: "space-between", marginTop: 24, padding: "0 10px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Available</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "var(--accent-emerald)" }}>{stats.availableBeds}</span>
                </div>
                <div style={{ width: 1, backgroundColor: "var(--border-color)" }} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Occupied</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "var(--accent-amber)" }}>{stats.occupiedBeds}</span>
                </div>
                <div style={{ width: 1, backgroundColor: "var(--border-color)" }} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Total Capacity</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "white" }}>{stats.totalBeds}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-panel">
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Quick Operations</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setActiveTab("patients")}>
                Admit New Patient
              </button>
              <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setActiveTab("billing")}>
                Create New Bill
              </button>
              <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setActiveTab("doctors")}>
                Register a Doctor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
