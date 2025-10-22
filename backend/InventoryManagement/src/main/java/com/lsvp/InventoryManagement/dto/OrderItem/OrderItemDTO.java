package com.lsvp.InventoryManagement.dto.OrderItem;

import lombok.Data;

@Data
public class OrderItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productGtin;
    private int quantityRequested;
    private int quantityFulfilled;
}
