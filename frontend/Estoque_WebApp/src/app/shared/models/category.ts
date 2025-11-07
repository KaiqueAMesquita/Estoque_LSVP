export interface Category {
    id?: number;
    description: string;
    created_at?: Date;
    updated_at?: Date;
    foodType: number;
    min_quantity: number;
    max_quantity: number;
}
export enum FoodType {
    PERECIVEL,
    NAO_PERECIVEL
}