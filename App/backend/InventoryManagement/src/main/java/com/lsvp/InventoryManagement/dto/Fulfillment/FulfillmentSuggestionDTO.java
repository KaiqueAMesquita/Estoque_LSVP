package com.lsvp.InventoryManagement.dto.Fulfillment;

import java.util.List;

import lombok.Data;

@Data
public class FulfillmentSuggestionDTO {

    private Long orderItemId;       // ID do item do pedido
    

    private Long categoryId;         
    
    private String categoryName;     
    private int quantityRequested;  
    private int quantityFulfilled;  
    private int quantityNeededNow;  
    private boolean sufficientStock; 
    
    private List<SuggestedUnitDTO> suggestedUnits;

}
