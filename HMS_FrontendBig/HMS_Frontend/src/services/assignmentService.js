import axios from "axios";
import BASE_URL from "./api";

const API = `${BASE_URL}/assignments`;

export async function assignDoctor(patientId, doctorId) {
  return axios.post(`${API}/assign-doctor?patientId=${patientId}&doctorId=${doctorId}`);
}

export async function assignWard(patientId, wardId) {
  return axios.post(`${API}/assign-ward?patientId=${patientId}&wardId=${wardId}`);
}

export async function dischargePatient(patientId) {
  return axios.post(`${API}/discharge?patientId=${patientId}`);
}
