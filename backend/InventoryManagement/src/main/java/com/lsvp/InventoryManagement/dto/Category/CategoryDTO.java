package com.lsvp.InventoryManagement.dto.Category;

import java.time.LocalDateTime;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lsvp.InventoryManagement.entity.Product;
import com.lsvp.InventoryManagement.enums.FoodType;
import lombok.Data;

@Data
public class CategoryDTO {
    private Long id;
    private String description;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private FoodType food_type;

    @JsonIgnore
    private Set<Product> products;
}
