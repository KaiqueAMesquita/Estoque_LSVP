package com.lsvp.InventoryManagement.dto;

import com.lsvp.InventoryManagement.enums.FoodType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Schema(description = "DTO para criação de categoria")
public class CategoryCreateDTO {

    @NotBlank(message = "Description is required")
    @Schema(description = "Descrição da categoria", example = "Arroz")
    private String description;

    // Faz sentido deixar um campo mensagem para o created_at?
    // Porque ele é criado pelo próprio sistema
    @NotNull(message = "'Created At' field is required")
    private LocalDateTime created_at;

    @NotBlank(message = "Category type is required")
    @Schema(description = "Tipo da categoria", example = "Perecível")
    private FoodType food_type;
}
