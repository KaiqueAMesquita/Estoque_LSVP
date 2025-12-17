export interface Product {
    id?: number;
    gtin: string;
    measure: number;
    measure_type: string;
    description: string;
    category_id: number;
    createdAt?: Date;
    updatedAt?: Date;
  
}
  