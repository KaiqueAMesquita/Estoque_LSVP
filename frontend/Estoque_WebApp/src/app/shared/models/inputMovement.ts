export interface InputMovement{
    productId: number;
    batch: string;
    quantity: number;
    containerId: number;
    sourceType: string;
    sourceDetails: string;
    expiration_date: Date;
    price: number;
    userId: number;
}