package com.lsvp.InventoryManagement.dto.Movement;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TransferCreateDTO {

    @NotNull
    private Long unitId;

    @Min(1)
    private int quantity;

    @NotNull
    private Long destinyContainerId;

    @NotNull
    private Long userId;

}
