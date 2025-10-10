export interface Unit {
    id: number;
    batch: string;
    measure: number;
    quantity: number;
    expirationDate: Date;
    price?: number;
    gtin: string;
}