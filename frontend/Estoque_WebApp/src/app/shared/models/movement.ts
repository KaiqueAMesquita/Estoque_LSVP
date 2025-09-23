export interface Movement {
    productId: number;
    batch: string;
    type: 'Entrada' | 'Saída';
    quantity: number;
    containerId: number;
    sourceType: string;
    sourceDetails: string;
    expiration_date: Date;
    price: number;
    userId: number;
}
//Model