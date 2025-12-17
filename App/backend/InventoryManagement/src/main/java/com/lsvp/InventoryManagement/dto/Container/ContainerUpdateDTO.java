package com.lsvp.InventoryManagement.dto.Container;

import com.lsvp.InventoryManagement.enums.ContainerType;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "DTO para atualização dos Conteiners")
public class ContainerUpdateDTO {

    @Schema(description = "Código do Container", example = "CONT-ARZ01")
    @NotBlank
    private String code;

    @Schema(description = "Descrição do Container/Localização", example = "Container de Arroz 1 / Cozinha Principal")
    private String description; 

    @Schema(description = "Tipo do Container/Localização", example = "ESTOQUE")
    @NotNull(message = "Type is required")
    private ContainerType type; 

}
