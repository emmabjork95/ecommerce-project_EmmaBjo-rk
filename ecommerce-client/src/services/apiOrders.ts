
import axios from "axios";
import { IOrder } from "../types/IOrder";

const API_URL = "http://localhost:3000/orders";
const API_URL_Item = "http://localhost:3000/order-items";


export const getPaymentById = async (id: string): Promise<IOrder[]>=> {
  try {
    const response = await axios.get<IOrder[]>(`${API_URL}/payment/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getOrders = async (): Promise<IOrder[]> => {
  try {
  const response = await axios.get<IOrder[]>(API_URL);
  return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getOrderById = async (id: number): Promise<IOrder> => {
  try {
  const response = await axios.get<IOrder>(`${API_URL}/${id}`);
  return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateOrder = async (id: number, payload: Partial<IOrder>): Promise<IOrder> => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, payload);
    return response.data;
    } catch (error) {
      console.log(error);
      throw error;
  }
};

export const updateOrderStatus = async (id: number, payload: {order_status: string; payment_status: string}): Promise<IOrder> => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, payload);
    return response.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const deleteOrder = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.log(error);
      throw error;
  }
};

export const updateOrderItemQuantity = async (productId: number, payload: { quantity: number }): Promise<void> => {
  try {
    await axios.patch(`${API_URL_Item}/${productId}`, payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteOrderItem = async (orderItemId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL_Item}/${orderItemId}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createOrder = async (orderData: Omit<IOrder, 'id' | 'created_at'>): Promise<IOrder> => {
  try {
    const response = await axios.post<IOrder>(API_URL, orderData);
    return response.data;
  } catch (error) {
    console.error("Fel vid skapande av order:", error);
    throw error;
  }
};


