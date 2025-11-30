import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

// TODO: aquí después agregamos interceptores para JWT

export default api;
