package com.lsvp.InventoryManagement.dto.Fulfillment;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FulfillmentRequestDTO {
    
    @NotEmpty
        private List<FulfillmentItemDTO> fulfillments;

    @NotBlank
        private String destination;

    @NotNull
        private Long userId;

}
