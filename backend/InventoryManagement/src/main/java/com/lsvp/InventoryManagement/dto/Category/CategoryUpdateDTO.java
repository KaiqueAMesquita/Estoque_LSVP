package com.lsvp.InventoryManagement.dto.Category;

import java.time.LocalDateTime;

import com.lsvp.InventoryManagement.enums.FoodType;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data

@Schema(description = "DTO para atualização da categoria")
public class CategoryUpdateDTO {
    private String description;
    private FoodType food_type;
    private int min_quantity;
    private int max_quantity;
}
