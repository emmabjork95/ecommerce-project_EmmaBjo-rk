import axios from "axios";
import { ICustomer, INewCustomer } from "../types/ICustomer";

const API_URL = "http://localhost:3000";

export const getCustomers = async (): Promise<ICustomer[]> => {
  try {
  const response = await axios.get<ICustomer[]>(`${API_URL}/customers`);
  return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createCustomer = async (payload: INewCustomer): Promise<ICustomer> => {
  try {
    const response = await axios.post(`${API_URL}/customers`, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateCustomer = async (id: number, payload: Partial<ICustomer>): Promise<ICustomer> => {
  try {
    const response = await axios.patch(`${API_URL}/customers/${id}`, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error
  }
};

export const deleteCustomer = async (id: number): Promise<void> => {
  try {
  await axios.delete(`${API_URL}/customers/${id}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCustomerById = async (id: number): Promise<ICustomer> => {
  try {
    const response = await axios.get(`${API_URL}/customers/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCustomerByEmail = async (email: string): Promise<ICustomer | null> => {
  try {
    const response = await axios.get(`http://localhost:3000/customers/email/${email}`);
    return response.data; 
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};
  