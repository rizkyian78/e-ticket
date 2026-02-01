import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});



export const fetchInquiry = async (id: string) => {
    const { data } = await api.get(`api/inquiry/${id}`);
    return data.dataValues;
  };

  export const submitTransaction = async (payload: unknown) => {
    const { data } = await api.post(`api/inquiry/transaction/pay`, payload);
    return data;
  };

  export const retrieveTransaction = async (id: string) => {
    const { data } = await api.get(`api/inquiry/transaction/${id}`);
    return data;
  };