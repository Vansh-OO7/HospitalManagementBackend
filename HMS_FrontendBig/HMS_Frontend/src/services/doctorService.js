import axios from "axios";
import BASE_URL from "./api";

const API = `${BASE_URL}/doctors`;

export async function getDoctors() {
  return axios.get(API);
}

export async function addDoctor(doctor) {
  return axios.post(API, doctor);
}

export async function deleteDoctor(id) {
  return axios.delete(`${API}/${id}`);
}

export async function updateDoctor(id, doctor) {
  return axios.put(`${API}/${id}`, doctor);
}
