export interface SuggestedUnit{
    unitId: number;
    batch: string;
    expirationDate: string;
    quantityToTake: number;
    availableInUnit: number;
    containerCode: string;
    specificProductName: string | null;
}

export interface FulfillSuggestion{
    orderItemId: number;
    categoryId: number;
    categoryName: string;
    quantityRequested: number;
    quantityFulfilled: number;
    quantityNeededNow: number;
    sufficientStock: boolean;
    suggestedUnits: SuggestedUnit[];

}

