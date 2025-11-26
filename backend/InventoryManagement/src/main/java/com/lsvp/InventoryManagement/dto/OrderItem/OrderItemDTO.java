package com.lsvp.InventoryManagement.dto.OrderItem;

import lombok.Data;

@Data
public class OrderItemDTO {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private int quantityRequested;
    private int quantityFulfilled;
}
