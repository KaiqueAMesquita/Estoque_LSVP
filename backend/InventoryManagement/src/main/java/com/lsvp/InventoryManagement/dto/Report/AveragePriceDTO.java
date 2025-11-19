package com.lsvp.InventoryManagement.dto.Report;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AveragePriceDTO {

    private Long categoryId;
    private String categoryDescription;
    private int year;
    private int month;

    private double averagePrice;

    public AveragePriceDTO(Long categoryId, String categoryDescription, int year, int month, Double averagePrice) {
        this.categoryId = categoryId;
        this.categoryDescription = categoryDescription;
        this.year = year;
        this.month = month;
        this.averagePrice = (averagePrice != null) ? averagePrice : 0.0;
    }

}
