package com.lsvp.InventoryManagement.dto.Container;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO para a criação dos containers")
public class ContainerCreateDTO {

    @Schema(description = "Código do Container", example = "CONT-ARZ01")
    @NotBlank(message = "Code is required")
    private String code;

}
