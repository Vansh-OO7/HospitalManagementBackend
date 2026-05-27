import { useState } from "react";

function PatientForm({ onAdd }) {

  const [formData, setFormData] = useState({
    name: "",
    age: 0,
    gender: "",
    contact: "",
    address: "",
    medicalHistory: "",
  });

  function handleChange(event) {

    const { name, value } = event.target;
  
    setFormData({
      ...formData,
      [name]:
        name === "age"
          ? Number(value)
          : value,
    });
  }

  function handleSubmit(event) {

    event.preventDefault();

    onAdd(formData);

    setFormData({
      name: "",
      age: "",
      gender: "",
      contact: "",
      address: "",
      medicalHistory: "",
    });
  }

  return (

    <form
      className="patient-form"
      onSubmit={handleSubmit}
    >

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
      />

      <input
        type="text"
        name="gender"
        placeholder="Gender"
        value={formData.gender}
        onChange={handleChange}
      />

      <input
        type="text"
        name="contact"
        placeholder="Contact"
        value={formData.contact}
        onChange={handleChange}
      />

      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
      />

      <textarea
        name="medicalHistory"
        placeholder="Medical History"
        value={formData.medicalHistory}
        onChange={handleChange}
      />

      <button type="submit">
        Add Patient
      </button>

    </form>
  );
}

export default PatientForm;