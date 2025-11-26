import { OrderItem } from "./order";

export interface OrderRequest{
    requesterName: string;
    userId: number;
    items: orderItemRequest[]
}

export interface orderItemRequest{
    productId: number
    quantityRequested: number;
}
