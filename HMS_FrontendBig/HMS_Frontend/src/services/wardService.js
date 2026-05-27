import axios from "axios";
import BASE_URL from "./api";

const API = `${BASE_URL}/wards`;

export async function getWards() {
  return axios.get(API);
}

export async function addWard(ward) {
  return axios.post(API, ward);
}

export async function deleteWard(id) {
  return axios.delete(`${API}/${id}`);
}

export async function updateWard(id, ward) {
  return axios.put(`${API}/${id}`, ward);
}
