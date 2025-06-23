package com.lsvp.InventoryManagement.dto.Container;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "DTO para atualização dos Conteiners")
public class ContainerUpdateDTO {

    @Schema(description = "Código do Container", example = "CONT-ARZ01")
    @NotBlank
    private String code;

}
