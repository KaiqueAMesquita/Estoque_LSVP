export interface Order {
    id?: number;
    requesterName: string;
    date: string; 
    status: string;
    userName?: string;
    items: OrderItem[];

}




export interface OrderItem {
    id: number;
    categoryId: number;
    categoryName: string;
    quantityRequested: number;
    quantityFulfilled: number;
   
   
}

