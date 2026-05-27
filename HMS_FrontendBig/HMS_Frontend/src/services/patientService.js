import axios from "axios";
import BASE_URL from "./api";

const API = `${BASE_URL}/patients`;

export async function getPatients() {
  return axios.get(API);
}

export async function addPatient(patient) {
  return axios.post(API, patient);
}

export async function deletePatient(id) {
  return axios.delete(`${API}/${id}`);
}

export async function updatePatient(id, patient) {
  return axios.put(`${API}/${id}`, patient);
}