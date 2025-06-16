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

    @NotBlank(message = "Gtin cannot be blank!!")
    private String gtin;

    private BigDecimal measure;

    private MeasureType measureType;

    @NotNull(message = "Product must have a category!")
    private Long categoryId;

}
