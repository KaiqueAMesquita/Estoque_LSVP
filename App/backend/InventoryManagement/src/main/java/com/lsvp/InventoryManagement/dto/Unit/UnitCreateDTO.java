package com.lsvp.InventoryManagement.dto.Unit;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lsvp.InventoryManagement.entity.Container;
import com.lsvp.InventoryManagement.entity.Product;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "DTO para criação da unidade")
public class UnitCreateDTO {

    @Schema(description = "Número de lote da unidade", example = "MG7281019A; MG7281019A/1")
    @NotBlank(message = "Batch is required")
    private String batch;

    @Schema(description = "Data de validade da Unidade", example = "21/02/2027")
    @JsonFormat(pattern = "dd/MM/yyyy") 
    private LocalDate expiration_date;

    @Schema(description = "Quantidade da Unidade")
    @NotNull(message = "Quantity is required")
    private int quantity;

    @Schema(description = "Preço da Unidade")
    @NotNull(message = "Price is required")
    private int price;

    @Schema(description = "Id do Container da Unidade", example = "1")
    @NotNull(message = "Unit needs to be on a Container")
    private Long containerId;

    @Schema(description = "Id do Produto da Unidade", example = "1")
    @NotNull(message = "Unit must belong to a Product")
    private Long productId;
}
