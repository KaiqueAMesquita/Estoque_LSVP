export interface Fulfillment{
    orderItemId: number;
    unitId: number;
    quantity: number;

}
export interface FulfillRequest{
    fulfillments: Fulfillment[];
    destination: string;
    userId: number;
}



