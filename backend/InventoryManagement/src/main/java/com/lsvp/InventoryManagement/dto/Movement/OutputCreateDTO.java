package com.lsvp.InventoryManagement.dto.Movement;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OutputCreateDTO {

    @NotNull(message = "O ID da unidade é obrigatório")
    private Long unitId;

    @Min(1)
    private int quantity;

    @NotNull(message = "O ID do container de destino é obrigatório")
    private Long destinationContainerId;

    @NotNull(message = "O ID do usuário é obrigatório")
    private Long userId;

    private Long orderItemId;
}
