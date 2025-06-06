package com.lsvp.InventoryManagement.dto.Product;

import com.lsvp.InventoryManagement.entity.Category;
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

    @NotBlank(message = "Gtin is required")
    private String gtin;

    @NotNull(message = "Measure is required")
    private BigDecimal measure;

    @NotBlank(message = "Measure type is required")
    private String measureType;

    @NotNull
    private LocalDateTime createdAt;

    @NotNull(message = " Product needs a category ")
    private Long categoryId;
}
