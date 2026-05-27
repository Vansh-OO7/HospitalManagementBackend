function PatientCard({ patient, onDelete }) {

    return (
  
      <div className="patient-card">
  
        <h2>{patient.name}</h2>
  
        <p><strong>Age:</strong> {patient.age}</p>
  
        <p><strong>Gender:</strong> {patient.gender}</p>
  
        <p><strong>Contact:</strong> {patient.contact}</p>
  
        <p><strong>Address:</strong> {patient.address}</p>
  
        <p>
          <strong>Medical History:</strong>
          {" "}
          {patient.medicalHistory}
        </p>
  
        <p>
          <strong>Doctor:</strong>
          {" "}
          {patient.assignedDoctorName || "Not Assigned"}
        </p>
  
        <p>
          <strong>Ward:</strong>
          {" "}
          {patient.assignedWardNumber || "Not Assigned"}
        </p>
  
        <button
          onClick={() => onDelete(patient.id)}
        >
          Delete
        </button>
  
      </div>
    );
  }
  
  export default PatientCard;