import axios from "axios";
import BASE_URL from "./api";

const API = `${BASE_URL}/dashboard`;

export async function getDashboardStats() {
  return axios.get(`${API}/stats`);
}
