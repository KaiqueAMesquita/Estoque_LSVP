package com.lsvp.InventoryManagement.dto.OrderItem;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderItemCreateDTO {

    @NotNull 
    private Long productId;

    @Min(1)
    private int quantityRequested;

    
}
