import { useEffect, useState } from "react";
import { getBills, addBill, deleteBill } from "../services/billService";
import { getPatients } from "../services/patientService";

function Billing() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [receiptBill, setReceiptBill] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newBill, setNewBill] = useState({
    patientId: "",
    consultationFee: "",
    medicationCost: "",
    wardCharges: "",
    daysAdmitted: "",
    description: "",
  });

  async function loadData() {
    try {
      const [billsRes, patientsRes] = await Promise.all([
        getBills(),
        getPatients(),
      ]);
      setBills(billsRes.data);
      setPatients(patientsRes.data);
    } catch (error) {
      console.error("Error loading billing data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const liveTotal =
    (parseFloat(newBill.consultationFee) || 0) +
    (parseFloat(newBill.medicationCost) || 0) +
    (parseFloat(newBill.wardCharges) || 0) * (parseInt(newBill.daysAdmitted) || 0);

  async function handleAddBill(e) {
    e.preventDefault();
    try {
      await addBill({
        patientId: Number(newBill.patientId),
        consultationFee: parseFloat(newBill.consultationFee) || 0,
        medicationCost: parseFloat(newBill.medicationCost) || 0,
        wardCharges: parseFloat(newBill.wardCharges) || 0,
        daysAdmitted: parseInt(newBill.daysAdmitted) || 0,
        description: newBill.description,
      });
      setNewBill({ patientId: "", consultationFee: "", medicationCost: "", wardCharges: "", daysAdmitted: "", description: "" });
      setIsAddModalOpen(false);
      loadData();
    } catch (error) {
      alert("Failed to create invoice.");
      console.error(error);
    }
  }

  async function handleDeleteBill(id) {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteBill(id);
        loadData();
      } catch (error) {
        alert("Failed to delete invoice.");
        console.error(error);
      }
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="tab-content" style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Top Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ backgroundColor: "rgba(59,130,246,0.1)", color: "var(--accent-blue)", padding: "8px 16px", borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 700 }}>
            {bills.length} Invoice{bills.length !== 1 ? "s" : ""}
          </div>
          <div style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "var(--accent-emerald)", padding: "8px 16px", borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 700 }}>
            Total: ${bills.reduce((sum, b) => sum + (b.totalAmount || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Invoice
        </button>
      </div>

      {/* Bills Table / List */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
          <div style={{ border: "4px solid rgba(255,255,255,0.1)", borderTop: "4px solid var(--accent-indigo)", borderRadius: "50%", width: 30, height: 30, animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : bills.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
          <p style={{ color: "var(--text-secondary)" }}>No invoices created yet.</p>
        </div>
      ) : (
        <div className="dashboard-panel" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Patient</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Days</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, index) => (
                <tr key={bill.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background 0.15s ease" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 600, color: "white" }}>{bill.patientName || `Patient #${bill.patientId}`}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: "var(--text-secondary)" }}>{bill.description || "—"}</span>
                  </td>
                  <td style={tdStyle}>{bill.daysAdmitted}</td>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 700, color: "var(--accent-emerald)" }}>
                      ${(bill.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{formatDate(bill.billDate)}</span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: "4px 10px", fontSize: 12 }}
                        onClick={() => setReceiptBill(bill)}
                        title="View Receipt"
                      >
                        Receipt
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: "4px 8px" }}
                        onClick={() => handleDeleteBill(bill.id)}
                        title="Delete Invoice"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Invoice Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <h3>Create New Invoice</h3>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddBill} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              <div className="form-group">
                <label className="form-label">Patient</label>
                <select
                  required
                  className="form-input"
                  value={newBill.patientId}
                  onChange={(e) => setNewBill({ ...newBill, patientId: e.target.value })}
                >
                  <option value="" disabled>Select a patient...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Consultation Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="0.00"
                    value={newBill.consultationFee}
                    onChange={(e) => setNewBill({ ...newBill, consultationFee: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Medication Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="0.00"
                    value={newBill.medicationCost}
                    onChange={(e) => setNewBill({ ...newBill, medicationCost: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Ward Charge per Day ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="0.00"
                    value={newBill.wardCharges}
                    onChange={(e) => setNewBill({ ...newBill, wardCharges: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Days Admitted</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0"
                    value={newBill.daysAdmitted}
                    onChange={(e) => setNewBill({ ...newBill, daysAdmitted: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Notes</label>
                <textarea
                  className="form-input"
                  placeholder="e.g. Surgery charges, consultation follow-up..."
                  value={newBill.description}
                  onChange={(e) => setNewBill({ ...newBill, description: e.target.value })}
                  style={{ minHeight: 70, resize: "vertical" }}
                />
              </div>

              {/* Live Total Preview */}
              <div style={{
                backgroundColor: "rgba(16,185,129,0.06)",
                border: "1px solid rgba(16,185,129,0.15)",
                borderRadius: "var(--radius-md)",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Estimated Total</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    consultation + medication + (ward × days)
                  </div>
                </div>
                <span style={{ fontSize: 28, fontWeight: 800, color: "var(--accent-emerald)" }}>
                  ${liveTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Viewer Modal */}
      {receiptBill && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h3>Invoice Receipt</h3>
              <button className="modal-close" onClick={() => setReceiptBill(null)}>&times;</button>
            </div>

            <div id="receipt-body" style={{
              backgroundColor: "var(--bg-tertiary)",
              borderRadius: "var(--radius-md)",
              padding: 24,
              border: "1px solid var(--border-color)",
            }}>
              {/* Receipt Header */}
              <div style={{ textAlign: "center", borderBottom: "1px dashed var(--border-color)", paddingBottom: 16, marginBottom: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" }}>Hospital Management System</h2>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>Tax Invoice / Receipt</p>
              </div>

              {/* Receipt Details */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontSize: 13 }}>
                <div>
                  <div style={{ color: "var(--text-secondary)" }}>Invoice #</div>
                  <div style={{ fontWeight: 700, color: "white" }}>{receiptBill.id}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "var(--text-secondary)" }}>Date</div>
                  <div style={{ fontWeight: 700, color: "white" }}>{formatDate(receiptBill.billDate)}</div>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Billed To</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "white" }}>{receiptBill.patientName || `Patient #${receiptBill.patientId}`}</div>
              </div>

              {/* Line Items */}
              <div style={{ borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", padding: "12px 0" }}>
                <div style={receiptRow}><span>Consultation Fee</span><span>${(receiptBill.consultationFee || 0).toFixed(2)}</span></div>
                <div style={receiptRow}><span>Medication Cost</span><span>${(receiptBill.medicationCost || 0).toFixed(2)}</span></div>
                <div style={receiptRow}><span>Ward Charges (per day)</span><span>${(receiptBill.wardCharges || 0).toFixed(2)}</span></div>
                <div style={receiptRow}><span>Days Admitted</span><span>{receiptBill.daysAdmitted || 0}</span></div>
                {receiptBill.description && (
                  <div style={{ ...receiptRow, marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
                    <span>Note: {receiptBill.description}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>TOTAL</span>
                <span style={{ fontSize: 24, fontWeight: 800, color: "var(--accent-emerald)" }}>
                  ${(receiptBill.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setReceiptBill(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: 12,
  fontWeight: 700,
  color: "var(--text-secondary)",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const tdStyle = {
  padding: "14px 16px",
  color: "var(--text-primary)",
};

const receiptRow = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 14,
  padding: "6px 0",
  color: "var(--text-primary)",
};

export default Billing;


