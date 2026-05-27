import axios from "axios";
import BASE_URL from "./api";

const API = `${BASE_URL}/bills`;

export async function getBills() {
  return axios.get(API);
}

export async function addBill(bill) {
  return axios.post(API, bill);
}

export async function deleteBill(id) {
  return axios.delete(`${API}/${id}`);
}

export async function updateBill(id, bill) {
  return axios.put(`${API}/${id}`, bill);
}
