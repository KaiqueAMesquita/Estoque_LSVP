export interface Order {
    id: number;
    requesterName: string;
    date: string; 
    status: string;
    userName: string;
    items: OrderItem[];

}

export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    productGtin: string;
    quantityRequested: number;
    quantityFulfilled: number;
   
   
}

