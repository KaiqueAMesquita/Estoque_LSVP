package com.lsvp.InventoryManagement.dto.Order;

import java.time.LocalDateTime;
import java.util.List;

import com.lsvp.InventoryManagement.dto.OrderItem.OrderItemDTO;
import com.lsvp.InventoryManagement.enums.OrderStatus;

public class OrderDTO {

    private Long id;
    private String requesterName;
    private LocalDateTime dade;
    private OrderStatus status;
    private String userName;
    private List<OrderItemDTO> items;

}
