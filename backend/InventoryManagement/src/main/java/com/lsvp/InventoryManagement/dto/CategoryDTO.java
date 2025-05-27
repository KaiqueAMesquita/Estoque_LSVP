package com.lsvp.InventoryManagement.dto;

import java.time.LocalDateTime;

import com.lsvp.InventoryManagement.enums.FoodType;
import lombok.Data;

@Data
public class CategoryDTO {
    private Long id;
    private String description;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private FoodType food_type;
}
