package com.lsvp.InventoryManagement.dto.Movement;

import com.lsvp.InventoryManagement.enums.AdjustmentReason;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StockAdjustmentDTO {

    @NotNull(message = "O ID da unidade é obrigatório")
    private Long unitId;

    @Min(value = 1, message = "A quantidade deve ser no mínimo 1")
    private int quantity;

    @NotNull(message = "O motivo do ajuste é obrigatório")
    private AdjustmentReason reason;

    private String observation; // Opcional

    @NotNull(message = "O ID do usuário é obrigatório")
    private Long userId;


}
