package com.lsvp.InventoryManagement.dto.Movement;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ConsumptionCreateDTO {

    @NotNull(message = "O ID da unidade é obrigatório")
    private Long unitId; // A unidade que está na cozinha e sendo consumida

    @Min(value = 1, message = "A quantidade consumida deve ser no mínimo 1")
    private int quantityConsumed;

    @NotNull(message = "O ID do usuário é obrigatório")
    private Long userId;

    
}
