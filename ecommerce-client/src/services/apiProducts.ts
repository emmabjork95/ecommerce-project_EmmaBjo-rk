import axios from "axios";
import { INewProduct, IProduct } from "../types/IProduct";

const API_URL = "http://localhost:3000/products"; 

export const getProducts = async (): Promise<IProduct[]> => {
  try {
    const response = await axios.get<IProduct[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getProductById = async (id: number): Promise<IProduct> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createProduct = async (payload: INewProduct): Promise<IProduct> => {
  try {
    const response = await axios.post(`${API_URL}`, payload);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateProduct = async (id: number, payload: Partial<IProduct>): Promise<IProduct> => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
