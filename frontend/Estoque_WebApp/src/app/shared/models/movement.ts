export interface Movement {
    id: number;
    quantity: number;
    type: 'Entrada' | 'Saída';
    origin: string;
    destiny: string;
    date: Date; 
    sourceType: string;
    sourceDetails: string;
    unitId?: number;
    unitProductGtin: string;
    unitBatch: string;
    userId?: number;
    userName: string;
    
}
