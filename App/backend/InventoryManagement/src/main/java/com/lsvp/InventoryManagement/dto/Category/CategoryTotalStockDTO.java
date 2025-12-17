package com.lsvp.InventoryManagement.dto.Category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryTotalStockDTO {
    
    private long categoryId;
    private long totalQuantity;

}
