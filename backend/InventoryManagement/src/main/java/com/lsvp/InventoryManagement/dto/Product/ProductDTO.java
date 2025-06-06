package com.lsvp.InventoryManagement.dto.Product;

import com.lsvp.InventoryManagement.entity.Category;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductDTO {

    private Long id;
    private String gtin;
    private BigDecimal measure;
    private String measureType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Category category;


}
