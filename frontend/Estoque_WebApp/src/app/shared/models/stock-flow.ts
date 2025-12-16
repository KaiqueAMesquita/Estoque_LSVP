export interface StockFlow {
    categoryId: number;
    categoryDescription: string;
    year: number;
    month: number;
    totalQuantityIn: number;
    totalQuantityOut: number;
    netChange: number;
}

