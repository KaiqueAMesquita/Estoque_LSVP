package com.lsvp.InventoryManagement.dto.Product;

import com.lsvp.InventoryManagement.entity.Category;
import com.lsvp.InventoryManagement.enums.MeasureType;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "DTO para criação do produto")
public class ProductCreateDTO {

    @Schema(description = "GTIN do Produto", example = "7896006717157")
    @NotBlank(message = "Gtin is required")
    private String gtin;

    @Schema(description = "Medida do Produto", example = "5")
    @NotNull(message = "Measure is required")
    private BigDecimal measure;

    @Schema(description = "Tipo de Medida do Produto", example = "KG")
    @NotNull(message = "Measure type is required")
    private MeasureType measureType;

    @Schema(description = "Id da Categoria do Produto", example = "1")
    @NotNull(message = " Product needs a category ")
    private Long categoryId;
}
