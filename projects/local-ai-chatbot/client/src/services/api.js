import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getChats = async () => {
  const response = await API.get("/chats");
  return response.data;
};

export const createChat = async () => {
  const response = await API.post("/chats");
  return response.data;
};

export const getChat = async (id) => {
  const response = await API.get(`/chats/${id}`);
  return response.data;
};

export const sendMessage = async (id, message) => {
  const response = await API.post(`/chats/${id}/message`, { message });

  return response.data;
};

export default API;
