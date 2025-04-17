export interface ICustomer {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  street_address: string
  postal_code: string
  city: string
  country: string
  created_at?: string
}

export type INewCustomer = Omit<ICustomer, "id">;