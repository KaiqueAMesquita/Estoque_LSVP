package com.lsvp.InventoryManagement.dto.Product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lsvp.InventoryManagement.entity.Category;
import com.lsvp.InventoryManagement.entity.Unit;
import com.lsvp.InventoryManagement.enums.MeasureType;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class ProductDTO {
    private Long id;
    private String gtin;
    private BigDecimal measure;
    private MeasureType measureType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    //Campo category
    private String description;
    
    @JsonIgnore
    private Category category;
    @JsonIgnore
    private Set<Unit> units;
}
