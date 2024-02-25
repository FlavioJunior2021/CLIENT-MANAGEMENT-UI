import axios from "axios";
const dbUrl = import.meta.env.VITE_DATABASE_URL;

export const api = axios.create({
	baseURL: dbUrl,
});