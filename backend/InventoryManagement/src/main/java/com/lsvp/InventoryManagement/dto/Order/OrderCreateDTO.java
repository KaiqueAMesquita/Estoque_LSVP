package com.lsvp.InventoryManagement.dto.Order;

import java.util.List;

import com.lsvp.InventoryManagement.dto.OrderItem.OrderItemCreateDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderCreateDTO {

    @NotBlank
    private String requesterName;

    @NotNull
    private Long userId;    

    @NotEmpty
    private List<OrderItemCreateDTO> items;

}
