package com.lsvp.InventoryManagement.dto.Fulfillment;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FulfillmentItemDTO {

    @NotNull
    private Long orderItemId; // Item do pedido 

    @NotNull
    private Long unitId; // A unidade do estoque que ta sendo usada

    @Min(1)
    private int quantity; // A quantidade da unidade
}
