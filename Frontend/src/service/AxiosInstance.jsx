import axios from 'axios';

const asiosInstance = axios.create({
    baseURL:"https://virtualassistant-t395.onrender.com/api",
    withCredentials: true,
})

export default asiosInstance;