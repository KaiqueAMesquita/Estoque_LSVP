export interface ExpiredUnit{
    id?: number;
    code: string;
    batch: string;
    expiration_date: Date;
    quantity: number;
    price?: number;
    containerCode?: string;
    containerId?: number;
    description?: string;
    gtin?: string;
}


