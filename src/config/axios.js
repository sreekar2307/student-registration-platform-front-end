import axios from "axios";
import constants from "./app";

const api = axios.create({
    baseURL: constants["baseURL"],
    timeout: 1000,
});

export default api

