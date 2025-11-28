
export interface OrderRequest{
    requesterName: string;
    userId: number;
    items: OrderItemRequest[]
}

export interface OrderItemRequest{
    categoryId: number
    quantityRequested: number;
}
