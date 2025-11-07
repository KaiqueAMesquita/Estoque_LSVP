package com.lsvp.InventoryManagement.dto.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.lsvp.InventoryManagement.entity.Category;
import com.lsvp.InventoryManagement.enums.MeasureType;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data

@Schema(description = "DTO para atualização de Produtos")
public class ProductUpdateDTO {

    @Schema(description = "GTIN do Produto", example = "7898080640833")
    @NotBlank(message = "Gtin cannot be blank!!")
    private String gtin;

    @Schema(description = "Medida do Produto", example = "2")
    private BigDecimal measure;

    @Schema(description = "Tipo de Medida do Produto", example = "g")
    private MeasureType measureType;

    @Schema(description = "Id da Categoria do Produto", example = "1")
    @NotNull(message = "Product must have a category!")
    private Long categoryId;

}
