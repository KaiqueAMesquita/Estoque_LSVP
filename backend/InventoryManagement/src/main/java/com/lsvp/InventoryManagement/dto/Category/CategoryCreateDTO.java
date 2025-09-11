package com.lsvp.InventoryManagement.dto.Category;

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

    // Lucas: Faz sentido deixar um campo mensagem para o created_at?
    // Porque ele é criado pelo próprio sistema
    // Resposta Gustavo: Acredito que não.

    // Lucas: Comentei porque o valor é definido pelo próprio sistema
//    @NotNull(message = "'Created At' field is required")
//    private LocalDateTime created_at;

    @NotNull(message = "Category type is required")
    @Schema(description = "Tipo da categoria", example = "NAO_PERECIVEL")
    private FoodType food_type;

    @Schema(description = "Quantidade mínima necessária da categoria em estoque", example = "25")
    private int min_quantity;

    @Schema(description = "Quantidade máxima possível da categoria em estoque", example = "100")
    private int max_quantity;
}
