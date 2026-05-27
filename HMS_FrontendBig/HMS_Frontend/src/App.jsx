import { useState } from "react";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Wards from "./pages/Wards";
import Billing from "./pages/Billing";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
    ),
  },
  {
    id: "patients",
    label: "Patients",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    ),
  },
  {
    id: "doctors",
    label: "Doctors",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><circle cx="12" cy="12" r="10" /></svg>
    ),
  },
  {
    id: "wards",
    label: "Wards",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" /><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" /><path d="M12 4v6" /><path d="M2 20h20" /></svg>
    ),
  },
  {
    id: "billing",
    label: "Billing",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="8" x2="16" y1="10" y2="10" /><line x1="8" x2="12" y1="14" y2="14" /></svg>
    ),
  },
];

const PAGE_META = {
  dashboard: { title: "Dashboard", subtitle: "Hospital overview and key metrics" },
  patients: { title: "Patient Management", subtitle: "Admit, assign, and discharge patients" },
  doctors: { title: "Doctor Registry", subtitle: "Manage physicians and specializations" },
  wards: { title: "Ward Management", subtitle: "Monitor bed capacity and ward allocations" },
  billing: { title: "Billing & Invoices", subtitle: "Generate and track patient invoices" },
};

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const meta = PAGE_META[activeTab];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" /></svg>
          </div>
          <div>
            <div className="logo-text">MedManagePro</div>
            <div className="logo-subtitle">HMS Platform</div>
          </div>
        </div>

        <ul className="nav-links">
          {NAV_ITEMS.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-button ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="sidebar-status">
          <div className="status-label">System Status</div>
          <div className="status-indicator">
            <div className="status-dot" />
            <span style={{ color: "var(--accent-emerald)" }}>Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="top-header">
          <div className="header-title-container">
            <h1>{meta.title}</h1>
            <p>{meta.subtitle}</p>
          </div>
        </div>

        {activeTab === "dashboard" && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === "patients" && <Patients />}
        {activeTab === "doctors" && <Doctors />}
        {activeTab === "wards" && <Wards />}
        {activeTab === "billing" && <Billing />}
      </main>
    </div>
  );
}

export default App;