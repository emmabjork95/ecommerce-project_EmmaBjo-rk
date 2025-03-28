
import { IProduct } from "../types/IProduct";

export class ICartItem {
  constructor(
    public product: IProduct, 
    public quantity: number
  ) {}
}
