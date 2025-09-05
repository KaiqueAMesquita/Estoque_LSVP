export interface Product {
    id?: number;
    gtin: string;
    measure: number;
    measureType: string;
    description: string;
    categoryId: number;
    createdAt?: Date;
    updatedAt?: Date;
  
}