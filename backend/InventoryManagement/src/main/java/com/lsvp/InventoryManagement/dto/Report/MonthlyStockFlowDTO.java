package com.lsvp.InventoryManagement.dto.Report;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MonthlyStockFlowDTO {

    private Long categoryId;
    private String categoryDescription;
    private int year;
    private int month;
    private long totalQuantityIn;  // Total de entradas (ENTRADA)
    private long totalQuantityOut; // Total de saídas (SAIDA + CONSUMO)
    private long netChange; // Saldo do mês (In - Out)

    public MonthlyStockFlowDTO(Long categoryId, String categoryDescription, int year, int month, Long totalQuantityIn, Long totalQuantityOut) {
        this.categoryId = categoryId;
        this.categoryDescription = categoryDescription;
        this.year = year;
        this.month = month;
        this.totalQuantityIn = (totalQuantityIn != null) ? totalQuantityIn : 0;
        this.totalQuantityOut = (totalQuantityOut != null) ? totalQuantityOut : 0;
        this.netChange = this.totalQuantityIn - this.totalQuantityOut;
    }
}
