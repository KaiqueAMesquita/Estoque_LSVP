export interface ExpiringBatchs{
  unitId: number;
  unitCode: string;
  batch: string;
  productId: number;
  productName: string;
  productGtin: string;
  containerCode: string;
  quantity: number;
  expirationDate: Date;  
  daysUntilExpiry: number;
}

   